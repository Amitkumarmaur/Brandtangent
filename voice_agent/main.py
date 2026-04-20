"""
main.py — Entry point for the DigiiMark Voice AI Agent.

What this does on startup:
  1. Validates environment (API key, etc.)
  2. Builds the FAISS vector store from knowledge_base/ documents
  3. Starts the file watcher (watchdog) in a background thread
  4. Launches the voice agent call loop
  5. On exit: stops the watcher, saves transcript

Run:
    python main.py

Optional flags:
    python main.py --list-calls       # Print calls log
    python main.py --list-devices     # List audio devices
    python main.py --index-only       # Re-index knowledge base and exit
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

# ─── Bootstrap path so imports work from this directory ───────────────────────
sys.path.insert(0, str(Path(__file__).parent))

# ─── Logging setup (must happen before any module imports) ────────────────────
import config  # noqa: E402  (sets up paths, validates API key)

logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL, logging.INFO),
    format="[%(asctime)s] %(levelname)-8s %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("digiimark.main")

# ─── Rich console for pretty startup output ───────────────────────────────────
from rich.console import Console          # noqa: E402
from rich.panel import Panel              # noqa: E402
from rich.table import Table              # noqa: E402
from rich import print as rprint          # noqa: E402

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
        help="Print the calls log and exit.",
    )
    p.add_argument(
        "--list-devices",
        action="store_true",
        help="List available audio input/output devices and exit.",
    )
    p.add_argument(
        "--index-only",
        action="store_true",
        help="Index knowledge_base/ documents and exit (no call).",
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
    """Print all calls from calls_log.json."""
    from transcript_manager import TranscriptManager
    entries = TranscriptManager.load_calls_log()

    if not entries:
        console.print("[yellow]No calls recorded yet.[/yellow]")
        return

    table = Table(title="📞 Calls Log", show_lines=True)
    table.add_column("Call ID", style="cyan", no_wrap=True)
    table.add_column("Date", style="white")
    table.add_column("Time", style="white")
    table.add_column("Duration", justify="right")
    table.add_column("Turns", justify="right")
    table.add_column("Topics", style="dim")
    table.add_column("Tools Used", style="yellow")
    table.add_column("Transcript", style="dim")

    for e in reversed(entries):  # newest first
        duration = e.get("duration_seconds", 0)
        table.add_row(
            e.get("call_id", "?"),
            e.get("date", ""),
            e.get("time", ""),
            f"{duration // 60}m {duration % 60}s",
            str(e.get("turn_count", 0)),
            ", ".join(e.get("topics", [])) or "—",
            ", ".join(e.get("tools_used", [])) or "—",
            Path(e.get("transcript_file", "")).name,
        )

    console.print(table)


def _show_call(call_id: str) -> None:
    """Print the transcript for a single call."""
    from transcript_manager import TranscriptManager
    entry = TranscriptManager.find_call(call_id)
    if not entry:
        console.print(f"[red]Call '{call_id}' not found in log.[/red]")
        return

    tf = Path(entry["transcript_file"])
    if tf.exists():
        console.print(tf.read_text(encoding="utf-8"))
    else:
        console.print(f"[red]Transcript file not found: {tf}[/red]")


def _list_devices() -> None:
    """Print all available PyAudio audio devices."""
    import pyaudio
    pa = pyaudio.PyAudio()
    table = Table(title="🎤 Audio Devices", show_lines=True)
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


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    args = _build_parser().parse_args()

    # ── Utility-only commands ──────────────────────────────────────────────
    if args.list_devices:
        _list_devices()
        return

    if args.list_calls:
        _list_calls()
        return

    if args.call_id:
        _show_call(args.call_id)
        return

    # ── Startup banner ─────────────────────────────────────────────────────
    console.print(
        Panel(
            "[bold cyan]DigiiMark Voice AI Agent[/bold cyan]\n"
            f"Agent Name : [white]{config.AGENT_NAME}[/white]\n"
            f"Voice      : [white]{config.AGENT_VOICE}[/white]\n"
            f"Model      : [white]{config.LIVE_MODEL}[/white]\n"
            f"Embed Model: [white]{config.EMBEDDING_MODEL}[/white]\n"
            f"KB Dir     : [dim]{config.KNOWLEDGE_BASE_DIR}[/dim]\n"
            f"Transcripts: [dim]{config.TRANSCRIPTS_DIR}[/dim]",
            title="🚀 Starting Up",
            border_style="cyan",
        )
    )

    # ── Step 1: Build vector store ─────────────────────────────────────────
    console.print("\n[bold]Step 1/3[/bold] — Building knowledge base (RAG)…")
    from rag.indexer import build_vector_store, start_watcher
    vector_store = build_vector_store()
    console.print(
        f"[green]✓ Vector store ready:[/green] "
        f"{vector_store.total_chunks} chunk(s) indexed."
    )

    if args.index_only:
        console.print("[yellow]--index-only flag set. Exiting.[/yellow]")
        return

    # ── Step 2: Start file watcher ─────────────────────────────────────────
    console.print("\n[bold]Step 2/3[/bold] — Starting knowledge base file watcher…")
    watcher = start_watcher(vector_store)
    console.print(
        f"[green]✓ Watching:[/green] [dim]{config.KNOWLEDGE_BASE_DIR}[/dim]"
    )

    # ── Step 3: Start voice agent ──────────────────────────────────────────
    console.print(
        f"\n[bold]Step 3/3[/bold] — Launching voice agent "
        f"[cyan]{config.AGENT_NAME}[/cyan]…\n"
    )

    from agent import DigiiMarkVoiceAgent
    agent = DigiiMarkVoiceAgent(vector_store=vector_store)

    try:
        agent.run()
    finally:
        watcher.stop()
        console.print("\n[dim]Voice agent stopped. Goodbye![/dim]")


if __name__ == "__main__":
    main()
