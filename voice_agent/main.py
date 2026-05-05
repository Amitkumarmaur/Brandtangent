"""
main.py — Entry point for the DigiiMark Voice AI Agent (terminal mode).

On startup:
  1. Validates environment (Gemini key, Supabase credentials)
  2. Launches the terminal voice agent call loop (PyAudio-based)

Knowledge base syncing happens via a dedicated script now; use:

    python scripts/sync_voice_kb.py

Run:
    python main.py

Optional flags:
    python main.py --list-calls       # Print recent calls from Supabase
    python main.py --call-id <id>     # Print one call's transcript
    python main.py --list-devices     # List audio devices
    python main.py --sync-kb          # Re-sync knowledge base from Supabase content
"""

from __future__ import annotations

import argparse
import logging
import subprocess
import sys
from pathlib import Path

# ─── Bootstrap path so imports work from this directory ───────────────────────
sys.path.insert(0, str(Path(__file__).parent))

# ─── Logging setup (must happen before any module imports) ────────────────────
import config  # noqa: E402  (validates env)

logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL, logging.INFO),
    format="[%(asctime)s] %(levelname)-8s %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("digiimark.main")

from rich.console import Console  # noqa: E402
from rich.panel import Panel  # noqa: E402
from rich.table import Table  # noqa: E402

console = Console()


# ─── CLI argument parser ──────────────────────────────────────────────────────

def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="python main.py",
        description="DigiiMark Voice AI Agent",
    )
    p.add_argument(
        "--list-calls",
        action="store_true",
        help="Print the most recent calls from Supabase and exit.",
    )
    p.add_argument(
        "--list-devices",
        action="store_true",
        help="List available audio input/output devices and exit.",
    )
    p.add_argument(
        "--sync-kb",
        action="store_true",
        help="Run the knowledge base sync script and exit.",
    )
    p.add_argument(
        "--call-id",
        type=str,
        default=None,
        help="Show transcript for a specific call ID.",
    )
    return p


# ─── Utility commands ─────────────────────────────────────────────────────────

def _list_calls() -> None:
    """Print recent calls from Supabase."""
    from supabase_client import get_client

    try:
        res = (
            get_client()
            .table("voice_calls")
            .select("*")
            .order("started_at", desc=True)
            .limit(50)
            .execute()
        )
        entries = res.data or []
    except Exception as exc:
        console.print(f"[red]Failed to load calls from Supabase: {exc}[/red]")
        return

    if not entries:
        console.print("[yellow]No calls recorded yet.[/yellow]")
        return

    table = Table(title="Calls Log (Supabase)", show_lines=True)
    table.add_column("Call ID", style="cyan", no_wrap=True)
    table.add_column("Started", style="white")
    table.add_column("Duration", justify="right")
    table.add_column("Turns", justify="right")
    table.add_column("Topics", style="dim")
    table.add_column("Tools", style="yellow")

    for e in entries:
        duration = e.get("duration_seconds") or 0
        table.add_row(
            str(e.get("call_id", "?")),
            str(e.get("started_at", ""))[:19],
            f"{duration // 60}m {duration % 60}s",
            str(e.get("turn_count", 0)),
            ", ".join(e.get("topics") or []) or "—",
            ", ".join(e.get("tools_used") or []) or "—",
        )

    console.print(table)


def _show_call(call_id: str) -> None:
    """Print a call's transcript from Supabase."""
    from supabase_client import get_client

    client = get_client()
    try:
        call_res = (
            client.table("voice_calls").select("*").eq("call_id", call_id).execute()
        )
        if not call_res.data:
            console.print(f"[red]Call '{call_id}' not found.[/red]")
            return
        call = call_res.data[0]

        turns_res = (
            client.table("voice_call_turns")
            .select("turn_index, role, content")
            .eq("call_id", call_id)
            .order("turn_index")
            .execute()
        )
        tools_res = (
            client.table("voice_call_tool_calls")
            .select("tool_name, args, result, called_at")
            .eq("call_id", call_id)
            .order("called_at")
            .execute()
        )
    except Exception as exc:
        console.print(f"[red]Supabase query failed: {exc}[/red]")
        return

    duration = call.get("duration_seconds") or 0
    console.print(
        Panel(
            f"Call ID: [cyan]{call['call_id']}[/cyan]\n"
            f"Started: {call.get('started_at')}\n"
            f"Duration: {duration // 60}m {duration % 60}s\n"
            f"Topics: {', '.join(call.get('topics') or []) or '—'}\n"
            f"Tools: {', '.join(call.get('tools_used') or []) or '—'}",
            title="Call",
            border_style="green",
        )
    )

    for t in turns_res.data or []:
        role = t.get("role", "user")
        content = t.get("content", "")
        label = "[white]  You[/white]" if role == "user" else f"[cyan]{config.AGENT_NAME}[/cyan]"
        console.print(f"{label}: {content}")

    for tc in tools_res.data or []:
        console.print(
            f"[yellow]Tool[/yellow] [bold]{tc['tool_name']}[/bold] args={tc['args']} result={tc['result']}"
        )


def _list_devices() -> None:
    """Print all PyAudio audio devices (terminal mode convenience)."""
    try:
        import pyaudio
    except ImportError:
        console.print(
            "[red]PyAudio is not installed.[/red] "
            "Install it in a separate CLI-only env: [dim]pip install pyaudio[/dim]"
        )
        return

    pa = pyaudio.PyAudio()
    table = Table(title="Audio Devices", show_lines=True)
    table.add_column("Index", justify="right", style="cyan")
    table.add_column("Name")
    table.add_column("Inputs", justify="right")
    table.add_column("Outputs", justify="right")
    table.add_column("Sample Rate", justify="right")

    for i in range(pa.get_device_count()):
        info = pa.get_device_info_by_index(i)
        table.add_row(
            str(i),
            info["name"],
            str(int(info["maxInputChannels"])),
            str(int(info["maxOutputChannels"])),
            str(int(info["defaultSampleRate"])),
        )
    pa.terminate()
    console.print(table)


def _sync_kb() -> None:
    """Shell out to scripts/sync_voice_kb.py — keeps the path simple."""
    script = Path(__file__).parent / "scripts" / "sync_voice_kb.py"
    if not script.exists():
        console.print(f"[red]Sync script not found: {script}[/red]")
        return

    console.print("[cyan]Running knowledge base sync...[/cyan]\n")
    rc = subprocess.call([sys.executable, str(script)])
    sys.exit(rc)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    args = _build_parser().parse_args()

    if args.list_devices:
        _list_devices()
        return

    if args.list_calls:
        _list_calls()
        return

    if args.call_id:
        _show_call(args.call_id)
        return

    if args.sync_kb:
        _sync_kb()
        return

    console.print(
        Panel(
            "[bold cyan]DigiiMark Voice AI Agent (Terminal Mode)[/bold cyan]\n"
            f"Agent Name : [white]{config.AGENT_NAME}[/white]\n"
            f"Voice      : [white]{config.AGENT_VOICE}[/white]\n"
            f"Model      : [white]{config.LIVE_MODEL}[/white]\n"
            f"Embed Model: [white]{config.EMBEDDING_MODEL}[/white] ({config.EMBEDDING_DIMENSION}d)\n"
            f"Supabase   : [dim]{config.SUPABASE_URL}[/dim]",
            title="Starting Up",
            border_style="cyan",
        )
    )

    from agent import DigiiMarkVoiceAgent

    agent = DigiiMarkVoiceAgent()

    try:
        agent.run()
    finally:
        console.print("\n[dim]Voice agent stopped. Goodbye![/dim]")


if __name__ == "__main__":
    main()
