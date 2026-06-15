"""Post lead details to LEAD_CAPTURE_WEBHOOK_URL (CRM / Zapier / n8n)."""

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


class LeadCaptureTool(BaseTool):
    name = "lead_capture_tool"
    description = (
        "Capture name, email, and what they need for Brandtangent sales follow-up. "
        "Use when the user wants to be contacted, get a quote, or leave details without booking a call."
    )
    parameters: Dict[str, Any] = {
        "type": "object",
        "properties": {
            "prospect_name": {"type": "string"},
            "prospect_email": {"type": "string"},
            "requirement": {
                "type": "string",
                "description": "What they need: services, goals, timeline, budget hints.",
            },
            "prospect_phone": {"type": "string", "description": "Optional phone."},
            "company_name": {"type": "string"},
            "notes": {"type": "string", "description": "Extra context from the chat."},
        },
        "required": ["prospect_name", "prospect_email", "requirement"],
    }

    def execute(
        self,
        prospect_name: str,
        prospect_email: str,
        requirement: str,
        prospect_phone: Optional[str] = None,
        company_name: Optional[str] = None,
        notes: Optional[str] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        if not config.LEAD_CAPTURE_WEBHOOK_URL:
            logger.warning("LEAD_CAPTURE_WEBHOOK_URL unset — simulated lead.")
            return {
                "result": "simulated",
                "message": f"Lead saved (simulated): {prospect_name} — {requirement[:80]}",
            }

        payload = {
            "prospect_name": prospect_name,
            "prospect_email": prospect_email,
            "requirement": requirement,
            "prospect_phone": prospect_phone or "",
            "company_name": company_name or "",
            "notes": notes or "",
            "source": "digii_mark_chat_agent",
            "agent": config.AGENT_NAME,
        }
        try:
            r = httpx.post(config.LEAD_CAPTURE_WEBHOOK_URL, json=payload, timeout=15.0)
            r.raise_for_status()
            return {
                "result": "success",
                "message": f"Thanks {prospect_name} — our team will follow up shortly.",
            }
        except httpx.HTTPError as exc:
            logger.error("Lead webhook error: %s", exc)
            return {
                "result": "error",
                "message": "Could not save details. Share hello@digiimark.com.",
                "error": str(exc),
            }
