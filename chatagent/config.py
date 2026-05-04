"""
config.py — DigiiMark Live Chat AI Agent configuration.
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

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Copy .env.example to .env in chatagent/ and add your key."
    )

# Core LLM (Gemini 2.5 Flash)
CHAT_MODEL: str = os.getenv("CHAT_MODEL", "gemini-2.5-flash")
EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")

AGENT_NAME: str = os.getenv("AGENT_NAME", "Alex")

KNOWLEDGE_BASE_DIR: Path = BASE_DIR / "knowledge_base"
TRANSCRIPTS_DIR: Path = BASE_DIR / "transcripts"
RAG_DIR: Path = BASE_DIR / "rag"
VECTOR_STORE_PATH: Path = RAG_DIR / "vector_store.faiss"
VECTOR_METADATA_PATH: Path = RAG_DIR / "vector_metadata.json"
_webhook_cfg = os.getenv("WEBHOOK_TOOLS_CONFIG", "webhook_tools.json")
_p_webhook = Path(_webhook_cfg)
WEBHOOK_TOOLS_CONFIG: Path = _p_webhook if _p_webhook.is_absolute() else BASE_DIR / _p_webhook

KNOWLEDGE_BASE_DIR.mkdir(parents=True, exist_ok=True)
TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
RAG_DIR.mkdir(parents=True, exist_ok=True)

CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "500"))
CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "50"))
TOP_K_RETRIEVAL: int = int(os.getenv("TOP_K_RETRIEVAL", "6"))
EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "3072"))
SUPPORTED_EXTENSIONS: frozenset = frozenset({".md", ".txt", ".pdf", ".docx"})

CALENDAR_WEBHOOK_URL: str = os.getenv("CALENDAR_WEBHOOK_URL", "")
LEAD_CAPTURE_WEBHOOK_URL: str = os.getenv("LEAD_CAPTURE_WEBHOOK_URL", "")

CALL_LOGS_PATH: Path = TRANSCRIPTS_DIR / "call_logs.json"

CHAT_WEB_HOST: str = os.getenv("CHAT_WEB_HOST", "0.0.0.0")
CHAT_WEB_PORT: int = int(os.getenv("CHAT_WEB_PORT", "8010"))

# When true, web_search_tool runs a separate grounded Gemini call (billed per product terms).
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

# System instruction is assembled from agents_shared/persona/*.md via
# agents_shared.persona.build_system_prompt() in chat_engine.py — keep this
# file free of prompt copy so both agents share one source of truth.
