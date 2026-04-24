"""
transcript_manager.py — Persist call transcripts to Supabase.

Writes three tables:
  * voice_calls            — one row per call
  * voice_call_turns       — one row per conversation turn
  * voice_call_tool_calls  — one row per tool invocation

Calls are created on start_call() (so they appear in admin dashboards while
still live). Turns and tool calls are buffered in memory during the call and
flushed in a single batched write from end_call() — this keeps the Gemini
Live loop latency-free.

Public interface is preserved from the previous file-based implementation so
server.py and agent.py do not need to change call sites.
"""

from __future__ import annotations

import logging
import os
import sys
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

sys.path.insert(0, os.path.dirname(__file__))
import config
from supabase_client import get_client

logger = logging.getLogger(__name__)


def _make_call_id() -> str:
    """8-char hex id, matches the previous format for easy cross-referencing."""
    return uuid.uuid4().hex[:8]


class TranscriptManager:
    """
    Usage:
        tm = TranscriptManager()
        call_id = tm.start_call(caller_metadata={"source": "web"})

        tm.add_turn(call_id, role="user", content="Hello")
        tm.add_turn(call_id, role="assistant", content="Hi! How can I help?")
        tm.add_tool_call(call_id, "calendar_tool", {...}, {...})

        tm.end_call(call_id, topics=["pricing"])
    """

    def __init__(self) -> None:
        # In-memory buffer: {call_id: {"started_at", "turns", "tool_calls"}}
        self._calls: Dict[str, Dict[str, Any]] = {}

    # ── Lifecycle ──────────────────────────────────────────────────────────

    def start_call(self, caller_metadata: Optional[Dict[str, Any]] = None) -> str:
        """Insert a voice_calls row and start buffering turns/tool calls."""
        call_id = _make_call_id()
        now = datetime.now(tz=timezone.utc)

        self._calls[call_id] = {
            "started_at": now,
            "turns": [],
            "tool_calls": [],
        }

        try:
            get_client().table("voice_calls").insert({
                "call_id": call_id,
                "started_at": now.isoformat(),
                "agent_name": config.AGENT_NAME,
                "voice_name": config.AGENT_VOICE,
                "model": config.LIVE_MODEL,
                "caller_metadata": caller_metadata or {},
            }).execute()
        except Exception as exc:
            logger.warning(
                "Could not insert voice_calls row (call will still be buffered): %s",
                exc,
            )

        logger.info("Call started | ID: %s", call_id)
        return call_id

    def add_turn(self, call_id: str, role: str, content: str) -> None:
        """Buffer a conversation turn (in memory until end_call)."""
        call = self._calls.get(call_id)
        if not call:
            logger.warning("add_turn: unknown call_id %s", call_id)
            return
        call["turns"].append({
            "role": role,
            "content": content,
            "ts": datetime.now(tz=timezone.utc),
        })

    def add_tool_call(
        self,
        call_id: str,
        tool_name: str,
        args: Dict[str, Any],
        result: Dict[str, Any],
    ) -> None:
        """Buffer a tool invocation."""
        call = self._calls.get(call_id)
        if not call:
            return
        call["tool_calls"].append({
            "tool": tool_name,
            "args": args or {},
            "result": result or {},
            "ts": datetime.now(tz=timezone.utc),
        })

    def end_call(
        self,
        call_id: str,
        topics: Optional[List[str]] = None,
    ) -> None:
        """Flush buffered turns/tool calls and finalise the voice_calls row."""
        call = self._calls.pop(call_id, None)
        if not call:
            logger.error("end_call: unknown call_id %s", call_id)
            return

        ended_at = datetime.now(tz=timezone.utc)
        started_at: datetime = call["started_at"]
        duration = int((ended_at - started_at).total_seconds())

        client = get_client()

        # Bulk insert turns.
        if call["turns"]:
            turn_rows = [
                {
                    "call_id": call_id,
                    "turn_index": i,
                    "role": t["role"],
                    "content": t["content"],
                    "created_at": t["ts"].isoformat(),
                }
                for i, t in enumerate(call["turns"])
            ]
            try:
                client.table("voice_call_turns").insert(turn_rows).execute()
            except Exception as exc:
                logger.error("Failed to insert voice_call_turns: %s", exc)

        # Bulk insert tool calls.
        if call["tool_calls"]:
            tool_rows = [
                {
                    "call_id": call_id,
                    "tool_name": tc["tool"],
                    "args": tc["args"],
                    "result": tc["result"],
                    "called_at": tc["ts"].isoformat(),
                }
                for tc in call["tool_calls"]
            ]
            try:
                client.table("voice_call_tool_calls").insert(tool_rows).execute()
            except Exception as exc:
                logger.error("Failed to insert voice_call_tool_calls: %s", exc)

        tools_used = sorted({tc["tool"] for tc in call["tool_calls"]})

        # Finalise the calls row.
        try:
            client.table("voice_calls").update({
                "ended_at": ended_at.isoformat(),
                "duration_seconds": duration,
                "topics": topics or [],
                "tools_used": tools_used,
                "turn_count": len(call["turns"]),
            }).eq("call_id", call_id).execute()
        except Exception as exc:
            logger.error("Failed to finalise voice_calls row: %s", exc)

        logger.info(
            "Call %s ended | duration=%ds | turns=%d | tools=%s",
            call_id, duration, len(call["turns"]), tools_used,
        )

    # ── Query helpers (used by CLI + /api/calls endpoints) ─────────────────

    @staticmethod
    def load_calls_log(limit: int = 50) -> List[Dict[str, Any]]:
        """Return recent calls (newest first)."""
        try:
            res = (
                get_client()
                .table("voice_calls")
                .select("*")
                .order("started_at", desc=True)
                .limit(limit)
                .execute()
            )
            return res.data or []
        except Exception as exc:
            logger.error("load_calls_log failed: %s", exc)
            return []

    @staticmethod
    def find_call(call_id: str) -> Optional[Dict[str, Any]]:
        """Look up a single call by ID."""
        try:
            res = (
                get_client()
                .table("voice_calls")
                .select("*")
                .eq("call_id", call_id)
                .limit(1)
                .execute()
            )
            rows = res.data or []
            return rows[0] if rows else None
        except Exception as exc:
            logger.error("find_call failed: %s", exc)
            return None
