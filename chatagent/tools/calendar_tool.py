"""Book discovery calls via CALENDAR_WEBHOOK_URL."""

from __future__ import annotations

import logging
import os
import sys
from typing import Any, Dict, Optional

import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from .base import BaseTool

logger = logging.getLogger(__name__)


class CalendarTool(BaseTool):
    name = "calendar_tool"
    description = (
        "Book a discovery call or consultation with DigiiMark. Use when the user "
        "wants to schedule a meeting. You must have prospect name, email, preferred "
        "date, and preferred time before calling."
    )
    parameters: Dict[str, Any] = {
        "type": "object",
        "properties": {
            "prospect_name": {"type": "string", "description": "Full name."},
            "prospect_email": {"type": "string", "description": "Email address."},
            "prospect_phone": {"type": "string", "description": "Phone (optional)."},
            "preferred_date": {"type": "string", "description": "e.g. 2026-04-28 or next Tuesday."},
            "preferred_time": {"type": "string", "description": "e.g. 3:00 PM IST."},
            "meeting_reason": {"type": "string", "description": "Topic for the call."},
            "timezone": {"type": "string", "description": "IANA timezone, e.g. Asia/Kolkata."},
        },
        "required": ["prospect_name", "prospect_email", "preferred_date", "preferred_time"],
    }

    def execute(
        self,
        prospect_name: str,
        prospect_email: str,
        preferred_date: str,
        preferred_time: str,
        prospect_phone: Optional[str] = None,
        meeting_reason: Optional[str] = None,
        timezone: Optional[str] = "Asia/Kolkata",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        if not config.CALENDAR_WEBHOOK_URL:
            logger.warning("CALENDAR_WEBHOOK_URL unset — simulated booking.")
            return {
                "result": "simulated",
                "message": (
                    f"Booking simulated. {prospect_name} | {prospect_email} | "
                    f"{preferred_date} {preferred_time}. Configure CALENDAR_WEBHOOK_URL to send live."
                ),
            }

        payload = {
            "prospect_name": prospect_name,
            "prospect_email": prospect_email,
            "prospect_phone": prospect_phone or "",
            "preferred_date": preferred_date,
            "preferred_time": preferred_time,
            "meeting_reason": meeting_reason or "Discovery call",
            "timezone": timezone or "Asia/Kolkata",
            "source": "digii_mark_chat_agent",
            "agent": config.AGENT_NAME,
        }
        try:
            r = httpx.post(config.CALENDAR_WEBHOOK_URL, json=payload, timeout=15.0)
            r.raise_for_status()
            try:
                data = r.json()
            except Exception:
                data = {"raw": r.text}
            return {
                "result": "success",
                "message": f"Booked for {prospect_name} on {preferred_date} at {preferred_time}.",
                "webhook_response": data,
            }
        except httpx.HTTPError as exc:
            logger.error("Calendar webhook error: %s", exc)
            return {
                "result": "error",
                "message": "Could not complete booking. Offer email hello@digiimark.com or retry.",
                "error": str(exc),
            }
