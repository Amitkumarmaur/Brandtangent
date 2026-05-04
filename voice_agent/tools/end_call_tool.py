"""
end_call_tool.py — Lets Maya hang up the live call gracefully.

The tool itself is a sentinel: it returns `{"action": "end_call"}` in its
result, which `server.py`'s receive loop watches for. After the current
turn finishes (so the caller hears Maya's goodbye), the WebSocket is
closed and the transcript is finalised in Supabase.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from tools.base import BaseTool

logger = logging.getLogger(__name__)


class EndCallTool(BaseTool):
    name = "end_call"
    description = (
        "Hang up the live voice call gracefully. ALWAYS speak a brief, "
        "natural goodbye sentence (six words or fewer) in the SAME turn "
        "BEFORE calling this tool — the caller should hear it before the "
        "line drops. Use ONLY when one of these is true:\n"
        "  • The caller said something like 'no thanks', 'that's all', "
        "'I'm good', 'goodbye', 'have a nice day', or otherwise signalled "
        "they are done.\n"
        "  • You just confirmed a booking or captured a lead and the "
        "caller has nothing else to ask.\n"
        "  • The caller explicitly asked you to end / hang up.\n"
        "Never call this mid-conversation, never call it on the first "
        "turn, and never call it just because YOU have run out of things "
        "to say. If unsure whether the caller wants to keep talking, ask "
        "instead of hanging up."
    )
    parameters: Dict[str, Any] = {
        "type": "object",
        "properties": {
            "reason": {
                "type": "string",
                "description": (
                    "Short tag for analytics / transcript: e.g. "
                    "'caller wrapped up', 'booking complete', "
                    "'lead captured', 'caller asked to hang up'."
                ),
            }
        },
    }

    def execute(self, reason: Optional[str] = None, **_: Any) -> Dict[str, Any]:
        tag = (reason or "wrapped_up").strip() or "wrapped_up"
        logger.info("end_call tool invoked | reason=%s", tag)
        return {
            "result": "success",
            "message": "Call ending after this turn.",
            "action": "end_call",
            "reason": tag,
        }
