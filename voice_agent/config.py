"""
config.py — Central configuration for DigiiMark Voice AI Agent (Maya).

All settings are loaded from environment variables (via .env in dev, Railway's
injected env in prod). Unused FAISS/file paths have been removed now that
the knowledge base and transcripts live in Supabase.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# ─── Resolve paths ────────────────────────────────────────────────────────────
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
        "GEMINI_API_KEY is not set. "
        "Copy .env.example → .env and add your Gemini API key."
    )

# Supabase — required for RAG, transcripts, and content-lookup tools.
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise EnvironmentError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. "
        "See .env.example."
    )

# ─── Gemini Model IDs ─────────────────────────────────────────────────────────
# Override via env when Google ships a newer Live model.
LIVE_MODEL: str = os.getenv("LIVE_MODEL", "gemini-3.1-flash-live-preview")
EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")
TEXT_MODEL: str = os.getenv("TEXT_MODEL", "gemini-2.0-flash")

# ─── Agent Personality ────────────────────────────────────────────────────────
AGENT_NAME: str = os.getenv("AGENT_NAME", "Maya")
AGENT_VOICE: str = os.getenv("AGENT_VOICE", "Aoede")

# ─── Knowledge base directory (manual markdown docs feeding the sync script) ──
KNOWLEDGE_BASE_DIR: Path = BASE_DIR / "knowledge_base"
KNOWLEDGE_BASE_DIR.mkdir(parents=True, exist_ok=True)

# ─── RAG Settings ─────────────────────────────────────────────────────────────
# 1536 dims via Matryoshka truncation of gemini-embedding-001 — fits pgvector's
# native HNSW index limit (2000 dims) and halves storage vs the full 3072-d.
CHUNK_SIZE: int = 500
CHUNK_OVERLAP: int = 50
TOP_K_RETRIEVAL: int = int(os.getenv("TOP_K_RETRIEVAL", "4"))
EMBEDDING_DIMENSION: int = 1536

# Legacy — only used by the terminal-mode markdown KB docs. Web mode (server.py)
# never touches the filesystem for KB content any more.
SUPPORTED_EXTENSIONS: set = {".md", ".txt"}

# ─── Audio Settings (terminal mode only; web mode handles audio in-browser) ───
INPUT_DEVICE_INDEX: int | None = (
    int(os.getenv("INPUT_DEVICE_INDEX"))
    if os.getenv("INPUT_DEVICE_INDEX", "").strip()
    else None
)
OUTPUT_DEVICE_INDEX: int | None = (
    int(os.getenv("OUTPUT_DEVICE_INDEX"))
    if os.getenv("OUTPUT_DEVICE_INDEX", "").strip()
    else None
)
AUDIO_SAMPLE_RATE: int = 16000
AUDIO_CHANNELS: int = 1
AUDIO_CHUNK_SIZE: int = 1024

# ─── Tool configuration ──────────────────────────────────────────────────────

# Cal.com (booking).
# Docs: https://cal.com/docs/api-reference/v2/introduction
CALCOM_API_KEY: str = os.getenv("CALCOM_API_KEY", "")
CALCOM_EVENT_TYPE_ID: str = os.getenv("CALCOM_EVENT_TYPE_ID", "")
CALCOM_API_BASE: str = os.getenv("CALCOM_API_BASE", "https://api.cal.com/v2")

# Lead capture webhook (Make / n8n / Zapier).
LEAD_CAPTURE_WEBHOOK_URL: str = os.getenv("LEAD_CAPTURE_WEBHOOK_URL", "")

# Base URL for the marketing site — used by content-lookup tools to build
# shareable links (e.g. /services/[category]/[service]).
SITE_BASE_URL: str = os.getenv("SITE_BASE_URL", "https://digiimark.com").rstrip("/")

# ─── Web server / Railway ─────────────────────────────────────────────────────
# Railway injects PORT automatically. VOICE_WEB_PORT kept as a dev-friendly override.
VOICE_WEB_PORT: int = int(os.getenv("PORT") or os.getenv("VOICE_WEB_PORT") or "8001")

# CORS allowlist for the browser widget.
_cors_env = os.getenv("CORS_ORIGINS", "").strip()
if _cors_env:
    CORS_ORIGINS: list[str] = [o.strip() for o in _cors_env.split(",") if o.strip()]
else:
    CORS_ORIGINS = [
        "https://digiimark.com",
        "https://www.digiimark.com",
        "http://localhost:3000",
        "http://localhost:3009",
    ]

# ─── Call lifecycle ──────────────────────────────────────────────────────────
# Auto-end the call after this many seconds with no transcript / tool activity
# in either direction. Reset by every user transcription, every Maya
# transcription, and every tool call. Set to 0 to disable.
SILENCE_TIMEOUT_SEC: int = int(os.getenv("SILENCE_TIMEOUT_SEC", "10"))

# ─── Logging ──────────────────────────────────────────────────────────────────
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()


# System prompt is assembled from agents_shared/persona/*.md via
# agents_shared.persona.build_system_prompt() in server.py / agent.py — keep
# this file free of prompt copy so both agents share one source of truth.


# ─── Opening Trigger ──────────────────────────────────────────────────────────
OPENING_TRIGGER: str = (
    "The call just connected. Open with a single short sentence: your name, "
    "DigiiMark, and ask who you're speaking with. Do not explain anything, "
    "do not make a joke, do not say how you are. Vary the wording — do not "
    "repeat the exact same opening you've used before."
)
