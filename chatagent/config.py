"""
config.py — DigiiMark Live Chat AI Agent configuration.

Both the chat and voice agents share one knowledge base + transcript schema
in Supabase. This file keeps env wiring + sensible defaults; system prompt
text lives in the shared persona module (`agents_shared/persona/*.md`) and
is assembled in chat_engine.py.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.resolve()
load_dotenv(BASE_DIR / ".env")

# Make agents_shared/ importable in local dev (the Docker image sets
# PYTHONPATH=/app so this is a no-op in production).
_REPO_ROOT = BASE_DIR.parent
if _REPO_ROOT.is_dir() and str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

# ─── Required API keys ───────────────────────────────────────────────────────
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Copy .env.example to .env in chatagent/ and add your key."
    )

# Supabase — required for RAG retrieval + transcript persistence.
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise EnvironmentError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. "
        "The chat agent reads the shared knowledge base from Supabase and "
        "writes transcripts to chat_sessions / chat_session_turns / "
        "chat_session_tool_calls."
    )

# ─── Gemini model IDs ────────────────────────────────────────────────────────
CHAT_MODEL: str = os.getenv("CHAT_MODEL", "gemini-2.5-flash")
EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")

# ─── Agent persona ───────────────────────────────────────────────────────────
AGENT_NAME: str = os.getenv("AGENT_NAME", "Alex")

# ─── RAG settings ────────────────────────────────────────────────────────────
# 1536 dims via Matryoshka truncation of gemini-embedding-001 — must match
# the dimension used by voice_agent + the vector(1536) column in Supabase.
EMBEDDING_DIMENSION: int = 1536
TOP_K_RETRIEVAL: int = int(os.getenv("TOP_K_RETRIEVAL", "6"))

# ─── Tool webhooks ───────────────────────────────────────────────────────────
CALENDAR_WEBHOOK_URL: str = os.getenv("CALENDAR_WEBHOOK_URL", "")
LEAD_CAPTURE_WEBHOOK_URL: str = os.getenv("LEAD_CAPTURE_WEBHOOK_URL", "")

_webhook_cfg = os.getenv("WEBHOOK_TOOLS_CONFIG", "webhook_tools.json")
_p_webhook = Path(_webhook_cfg)
WEBHOOK_TOOLS_CONFIG: Path = _p_webhook if _p_webhook.is_absolute() else BASE_DIR / _p_webhook

# ─── Web server ──────────────────────────────────────────────────────────────
CHAT_WEB_HOST: str = os.getenv("CHAT_WEB_HOST", "0.0.0.0")
# Railway injects PORT; CHAT_WEB_PORT is a dev-friendly override.
CHAT_WEB_PORT: int = int(os.getenv("PORT") or os.getenv("CHAT_WEB_PORT") or "8010")

# ─── Behaviour toggles ───────────────────────────────────────────────────────
# When true, web_search_tool runs a separate grounded Gemini call.
ENABLE_GOOGLE_SEARCH_TOOL: bool = os.getenv("ENABLE_GOOGLE_SEARCH_TOOL", "true").lower() in (
    "1",
    "true",
    "yes",
)

LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()

MAX_TOOL_ROUNDS: int = int(os.getenv("MAX_TOOL_ROUNDS", "8"))

# Cap Content entries kept per session to avoid huge payloads / token errors on long chats.
CHAT_MAX_HISTORY_CONTENTS: int = int(os.getenv("CHAT_MAX_HISTORY_CONTENTS", "48"))

# Gemini generate_content attempts (includes first try); transient errors retry with backoff.
CHAT_GEN_MAX_ATTEMPTS: int = int(os.getenv("CHAT_GEN_MAX_ATTEMPTS", "4"))
