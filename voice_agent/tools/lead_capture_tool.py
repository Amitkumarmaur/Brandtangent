"""
tools/lead_capture_tool.py — Capture lead information via webhook.

Use this when the user wants to leave their details for follow-up but
isn't ready to book a call. Fires a POST to LEAD_CAPTURE_WEBHOOK_URL.
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


class LeadCaptureTool(BaseTool):
    """Capture prospect information for follow-up."""

    name = "lead_capture_tool"
    description = (
        "Save a prospect's contact information for the DigiiMark sales team to "
        "follow up. Use this when the user wants to be contacted but isn't ready "
        "to book a call right now. Collect their name and email at minimum."
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
                "description": "Phone number (optional).",
            },
            "company_name": {
                "type": "string",
                "description": "Company or business name (optional).",
            },
            "interest": {
                "type": "string",
                "description": "What service or topic they are interested in.",
            },
            "message": {
                "type": "string",
                "description": "Any additional notes or context from the conversation.",
            },
        },
        "required": ["prospect_name", "prospect_email"],
    }

    def execute(
        self,
        prospect_name: str,
        prospect_email: str,
        prospect_phone: Optional[str] = None,
        company_name: Optional[str] = None,
        interest: Optional[str] = None,
        message: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:

        if not config.LEAD_CAPTURE_WEBHOOK_URL:
            logger.warning("LEAD_CAPTURE_WEBHOOK_URL is not set — simulating lead capture.")
            return {
                "result": "simulated",
                "message": f"Lead captured (simulated): {prospect_name} | {prospect_email}",
            }

        payload = {
            "prospect_name": prospect_name,
            "prospect_email": prospect_email,
            "prospect_phone": prospect_phone or "",
            "company_name": company_name or "",
            "interest": interest or "",
            "message": message or "",
            "source": "voice_agent",
            "agent": config.AGENT_NAME,
        }

        try:
            response = httpx.post(
                config.LEAD_CAPTURE_WEBHOOK_URL,
                json=payload,
                timeout=10.0,
            )
            response.raise_for_status()
            logger.info("Lead captured: %s | %s", prospect_name, prospect_email)
            return {
                "result": "success",
                "message": (
                    f"Thank you, {prospect_name}! We've saved your details and "
                    "our team will reach out to you shortly."
                ),
            }
        except Exception as exc:
            logger.error("Lead capture webhook error: %s", exc)
            return {
                "result": "error",
                "message": "Couldn't save your details right now. Please email us at hello@digiimark.com",
                "error": str(exc),
            }
