"""
transcript_manager.py — Persist chat sessions to Supabase.

Writes three tables (mirrors the voice agent's pattern):
  * chat_sessions            — one row per session
  * chat_session_turns       — one row per conversation turn (with citations)
  * chat_session_tool_calls  — one row per tool invocation

Sessions are inserted on start_session() (so they appear in dashboards while
still live). Turns and tool calls stream into Supabase as they happen so a
crashed session still leaves a usable transcript. The end_session() call
finalises the chat_sessions row with duration / topics / tools_used.

Public interface preserved from the previous file-based implementation:
the server only had to swap the import.
"""

from __future__ import annotations

import json
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


def _session_id() -> str:
    """12-char hex id; matches the previous format for cross-referencing."""
    return uuid.uuid4().hex[:12]


class ChatTranscriptManager:
    """In-memory bookkeeping for live sessions; everything is also persisted to Supabase."""

    def __init__(self) -> None:
        # Per-session counters / state we need locally:
        #   {session_id: {started_at, turns: [...], tool_calls: [...], turn_count}}
        self._sessions: Dict[str, Dict[str, Any]] = {}

    # ── Lifecycle ──────────────────────────────────────────────────────────

    def start_session(self, user_identifier: Optional[str] = None) -> str:
        sid = _session_id()
        now = datetime.now(tz=timezone.utc)
        self._sessions[sid] = {
            "session_id": sid,
            "user_identifier": user_identifier or "anonymous",
            "started_at": now,
            "turns": [],
            "tool_calls": [],
            "turn_count": 0,
        }

        try:
            get_client().table("chat_sessions").insert({
                "session_id": sid,
                "started_at": now.isoformat(),
                "agent_name": config.AGENT_NAME,
                "model": config.CHAT_MODEL,
                "user_identifier": user_identifier or None,
            }).execute()
        except Exception as exc:
            logger.warning(
                "Could not insert chat_sessions row (session will still be buffered): %s",
                exc,
            )

        logger.info("Chat session started | %s", sid)
        return sid

    def set_user_identifier(self, session_id: str, user_identifier: str) -> None:
        s = self._sessions.get(session_id)
        if not s or not user_identifier.strip():
            return
        s["user_identifier"] = user_identifier.strip()
        try:
            get_client().table("chat_sessions").update({
                "user_identifier": user_identifier.strip(),
            }).eq("session_id", session_id).execute()
        except Exception as exc:
            logger.debug("Could not update user_identifier: %s", exc)

    # ── Turns ──────────────────────────────────────────────────────────────

    def add_user_turn(self, session_id: str, content: str) -> None:
        self._add_turn(session_id, role="user", content=content, citations=None)

    def add_model_turn(
        self,
        session_id: str,
        content: str,
        citations: Optional[List[Dict[str, Any]]] = None,
    ) -> None:
        self._add_turn(session_id, role="assistant", content=content, citations=citations)

    def _add_turn(
        self,
        session_id: str,
        role: str,
        content: str,
        citations: Optional[List[Dict[str, Any]]],
    ) -> None:
        s = self._sessions.get(session_id)
        if not s:
            logger.warning("_add_turn: unknown session %s", session_id)
            return

        turn_index = s["turn_count"]
        s["turn_count"] += 1
        ts = datetime.now(tz=timezone.utc)
        s["turns"].append({
            "role": role,
            "content": content,
            "ts": ts,
            "turn_index": turn_index,
            "citations": citations or [],
        })

        try:
            get_client().table("chat_session_turns").insert({
                "session_id": session_id,
                "turn_index": turn_index,
                "role": role,
                "content": content,
                "citations": citations or [],
                "created_at": ts.isoformat(),
            }).execute()
        except Exception as exc:
            logger.warning("Could not persist chat turn (still buffered): %s", exc)

    # ── Tool calls ─────────────────────────────────────────────────────────

    def add_tool_call(
        self,
        session_id: str,
        tool_name: str,
        args: Dict[str, Any],
        result: Dict[str, Any],
    ) -> None:
        s = self._sessions.get(session_id)
        if not s:
            return
        ts = datetime.now(tz=timezone.utc)
        s["tool_calls"].append({
            "tool": tool_name,
            "args": args or {},
            "result": result or {},
            "ts": ts,
        })
        try:
            get_client().table("chat_session_tool_calls").insert({
                "session_id": session_id,
                "tool_name": tool_name,
                "args": args or {},
                "result": result or {},
                "called_at": ts.isoformat(),
            }).execute()
        except Exception as exc:
            logger.warning("Could not persist chat tool call: %s", exc)

    # ── End / finalise ─────────────────────────────────────────────────────

    def end_session(
        self,
        session_id: str,
        topics: Optional[List[str]] = None,
        outcome: str = "completed",
    ) -> Optional[Dict[str, Any]]:
        """
        Finalise the chat_sessions row (duration, turn_count, topics, tools_used).

        Returns the final row dict on success, or None if the session was
        unknown.  No file is written — the source of truth is Supabase.
        """
        s = self._sessions.pop(session_id, None)
        if not s:
            logger.error("end_session: unknown session %s", session_id)
            return None

        ended = datetime.now(tz=timezone.utc)
        started: datetime = s["started_at"]
        duration = int((ended - started).total_seconds())

        if topics is None:
            transcript_blob = "\n".join(f"{t['role']}: {t['content']}" for t in s["turns"])
            topic_list = self.infer_topics(transcript_blob)
        else:
            topic_list = list(topics)

        tools_used = sorted({tc["tool"] for tc in s["tool_calls"]})

        update_payload: Dict[str, Any] = {
            "ended_at": ended.isoformat(),
            "duration_seconds": duration,
            "topics": topic_list,
            "tools_used": tools_used,
            "turn_count": len(s["turns"]),
            "outcome": outcome,
        }

        try:
            get_client().table("chat_sessions").update(update_payload).eq(
                "session_id", session_id
            ).execute()
        except Exception as exc:
            logger.error("Failed to finalise chat_sessions row %s: %s", session_id, exc)
            return None

        logger.info(
            "Session %s ended | duration=%ds | turns=%d | tools=%s | outcome=%s",
            session_id, duration, len(s["turns"]), tools_used, outcome,
        )
        return {
            "session_id": session_id,
            "duration_seconds": duration,
            "turn_count": len(s["turns"]),
            "topics": topic_list,
            "tools_used": tools_used,
            "outcome": outcome,
        }

    # ── Topic inference (best-effort) ──────────────────────────────────────

    def infer_topics(self, transcript_text: str) -> List[str]:
        """Lightweight topic tags from transcript via a quick Gemini call."""
        if not transcript_text.strip():
            return []
        try:
            from gemini_client import client

            prompt = (
                "From this customer chat, output ONLY a JSON object "
                'with key "topics" whose value is an array of 3–6 short '
                'topic strings (2–4 words each). No markdown.\n\n'
                + transcript_text[:12000]
            )
            r = client.models.generate_content(
                model=config.CHAT_MODEL,
                contents=prompt,
            )
            text = (r.text or "").strip()
            start = text.find("{")
            end = text.rfind("}") + 1
            if start >= 0 and end > start:
                data = json.loads(text[start:end])
                topics = data.get("topics")
                if isinstance(topics, list):
                    return [str(x) for x in topics[:8]]
        except Exception as exc:
            logger.debug("Topic inference skipped: %s", exc)
        return []

    # ── Query helpers (used by /api/sessions endpoints) ────────────────────

    @staticmethod
    def list_sessions(limit: int = 50) -> List[Dict[str, Any]]:
        try:
            res = (
                get_client()
                .table("chat_sessions")
                .select("*")
                .order("started_at", desc=True)
                .limit(limit)
                .execute()
            )
            return res.data or []
        except Exception as exc:
            logger.error("list_sessions failed: %s", exc)
            return []

    @staticmethod
    def get_session(session_id: str) -> Optional[Dict[str, Any]]:
        try:
            client = get_client()
            sess = (
                client.table("chat_sessions")
                .select("*")
                .eq("session_id", session_id)
                .limit(1)
                .execute()
            )
            if not sess.data:
                return None
            row = sess.data[0]
            turns = (
                client.table("chat_session_turns")
                .select("turn_index, role, content, citations, created_at")
                .eq("session_id", session_id)
                .order("turn_index")
                .execute()
            )
            tools = (
                client.table("chat_session_tool_calls")
                .select("tool_name, args, result, called_at")
                .eq("session_id", session_id)
                .order("called_at")
                .execute()
            )
            row["turns"] = turns.data or []
            row["tool_calls"] = tools.data or []
            return row
        except Exception as exc:
            logger.error("get_session failed: %s", exc)
            return None
