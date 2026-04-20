"""
transcript_manager.py — Save call transcripts and maintain the calls log.

After every conversation:
  1. Writes a Markdown transcript to transcripts/YYYY-MM-DD_HH-MM-SS_<id>.md
  2. Appends a metadata record to transcripts/calls_log.json

calls_log.json format:
[
  {
    "call_id":         "abc123",
    "date":            "2026-04-15",
    "time":            "11:30:00",
    "duration_seconds": 180,
    "transcript_file": "transcripts/2026-04-15_11-30-00_abc123.md",
    "topics":          ["pricing", "SEO", "appointment"],
    "tools_used":      ["calendar_tool"],
    "turn_count":      12
  },
  ...
]
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import config

logger = logging.getLogger(__name__)


# ─── Data models (plain dicts for simplicity) ─────────────────────────────────

def _make_call_id() -> str:
    return uuid.uuid4().hex[:8]


# ─── Transcript Writer ────────────────────────────────────────────────────────

class TranscriptManager:
    """
    Manages saving call transcripts and the master calls log.

    Usage:
        tm = TranscriptManager()
        call_id = tm.start_call()

        # During the call:
        tm.add_turn(call_id, role="user", content="Hello")
        tm.add_turn(call_id, role="assistant", content="Hi! How can I help?")
        tm.add_tool_call(call_id, tool_name="calendar_tool", args={...}, result={...})

        # After the call:
        tm.end_call(call_id, topics=["pricing"])
    """

    def __init__(self):
        config.TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
        self._calls: Dict[str, Dict[str, Any]] = {}  # in-memory, keyed by call_id

    # ── Call lifecycle ─────────────────────────────────────────────────────

    def start_call(self) -> str:
        """Initialize a new call record. Returns the call_id."""
        call_id = _make_call_id()
        now = datetime.now(tz=timezone.utc)
        self._calls[call_id] = {
            "call_id": call_id,
            "started_at": now,
            "turns": [],          # List[{"role": str, "content": str, "ts": str}]
            "tool_calls": [],     # List[{"tool": str, "args": dict, "result": dict, "ts": str}]
        }
        logger.info("📞 Call started | ID: %s", call_id)
        return call_id

    def add_turn(self, call_id: str, role: str, content: str) -> None:
        """
        Record a conversation turn.

        Args:
            call_id: The active call identifier.
            role:    "user" or "assistant".
            content: Transcribed text of the turn.
        """
        call = self._calls.get(call_id)
        if not call:
            logger.warning("add_turn: unknown call_id %s", call_id)
            return
        call["turns"].append({
            "role": role,
            "content": content,
            "ts": datetime.now(tz=timezone.utc).isoformat(),
        })

    def add_tool_call(
        self,
        call_id: str,
        tool_name: str,
        args: Dict[str, Any],
        result: Dict[str, Any],
    ) -> None:
        """Record a tool invocation and its result."""
        call = self._calls.get(call_id)
        if not call:
            return
        call["tool_calls"].append({
            "tool": tool_name,
            "args": args,
            "result": result,
            "ts": datetime.now(tz=timezone.utc).isoformat(),
        })

    def end_call(
        self,
        call_id: str,
        topics: Optional[List[str]] = None,
    ) -> Optional[Path]:
        """
        Finalise the call, write the transcript, and update calls_log.json.

        Args:
            call_id: The call to finalise.
            topics:  Optional list of topics discussed (used in the log).

        Returns:
            Path to the written transcript file, or None on error.
        """
        call = self._calls.pop(call_id, None)
        if not call:
            logger.error("end_call: unknown call_id %s", call_id)
            return None

        ended_at = datetime.now(tz=timezone.utc)
        started_at: datetime = call["started_at"]
        duration = int((ended_at - started_at).total_seconds())

        date_str = started_at.strftime("%Y-%m-%d")
        time_str = started_at.strftime("%H-%M-%S")
        filename = f"{date_str}_{time_str}_{call_id}.md"
        transcript_path = config.TRANSCRIPTS_DIR / filename

        # ── Write Markdown transcript ──────────────────────────────────────
        md = self._render_markdown(call, date_str, time_str, duration, topics or [])
        try:
            transcript_path.write_text(md, encoding="utf-8")
            logger.info("📝 Transcript saved: %s", filename)
        except IOError as exc:
            logger.error("Failed to write transcript: %s", exc)
            return None

        # ── Update calls_log.json ──────────────────────────────────────────
        tools_used = list({tc["tool"] for tc in call["tool_calls"]})
        log_entry = {
            "call_id": call_id,
            "date": date_str,
            "time": started_at.strftime("%H:%M:%S"),
            "duration_seconds": duration,
            "transcript_file": str(transcript_path),
            "topics": topics or [],
            "tools_used": tools_used,
            "turn_count": len(call["turns"]),
        }
        self._append_to_log(log_entry)

        return transcript_path

    # ── Rendering ──────────────────────────────────────────────────────────

    def _render_markdown(
        self,
        call: Dict[str, Any],
        date_str: str,
        time_str: str,
        duration_seconds: int,
        topics: List[str],
    ) -> str:
        lines = [
            "# DigiiMark Voice Agent — Call Transcript",
            "",
            f"**Call ID:** `{call['call_id']}`  ",
            f"**Date:** {date_str}  ",
            f"**Time:** {time_str.replace('-', ':')} UTC  ",
            f"**Duration:** {duration_seconds // 60}m {duration_seconds % 60}s  ",
            f"**Topics:** {', '.join(topics) if topics else 'N/A'}  ",
            "",
            "---",
            "",
            "## Conversation",
            "",
        ]

        for turn in call["turns"]:
            role_label = "🧑 **User**" if turn["role"] == "user" else f"🤖 **{config.AGENT_NAME}**"
            lines.append(f"{role_label}: {turn['content']}")
            lines.append("")

        if call["tool_calls"]:
            lines += [
                "---",
                "",
                "## Tool Calls",
                "",
            ]
            for tc in call["tool_calls"]:
                lines.append(f"### `{tc['tool']}`")
                lines.append(f"**Time:** {tc['ts']}  ")
                lines.append(f"**Arguments:**")
                lines.append("```json")
                lines.append(json.dumps(tc["args"], indent=2, ensure_ascii=False))
                lines.append("```")
                lines.append(f"**Result:**")
                lines.append("```json")
                lines.append(json.dumps(tc["result"], indent=2, ensure_ascii=False))
                lines.append("```")
                lines.append("")

        lines += [
            "---",
            "",
            f"*Generated by DigiiMark Voice Agent ({config.AGENT_NAME}) — {date_str}*",
        ]
        return "\n".join(lines)

    # ── Log management ─────────────────────────────────────────────────────

    def _append_to_log(self, entry: Dict[str, Any]) -> None:
        """Append a call entry to calls_log.json."""
        log_path = config.CALLS_LOG_PATH
        existing: List[Dict] = []

        if log_path.exists():
            try:
                existing = json.loads(log_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, IOError):
                existing = []

        existing.append(entry)

        try:
            log_path.write_text(
                json.dumps(existing, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
        except IOError as exc:
            logger.error("Failed to update calls_log.json: %s", exc)

    # ── Query helpers ──────────────────────────────────────────────────────

    @staticmethod
    def load_calls_log() -> List[Dict[str, Any]]:
        """Return the full calls log as a list of dicts."""
        if not config.CALLS_LOG_PATH.exists():
            return []
        try:
            return json.loads(config.CALLS_LOG_PATH.read_text(encoding="utf-8"))
        except Exception:
            return []

    @staticmethod
    def find_call(call_id: str) -> Optional[Dict[str, Any]]:
        """Look up a specific call by ID from the log."""
        for entry in TranscriptManager.load_calls_log():
            if entry.get("call_id") == call_id:
                return entry
        return None
