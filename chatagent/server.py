"""
FastAPI server: chat session lifecycle, RAG-backed turns, static demo UI.

The chat agent now reads from the shared Supabase knowledge base
(`knowledge_base_chunks`) and persists transcripts to `chat_sessions` /
`chat_session_turns` / `chat_session_tool_calls`. There is no FAISS file,
no `watchdog` watcher — both have been retired.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import config
from chat_engine import ChatEngine, ChatSessionState
from rag.indexer import build_kb_index
from tools import build_tool_registry
from transcript_manager import ChatTranscriptManager

logging.basicConfig(level=getattr(logging, config.LOG_LEVEL, logging.INFO))
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    kb_index = build_kb_index()
    transcripts = ChatTranscriptManager()
    registry = build_tool_registry()
    engine = ChatEngine(kb_index, registry, transcripts)
    app.state.kb_index = kb_index
    app.state.transcripts = transcripts
    app.state.tool_registry = registry
    app.state.chat_engine = engine
    app.state.sessions: Dict[str, ChatSessionState] = {}
    logger.info(
        "Chat agent ready | model=%s | shared kb chunks=%d",
        config.CHAT_MODEL,
        kb_index.total_chunks,
    )
    yield


app = FastAPI(title="DigiiMark Live Chat Agent", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_static_dir = config.BASE_DIR / "static"
if _static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(_static_dir)), name="static")


class NewSessionBody(BaseModel):
    user_identifier: Optional[str] = None


class MessageBody(BaseModel):
    session_id: Optional[str] = Field(None, description="Existing session; omit to auto-create.")
    message: str = Field(..., min_length=1, max_length=32000)
    user_identifier: Optional[str] = None


class EndSessionBody(BaseModel):
    topics: Optional[list[str]] = None
    outcome: str = Field("completed", description="e.g. completed | escalated | abandoned")


@app.get("/")
def root():
    index = config.BASE_DIR / "static" / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return {
        "service": "DigiiMark Live Chat Agent",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health() -> Dict[str, Any]:
    kb = getattr(app.state, "kb_index", None)
    chunks = kb.total_chunks if kb else 0
    registry = getattr(app.state, "tool_registry", None)
    tool_names = [t.name for t in registry.all_tools()] if registry else []
    return {
        "status": "ok",
        "agent": config.AGENT_NAME,
        "model": config.CHAT_MODEL,
        "knowledge_chunks": chunks,
        "tools": tool_names,
    }


@app.post("/v1/chat/session")
def create_session(body: NewSessionBody) -> Dict[str, str]:
    tm: ChatTranscriptManager = app.state.transcripts
    sid = tm.start_session(body.user_identifier)
    app.state.sessions[sid] = ChatSessionState(session_id=sid)
    return {"session_id": sid}


def _get_session(session_id: str) -> ChatSessionState:
    s = app.state.sessions.get(session_id)
    if not s:
        raise HTTPException(status_code=404, detail="Unknown session_id")
    return s


@app.post("/v1/chat/message")
def chat_message(body: MessageBody) -> Dict[str, Any]:
    tm: ChatTranscriptManager = app.state.transcripts
    engine: ChatEngine = app.state.chat_engine

    sid = body.session_id
    if not sid:
        sid = tm.start_session(body.user_identifier)
        app.state.sessions[sid] = ChatSessionState(session_id=sid)
    session = _get_session(sid)

    if body.user_identifier:
        tm.set_user_identifier(sid, body.user_identifier)

    result = engine.run_turn(session, body.message.strip())
    return {
        "session_id": sid,
        "reply": result["reply"],
        "citations": result["citations"],
        "tools_used": result["tools_used"],
    }


@app.post("/v1/chat/session/{session_id}/end")
def end_session(session_id: str, body: EndSessionBody) -> Dict[str, Any]:
    tm: ChatTranscriptManager = app.state.transcripts
    if session_id not in app.state.sessions:
        raise HTTPException(status_code=404, detail="Unknown session_id")
    summary = tm.end_session(session_id, topics=body.topics, outcome=body.outcome)
    if not summary:
        raise HTTPException(status_code=500, detail="Could not finalize session")
    app.state.sessions.pop(session_id, None)
    return {"ok": True, **summary}


@app.post("/v1/chat/session/{session_id}/message")
def chat_message_scoped(session_id: str, body: MessageBody) -> Dict[str, Any]:
    """Same as /v1/chat/message with session_id in path."""
    body.session_id = session_id
    return chat_message(body)


# ─── Admin / dashboards (Supabase-backed; service role bypasses RLS) ─────────


@app.get("/api/sessions")
def list_sessions(limit: int = 50) -> Any:
    """Return the most recent chat sessions from Supabase."""
    return ChatTranscriptManager.list_sessions(limit=limit)


@app.get("/api/sessions/{session_id}")
def get_session(session_id: str) -> Any:
    """Return one session + its turns + tool calls."""
    row = ChatTranscriptManager.get_session(session_id)
    if not row:
        raise HTTPException(status_code=404, detail="Session not found")
    return row
