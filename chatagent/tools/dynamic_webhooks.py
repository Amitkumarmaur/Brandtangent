"""
Load extra POST-webhook tools from webhook_tools.json (modular integrations).

Schema (array of objects):
[
  {
    "name": "notify_sales",
    "description": "Send a payload to the sales webhook.",
    "url_env": "SALES_WEBHOOK_URL",
    "parameters": { "type": "object", "properties": { ... }, "required": [] }
  }
]

url_env must reference an environment variable containing the HTTPS URL.
"""

from __future__ import annotations

import json
import logging
import os
import sys
from typing import Any, Dict, List

import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from .base import BaseTool, ToolRegistry

logger = logging.getLogger(__name__)


class JsonWebhookTool(BaseTool):
    """POST kwargs as JSON to a URL from environment."""

    def __init__(self, name: str, description: str, parameters: Dict[str, Any], url_env: str) -> None:
        self.name = name
        self.description = description
        self.parameters = parameters
        self._url_env = url_env

    def execute(self, **kwargs: Any) -> Dict[str, Any]:
        url = os.getenv(self._url_env, "").strip()
        if not url:
            logger.warning("Env %s not set — simulated webhook for %s", self._url_env, self.name)
            return {"result": "simulated", "message": f"{self.name} (no {self._url_env}) simulated OK."}

        body = {**kwargs, "source": "digii_mark_chat_agent", "tool": self.name}
        try:
            r = httpx.post(url, json=body, timeout=15.0)
            r.raise_for_status()
            try:
                data = r.json()
            except Exception:
                data = {"raw": r.text[:2000]}
            return {"result": "success", "webhook_response": data}
        except httpx.HTTPError as exc:
            logger.error("%s webhook failed: %s", self.name, exc)
            return {"result": "error", "error": str(exc)}


def load_webhook_tools_from_file(path: Any = None) -> List[BaseTool]:
    p = path or config.WEBHOOK_TOOLS_CONFIG
    if not p.exists():
        return []
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        logger.warning("Could not read webhook tools config %s: %s", p, exc)
        return []

    if not isinstance(raw, list):
        logger.warning("webhook_tools.json must be a JSON array.")
        return []

    tools: List[BaseTool] = []
    for i, item in enumerate(raw):
        if not isinstance(item, dict):
            continue
        name = item.get("name")
        desc = item.get("description", "")
        url_env = item.get("url_env")
        params = item.get("parameters")
        if not name or not url_env or not isinstance(params, dict):
            logger.warning("Skipping webhook tool entry %s: missing name/url_env/parameters", i)
            continue
        tools.append(JsonWebhookTool(str(name), str(desc), params, str(url_env)))
    return tools


def register_dynamic_webhooks(registry: ToolRegistry) -> None:
    loaded = load_webhook_tools_from_file()
    for t in loaded:
        registry.register(t)
    logger.info("Registered %d dynamic webhook tool(s).", len(loaded))
