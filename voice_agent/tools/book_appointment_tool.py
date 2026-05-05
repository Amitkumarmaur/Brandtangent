"""
tools/book_appointment_tool.py — Book a discovery call on Cal.com.

When a caller shows interest, Gemini calls this tool with the prospect's
name, email, and a preferred date/time (in natural language — we
normalise it to ISO-8601 before hitting Cal.com).

API: https://cal.com/docs/api-reference/v2/bookings/create-a-booking

Requires environment variables:
  CALCOM_API_KEY         — Cal.com API key (https://cal.com/settings/developer/api-keys)
  CALCOM_EVENT_TYPE_ID   — numeric ID of the "Discovery Call" event type

If either is missing, the tool returns a `simulated` result so development
isn't blocked by infra.
"""

from __future__ import annotations

import logging
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from tools.base import BaseTool

logger = logging.getLogger(__name__)


def _fire_lead_webhook(
    prospect_name: str,
    prospect_email: str,
    prospect_phone: Optional[str] = None,
    interest: Optional[str] = None,
    message: Optional[str] = None,
    extra: Optional[Dict[str, Any]] = None,
) -> None:
    """
    Post a prospect record to LEAD_CAPTURE_WEBHOOK_URL. Used as a side-effect
    of a successful booking so every captured call lands in the CRM pipeline.
    Failures are logged, never raised.
    """
    if not config.LEAD_CAPTURE_WEBHOOK_URL:
        return

    payload: Dict[str, Any] = {
        "prospect_name": prospect_name,
        "prospect_email": prospect_email,
        "prospect_phone": prospect_phone or "",
        "company_name": "",
        "interest": interest or "",
        "message": message or "",
        "source": "voice_agent",
        "agent": config.AGENT_NAME,
    }
    if extra:
        payload.update(extra)

    try:
        httpx.post(
            config.LEAD_CAPTURE_WEBHOOK_URL,
            json=payload,
            timeout=10.0,
        )
        logger.info(
            "Lead webhook fired from booking: %s | %s",
            prospect_name, prospect_email,
        )
    except Exception as exc:
        logger.warning("Lead webhook (post-booking) failed: %s", exc)


def _normalise_datetime(date_str: str, time_str: str, tz: str) -> Optional[str]:
    """
    Best-effort parse of loose natural-language date + time pairs into an
    ISO-8601 UTC timestamp.

    Handles:
      * Fully ISO ("2026-04-20" + "15:00")
      * 12h AM/PM ("3:00 PM", "3 pm", "3pm")
      * Named weekdays ("next Monday")
      * "today", "tomorrow"

    On parse failure returns None — the caller will surface an error so the
    agent asks the user for a clearer time.
    """
    try:
        from zoneinfo import ZoneInfo
        tzinfo = ZoneInfo(tz)
    except Exception:
        tzinfo = timezone.utc

    now = datetime.now(tzinfo)
    target_date: Optional[datetime] = None

    # ── Date ───────────────────────────────────────────────────────────────
    ds = (date_str or "").strip().lower()
    if not ds:
        return None

    if ds in ("today",):
        target_date = now
    elif ds in ("tomorrow",):
        target_date = now + timedelta(days=1)
    elif ds.startswith("next "):
        weekdays = {
            "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
            "friday": 4, "saturday": 5, "sunday": 6,
        }
        day = ds[5:].strip()
        if day in weekdays:
            today_idx = now.weekday()
            offset = (weekdays[day] - today_idx) % 7 or 7
            target_date = now + timedelta(days=offset)
    else:
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"):
            try:
                parsed = datetime.strptime(ds, fmt)
                target_date = parsed.replace(tzinfo=tzinfo)
                break
            except ValueError:
                continue

    if target_date is None:
        return None

    # ── Time ───────────────────────────────────────────────────────────────
    ts = (time_str or "").strip().lower().replace(" ", "")
    if not ts:
        return None

    hour = minute = 0
    m = re.match(r"^(\d{1,2})(?::(\d{2}))?(am|pm)?(?:([a-z/_+-]+))?$", ts)
    if m:
        hour = int(m.group(1))
        minute = int(m.group(2) or 0)
        ampm = m.group(3)
        if ampm == "pm" and hour < 12:
            hour += 12
        elif ampm == "am" and hour == 12:
            hour = 0
    else:
        m2 = re.match(r"^(\d{1,2}):(\d{2})$", ts)
        if m2:
            hour = int(m2.group(1))
            minute = int(m2.group(2))
        else:
            return None

    combined = target_date.replace(
        hour=hour, minute=minute, second=0, microsecond=0
    )
    return combined.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


