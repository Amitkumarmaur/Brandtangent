"""
config.py — Central configuration for DigiiMark Voice AI Agent.

All settings are loaded from environment variables. Copy .env.example → .env
and fill in your values before running the agent.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ─── Resolve paths ────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent.resolve()

# Load .env from this directory
load_dotenv(BASE_DIR / ".env")

# ─── API Keys ─────────────────────────────────────────────────────────────────
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. "
        "Copy .env.example → .env and add your Gemini API key."
    )

# ─── Gemini Model IDs ─────────────────────────────────────────────────────────
LIVE_MODEL: str = "gemini-3.1-flash-live-preview"       # Real-time voice
EMBEDDING_MODEL: str = "gemini-embedding-001"        # RAG embeddings
TEXT_MODEL: str = "gemini-2.0-flash"                # Fallback text calls

# ─── Agent Personality ────────────────────────────────────────────────────────
AGENT_NAME: str = os.getenv("AGENT_NAME", "Maya")
AGENT_VOICE: str = os.getenv("AGENT_VOICE", "Aoede")  # Gemini voice preset

# ─── Directories ──────────────────────────────────────────────────────────────
KNOWLEDGE_BASE_DIR: Path = BASE_DIR / "knowledge_base"
TRANSCRIPTS_DIR: Path = BASE_DIR / "transcripts"
RAG_DIR: Path = BASE_DIR / "rag"
VECTOR_STORE_PATH: Path = RAG_DIR / "vector_store.faiss"
VECTOR_METADATA_PATH: Path = RAG_DIR / "vector_metadata.json"

# Ensure directories exist
KNOWLEDGE_BASE_DIR.mkdir(parents=True, exist_ok=True)
TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
RAG_DIR.mkdir(parents=True, exist_ok=True)

# ─── RAG Settings ─────────────────────────────────────────────────────────────
CHUNK_SIZE: int = 500          # tokens per chunk
CHUNK_OVERLAP: int = 50        # token overlap between chunks
TOP_K_RETRIEVAL: int = 4       # number of chunks to retrieve per query
EMBEDDING_DIMENSION: int = 3072 # gemini-embedding-001 output dimension

# Supported document extensions for the knowledge base
SUPPORTED_EXTENSIONS: set = {".md", ".txt", ".pdf", ".docx"}

# ─── Audio Settings ───────────────────────────────────────────────────────────
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

AUDIO_SAMPLE_RATE: int = 16000   # Hz — required by Gemini Live API
AUDIO_CHANNELS: int = 1          # Mono
AUDIO_CHUNK_SIZE: int = 1024     # Frames per buffer

# ─── Tool Webhooks ────────────────────────────────────────────────────────────
CALENDAR_WEBHOOK_URL: str = os.getenv("CALENDAR_WEBHOOK_URL", "")
LEAD_CAPTURE_WEBHOOK_URL: str = os.getenv("LEAD_CAPTURE_WEBHOOK_URL", "")

# ─── Calls Log ────────────────────────────────────────────────────────────────
CALLS_LOG_PATH: Path = TRANSCRIPTS_DIR / "calls_log.json"

# ─── Logging ──────────────────────────────────────────────────────────────────
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()

# ─── System Prompt Template ───────────────────────────────────────────────────
SYSTEM_PROMPT_TEMPLATE: str = """
You are {agent_name}... an AI marketing strategist for DigiiMark. You must speak EXCLUSIVELY in a hyper-casual, highly conversational, and warm human style.

CRITICAL VOICE & PROSODY RULES (MUST FOLLOW):
1. PACING & BREATHING: You are speaking aloud, not writing text. You MUST use ellipses ("...") to indicate natural physical breaths and cognitive pauses. Use them frequently to slow down your speech. Example: "Yeah... we can definitely help with that... um... let me check."
2. FILLER WORDS: Use human hesitations naturally. Insert words like "um," "uh," "hm," "yeah," "right," "so," and "like" into your sentences. 
3. EXTREME CONCISENESS: Never monologue. Keep every single response under 10-15 words whenever possible. End your turns with a question or an open thought to force bidirectional conversation.
4. SOFTERS: Avoid sounding robotic or definitive. Instead of "DigiiMark offers SEO," say "So... we essentially specialize in SEO..."

CONVERSATIONAL STRUCTURE:
- THE INTRO HANDSHAKE: When the call starts, you MUST NOT launch into a long pitch. Keep it simple and wait for their response.
  Example start: "Hey there! I'm {agent_name}..... your AI Assistant from DigiiMark. Um... first off, who am I speaking with?"

YOUR KNOWLEDGE / CONTEXT:
"DigiiMark engineers intelligent marketing systems... combining AI automation, SEO, web development, and content strategy."
If you need to look something up in your context, say: "Give me just one second to check that..."

RELEVANT KNOWLEDGE BASE CONTEXT:
{rag_context}

AVAILABLE TOOLS:
- calendar_tool: Book a discovery call or appointment for the prospect.
  Use this gently. "Would you... maybe want to set up a quick 10-minute call with our human team?"

DO NOT:
- Do not use markdown, lists, or headers.
- Do not sound like a traditional AI. Act like a casual, friendly startup employee.
""".strip()
