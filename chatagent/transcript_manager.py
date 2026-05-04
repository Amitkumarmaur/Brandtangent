"""
Persist chat transcripts (Markdown) and append session metadata to call_logs.json.
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import config

logger = logging.getLogger(__name__)


def _session_id() -> str:
    return uuid.uuid4().hex[:12]


class ChatTranscriptManager:
    """In-memory session state; on end_session writes .md and updates call_logs.json."""

    def __init__(self) -> None:
        config.TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
        self._sessions: Dict[str, Dict[str, Any]] = {}

    def start_session(self, user_identifier: Optional[str] = None) -> str:
        sid = _session_id()
        now = datetime.now(tz=timezone.utc)
        self._sessions[sid] = {
            "session_id": sid,
            "user_identifier": user_identifier or "anonymous",
            "started_at": now,
            "turns": [],
            "tool_calls": [],
        }
        logger.info("Chat session started | %s", sid)
        return sid

    def set_user_identifier(self, session_id: str, user_identifier: str) -> None:
        s = self._sessions.get(session_id)
        if s and user_identifier.strip():
            s["user_identifier"] = user_identifier.strip()

    def add_user_turn(self, session_id: str, content: str) -> None:
        s = self._sessions.get(session_id)
        if not s:
            return
        s["turns"].append(
            {
                "role": "user",
                "content": content,
                "ts": datetime.now(tz=timezone.utc).isoformat(),
            }
        )

    def add_model_turn(self, session_id: str, content: str) -> None:
        s = self._sessions.get(session_id)
        if not s:
            return
        s["turns"].append(
            {
                "role": "assistant",
                "content": content,
                "ts": datetime.now(tz=timezone.utc).isoformat(),
            }
        )

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
        s["tool_calls"].append(
            {
                "tool": tool_name,
                "args": args,
                "result": result,
                "ts": datetime.now(tz=timezone.utc).isoformat(),
            }
        )

    def end_session(
        self,
        session_id: str,
        topics: Optional[List[str]] = None,
        outcome: str = "completed",
    ) -> Optional[Path]:
        s = self._sessions.pop(session_id, None)
        if not s:
            logger.error("end_session: unknown session %s", session_id)
            return None

        ended = datetime.now(tz=timezone.utc)
        started: datetime = s["started_at"]
        duration = int((ended - started).total_seconds())

        date_str = started.strftime("%Y-%m-%d")
        time_str = started.strftime("%H-%M-%S")
        filename = f"{date_str}_{time_str}_session-{session_id}.md"
        path = config.TRANSCRIPTS_DIR / filename

        turns_blob = "\n".join(f"{t['role']}: {t['content']}" for t in s["turns"])
        if topics is not None:
            topic_list = list(topics)
        else:
            topic_list = self.infer_topics(turns_blob)
        md = self._render_md(s, date_str, time_str, duration, topic_list, outcome)
        try:
            path.write_text(md, encoding="utf-8")
            logger.info("Transcript saved: %s", filename)
        except OSError as exc:
            logger.error("Transcript write failed: %s", exc)
            return None

        tools_used = list({tc["tool"] for tc in s["tool_calls"]})
        entry = {
            "session_id": session_id,
            "started_at": started.isoformat(),
            "ended_at": ended.isoformat(),
            "duration_seconds": duration,
            "user_identifier": s["user_identifier"],
            "topics": topic_list,
            "tools_used": tools_used,
            "outcome": outcome,
            "transcript_file": f"transcripts/{filename}",
            "turn_count": len(s["turns"]),
        }
        self._append_call_log(entry)
        return path

    def _render_md(
        self,
        s: Dict[str, Any],
        date_str: str,
        time_str: str,
        duration_seconds: int,
        topics: List[str],
        outcome: str,
    ) -> str:
        lines = [
            "# DigiiMark Live Chat — Session Transcript",
            "",
            f"**Session ID:** `{s['session_id']}`  ",
            f"**User:** {s['user_identifier']}  ",
            f"**Date:** {date_str}  ",
            f"**Time (UTC):** {time_str.replace('-', ':')}  ",
            f"**Duration:** {duration_seconds // 60}m {duration_seconds % 60}s  ",
            f"**Topics:** {', '.join(topics) if topics else 'N/A'}  ",
            f"**Outcome:** {outcome}  ",
            "",
            "---",
            "",
            "## Conversation",
            "",
        ]
        for t in s["turns"]:
            label = "**User**" if t["role"] == "user" else f"**{config.AGENT_NAME}**"
            lines.append(f"{label}: {t['content']}")
            lines.append("")

        if s["tool_calls"]:
            lines += ["---", "", "## Tool calls", ""]
            for tc in s["tool_calls"]:
                lines.append(f"### `{tc['tool']}`")
                lines.append("")
                lines.append("```json")
                lines.append(json.dumps({"args": tc["args"], "result": tc["result"]}, indent=2, ensure_ascii=False))
                lines.append("```")
                lines.append("")

        lines.append(f"*DigiiMark Chat Agent — {date_str}*")
        return "\n".join(lines)

    def _append_call_log(self, entry: Dict[str, Any]) -> None:
        log_path = config.CALL_LOGS_PATH
        existing: List[Dict[str, Any]] = []
        if log_path.exists():
            try:
                existing = json.loads(log_path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                existing = []

        if not isinstance(existing, list):
            existing = []

        existing.append(entry)
        try:
            log_path.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
        except OSError as exc:
            logger.error("call_logs.json update failed: %s", exc)

    def infer_topics(self, transcript_text: str) -> List[str]:
        """Lightweight topic tags from transcript (optional)."""
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
