"""
Run the DigiiMark Live Chat API (uvicorn) or inspect Supabase-stored sessions.

Usage:
    python main.py                       # start the FastAPI server
    python main.py --list-sessions       # print recent chat sessions
    python main.py --session-id <id>     # print one session's transcript
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import uvicorn

import config


def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="python main.py",
        description="DigiiMark Live Chat AI Agent",
    )
    p.add_argument(
        "--list-sessions",
        action="store_true",
        help="Print the most recent chat sessions from Supabase and exit.",
    )
    p.add_argument(
        "--session-id",
        type=str,
        default=None,
        help="Print a specific session's transcript and exit.",
    )
    return p


def _list_sessions() -> None:
    from transcript_manager import ChatTranscriptManager

    rows = ChatTranscriptManager.list_sessions(limit=50)
    if not rows:
        print("No chat sessions recorded yet.")
        return

    print(f"{'session_id':<14} {'started_at':<26} {'turns':>5} topics")
    print("-" * 80)
    for r in rows:
        topics = ", ".join(r.get("topics") or []) or "—"
        print(
            f"{r.get('session_id', '?'):<14} "
            f"{str(r.get('started_at', ''))[:25]:<26} "
            f"{r.get('turn_count', 0):>5} "
            f"{topics}"
        )


def _show_session(session_id: str) -> None:
    from transcript_manager import ChatTranscriptManager

    row = ChatTranscriptManager.get_session(session_id)
    if not row:
        print(f"Session '{session_id}' not found.")
        return

    duration = row.get("duration_seconds") or 0
    print(f"Session ID: {row['session_id']}")
    print(f"Started:    {row.get('started_at')}")
    print(f"Duration:   {duration // 60}m {duration % 60}s")
    print(f"Topics:     {', '.join(row.get('topics') or []) or '—'}")
    print(f"Tools:      {', '.join(row.get('tools_used') or []) or '—'}")
    print()
    for t in row.get("turns", []):
        prefix = "User" if t.get("role") == "user" else config.AGENT_NAME
        print(f"{prefix}: {t.get('content', '')}")
        print()
    for tc in row.get("tool_calls", []):
        print(f"[tool] {tc['tool_name']}({tc.get('args')}) => {tc.get('result')}")


def main() -> None:
    args = _build_parser().parse_args()

    if args.list_sessions:
        _list_sessions()
        return

    if args.session_id:
        _show_session(args.session_id)
        return

    uvicorn.run(
        "server:app",
        host=config.CHAT_WEB_HOST,
        port=config.CHAT_WEB_PORT,
        reload=False,
    )


if __name__ == "__main__":
    main()