class BookAppointmentTool(BaseTool):
    """Book a discovery call on DigiiMark's Cal.com calendar."""

    name = "book_appointment_tool"
    description = (
        "Book a discovery call on DigiiMark's calendar (Cal.com). Use when the "
        "caller has shown genuine interest and is ready to commit a time. "
        "Collect their full name, email, and a preferred date and time (any "
        "natural phrasing is fine — e.g. 'next Tuesday at 3pm'). Optionally "
        "collect a short reason for the meeting and their timezone."
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
            "preferred_date": {
                "type": "string",
                "description": (
                    "Preferred date. Accepts 'YYYY-MM-DD', 'next Monday', "
                    "'tomorrow', or 'today'."
                ),
            },
            "preferred_time": {
                "type": "string",
                "description": (
                    "Preferred time. Accepts '15:00', '3:00 PM', '3pm'. The "
                    "tool combines this with preferred_date."
                ),
            },
            "timezone": {
                "type": "string",
                "description": (
                    "IANA timezone for the prospect, e.g. 'Asia/Kolkata' or "
                    "'America/Los_Angeles'. Defaults to 'Asia/Kolkata'."
                ),
            },
            "meeting_reason": {
                "type": "string",
                "description": "Short reason/topic for the call.",
            },
            "prospect_phone": {
                "type": "string",
                "description": "Phone number of the prospect (optional).",
            },
        },
        "required": [
            "prospect_name",
            "prospect_email",
            "preferred_date",
            "preferred_time",
        ],
    }

    def execute(
        self,
        prospect_name: str,
        prospect_email: str,
        preferred_date: str,
        preferred_time: str,
        timezone: Optional[str] = "Asia/Kolkata",
        meeting_reason: Optional[str] = "Discovery call with DigiiMark",
        prospect_phone: Optional[str] = None,
        **_ignored: Any,
    ) -> Dict[str, Any]:
        tz_name = timezone or "Asia/Kolkata"

        start_iso = _normalise_datetime(preferred_date, preferred_time, tz_name)
        if start_iso is None:
            return {
                "result": "error",
                "message": (
                    "I couldn't understand the date or time. Could you repeat it "
                    "with something like 'next Tuesday at 3 PM'?"
                ),
            }

        if not config.CALCOM_API_KEY or not config.CALCOM_EVENT_TYPE_ID:
            logger.warning(
                "CALCOM_API_KEY / CALCOM_EVENT_TYPE_ID not set — simulating booking."
            )
            return {
                "result": "simulated",
                "message": (
                    f"Booking simulated (Cal.com not configured). "
                    f"{prospect_name} | {prospect_email} | {start_iso} ({tz_name})."
                ),
                "start": start_iso,
            }

        # Cal.com v2 bookings endpoint.
        # See: https://cal.com/docs/api-reference/v2/bookings/create-a-booking
        # Any hidden required fields on the event type (e.g. `title`) must be
        # supplied via bookingFieldsResponses, or Cal.com will 400.
        booking_title = (meeting_reason or "Discovery call with DigiiMark")[:80]
        payload = {
            "eventTypeId": int(config.CALCOM_EVENT_TYPE_ID),
            "start": start_iso,
            "attendee": {
                "name": prospect_name,
                "email": prospect_email,
                "timeZone": tz_name,
                "language": "en",
            },
            "bookingFieldsResponses": {
                "title": booking_title,
                "notes": (
                    f"Booked via DigiiMark voice agent ({config.AGENT_NAME}). "
                    f"Reason: {meeting_reason}."
                ),
            },
            "metadata": {
                "source": "voice_agent",
                "agent": config.AGENT_NAME,
                "reason": meeting_reason or "",
                "phone": prospect_phone or "",
            },
        }

        headers = {
            "Authorization": f"Bearer {config.CALCOM_API_KEY}",
            "cal-api-version": "2024-08-13",
            "Content-Type": "application/json",
        }

        url = f"{config.CALCOM_API_BASE.rstrip('/')}/bookings"

        try:
            response = httpx.post(url, json=payload, headers=headers, timeout=15.0)
            response.raise_for_status()
            try:
                data = response.json()
            except Exception:
                data = {"raw": response.text}

            logger.info(
                "Cal.com booking created: %s | %s | %s",
                prospect_name, prospect_email, start_iso,
            )

            # Cal.com wraps the response in {"status": "success", "data": {...}}.
            booking = data.get("data") if isinstance(data, dict) else data
            booking_id = (booking or {}).get("id") or (booking or {}).get("uid")

            # Also file this prospect in the CRM lead pipeline so booked calls
            # aren't missed by the n8n / Make scenario that watches the lead
            # webhook. Fire-and-forget: a webhook failure must never break a
            # successful Cal.com booking.
            _fire_lead_webhook(
                prospect_name=prospect_name,
                prospect_email=prospect_email,
                prospect_phone=prospect_phone,
                interest=meeting_reason,
                message=(
                    f"Booked a discovery call via voice agent for "
                    f"{preferred_date} at {preferred_time} ({tz_name}). "
                    f"Cal.com booking id: {booking_id}."
                ),
                extra={
                    "booking_id": str(booking_id) if booking_id else "",
                    "booking_start": start_iso,
                    "stage": "booked",
                },
            )

            return {
                "result": "success",
                "message": (
                    f"Booked. I've scheduled a discovery call with "
                    f"{prospect_name} on {preferred_date} at {preferred_time} "
                    f"({tz_name}). A confirmation will be sent to "
                    f"{prospect_email}."
                ),
                "booking_id": booking_id,
                "start": start_iso,
                "timezone": tz_name,
            }

        except httpx.HTTPStatusError as exc:
            logger.error(
                "Cal.com HTTP error %s: %s",
                exc.response.status_code, exc.response.text[:500],
            )
            return {
                "result": "error",
                "message": (
                    "I hit an issue booking that time — it may already be "
                    "taken. Want to try a slightly different slot?"
                ),
                "error": f"{exc.response.status_code}",
            }
        except httpx.RequestError as exc:
            logger.error("Cal.com request error: %s", exc)
            return {
                "result": "error",
                "message": (
                    "I couldn't reach the booking service just now. Could we "
                    "try again in a moment?"
                ),
                "error": str(exc),
            }
