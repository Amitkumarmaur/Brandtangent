"""
web_search_tool — Grounded web lookup in a *separate* Gemini request.

The main chat request cannot mix `google_search` with function calling; this tool
runs a short grounded `generate_content` call and returns the summary to the model.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Any, Dict

from google.genai import types

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from gemini_client import client
from .base import BaseTool

logger = logging.getLogger(__name__)


class WebSearchTool(BaseTool):
    name = "web_search_tool"
    description = (
        "Search the public web for recent or external information when the knowledge base "
        "does not cover the question (news, competitors, market facts, launches). "
        "Pass one focused search query string."
    )
    parameters: Dict[str, Any] = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Focused search question, e.g. 'B2B marketing automation trends 2026'.",
            },
        },
        "required": ["query"],
    }

    def execute(self, query: str, **kwargs: Any) -> Dict[str, Any]:
        if not config.ENABLE_GOOGLE_SEARCH_TOOL:
            return {
                "result": "disabled",
                "message": "Web search is disabled in server configuration.",
            }

        prompt = (
            "Answer using Google Search when needed. Be concise (under 180 words), factual, "
            "and note uncertainty. End with one line starting 'Sources:' listing domains or article titles.\n\n"
            f"Query:\n{query}"
        )
        try:
            r = client.models.generate_content(
                model=config.CHAT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.5,
                ),
            )
            text = (r.text or "").strip() or "(No text returned from search.)"
            return {"result": "success", "answer": text}
        except Exception as exc:
            logger.warning("web_search_tool failed: %s", exc)
            return {
                "result": "error",
                "message": "Web search failed. Offer hello@digiimark.com or a retry.",
                "error": str(exc),
            }
