"""
tools/calendar_tool.py — Book discovery calls / appointments via webhook.

When a user says "I'd like to schedule a call" or "Book me in for tomorrow",
Gemini triggers this tool. It fires a POST request to CALENDAR_WEBHOOK_URL
with the booking details.

The webhook can be a Make.com / Zapier / n8n scenario, a Calendly API endpoint,
or any custom booking service.
"""

from __future__ import annotations

import logging
import sys
import os
from typing import Any, Dict, Optional

import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from tools.base import BaseTool

logger = logging.getLogger(__name__)


class CalendarTool(BaseTool):
    """Book appointments and discovery calls via a configurable webhook."""

    name = "calendar_tool"
    description = (
        "Book a discovery call, demo, or appointment for the prospect with the "
        "DigiiMark team. Use this when the user wants to schedule a meeting, "
        "call, or consultation. Collect their name, email, preferred date, and "
        "preferred time before calling this tool."
    )
    parameters = {
        "type": "object",
        "properties": {
            "prospect_name": {
                "type": "string",
                "description": "Full name of the prospect.",
            },
            "prospect_email": {
                "type": "string",
                "description": "Email address of the prospect.",
            },
            "prospect_phone": {
                "type": "string",
                "description": "Phone number of the prospect (optional).",
            },
            "preferred_date": {
                "type": "string",
                "description": "Preferred date for the call, e.g. '2026-04-20' or 'next Monday'.",
            },
            "preferred_time": {
                "type": "string",
                "description": "Preferred time for the call, e.g. '3:00 PM IST'.",
            },
            "meeting_reason": {
                "type": "string",
                "description": "Brief reason or topic for the meeting, e.g. 'SEO strategy discussion'.",
            },
            "timezone": {
                "type": "string",
                "description": "Prospect's timezone, e.g. 'Asia/Kolkata'. Defaults to IST.",
            },
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
        meeting_reason: Optional[str] = "Discovery call with DigiiMark",
        timezone: Optional[str] = "Asia/Kolkata",
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """
        Send booking details to CALENDAR_WEBHOOK_URL.

        Returns a confirmation dict that Gemini uses to formulate a response.
        """
        if not config.CALENDAR_WEBHOOK_URL:
            logger.warning("CALENDAR_WEBHOOK_URL is not set — simulating booking.")
            return {
                "result": "simulated",
                "message": (
                    f"Booking simulated (no webhook configured). "
                    f"Details: {prospect_name} | {prospect_email} | "
                    f"{preferred_date} at {preferred_time}."
                ),
                "booking_id": "SIM-001",
            }

        payload = {
            "prospect_name": prospect_name,
            "prospect_email": prospect_email,
            "prospect_phone": prospect_phone or "",
            "preferred_date": preferred_date,
            "preferred_time": preferred_time,
            "meeting_reason": meeting_reason,
            "timezone": timezone,
            "source": "voice_agent",
            "agent": config.AGENT_NAME,
        }

        try:
            response = httpx.post(
                config.CALENDAR_WEBHOOK_URL,
                json=payload,
                timeout=10.0,
            )
            response.raise_for_status()

            try:
                data = response.json()
            except Exception:
                data = {"raw": response.text}

            logger.info(
                "Calendar webhook OK: %s | %s @ %s %s",
                prospect_name, prospect_email, preferred_date, preferred_time,
            )
            return {
                "result": "success",
                "message": (
                    f"Appointment booked for {prospect_name} on {preferred_date} "
                    f"at {preferred_time}. A confirmation will be sent to {prospect_email}."
                ),
                "webhook_response": data,
            }

        except httpx.HTTPStatusError as exc:
            logger.error("Calendar webhook HTTP error: %s", exc)
            return {
                "result": "error",
                "message": "There was a problem booking your appointment. Please try again or contact us directly.",
                "error": str(exc),
            }
        except httpx.RequestError as exc:
            logger.error("Calendar webhook request error: %s", exc)
            return {
                "result": "error",
                "message": "Could not reach the booking service. Please try again later.",
                "error": str(exc),
            }
