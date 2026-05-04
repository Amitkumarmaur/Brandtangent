"""
Gemini 2.5 Flash chat loop: RAG each turn, function tools, optional Google Search grounding.
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import httpx
from google.genai import errors as genai_errors
from google.genai import types

import config
from gemini_client import client as _client
from rag import retriever as rag_retriever
from rag.indexer import VectorStore
from tools.base import ToolRegistry
from transcript_manager import ChatTranscriptManager

logger = logging.getLogger(__name__)

_RETRIABLE_HTTP = frozenset({408, 429, 500, 502, 503, 504})


def _is_retriable_genai_failure(exc: BaseException) -> bool:
    if isinstance(exc, genai_errors.APIError):
        try:
            code = int(exc.code)  # HTTP status from Gemini REST client
        except (TypeError, ValueError):
            return False
        return code in _RETRIABLE_HTTP
    return isinstance(
        exc,
        (
            httpx.TimeoutException,
            httpx.ConnectError,
            httpx.NetworkError,
            httpx.RemoteProtocolError,
            ConnectionError,
            BrokenPipeError,
        ),
    )


def _build_genai_tools(registry: ToolRegistry) -> List[types.Tool]:
    """Function-calling tools only (Gemini does not allow google_search + functions in one request)."""
    decls = [
        types.FunctionDeclaration(
            name=t.name,
            description=t.description,
            parameters=t.parameters,
        )
        for t in registry.all_tools()
    ]
    if not decls:
        return []
    return [types.Tool(function_declarations=decls)]


def _parts_text(parts: List[types.Part]) -> str:
    out: List[str] = []
    for p in parts:
        if p.text:
            out.append(p.text)
    return "".join(out).strip()


def _candidate_parts(candidate: types.Candidate) -> List[types.Part]:
    if not candidate.content or not candidate.content.parts:
        return []
    return list(candidate.content.parts)


def _recent_user_texts(contents: List[types.Content]) -> List[str]:
    texts: List[str] = []
    for c in contents:
        if c.role != "user":
            continue
        blob = _parts_text(list(c.parts))
        if blob:
            texts.append(blob)
    return texts[-4:]


@dataclass
class ChatSessionState:
    session_id: str
    contents: List[types.Content] = field(default_factory=list)


class ChatEngine:
    def __init__(
        self,
        vector_store: VectorStore,
        tool_registry: ToolRegistry,
        transcripts: ChatTranscriptManager,
    ) -> None:
        self._store = vector_store
        self._tools = tool_registry
        self._tm = transcripts
        self._genai_tools = _build_genai_tools(tool_registry)

    def _system_instruction(self, rag_block: str) -> str:
        base = config.SYSTEM_INSTRUCTION.format(agent_name=config.AGENT_NAME)
        return f"{base}\n\n## Retrieved knowledge (for your reasoning only; do not cite filenames in replies)\n{rag_block}"

    def _append_model_text(self, session: ChatSessionState, text: str) -> None:
        session.contents.append(
            types.Content(role="model", parts=[types.Part.from_text(text=text)])
        )

    def run_turn(self, session: ChatSessionState, user_message: str) -> Dict[str, Any]:
        max_hist = config.CHAT_MAX_HISTORY_CONTENTS
        if len(session.contents) > max_hist:
            session.contents[:] = session.contents[-max_hist:]

        recent_users = _recent_user_texts(session.contents)
        q = rag_retriever.build_retrieval_query(user_message, recent_users)
        chunks = rag_retriever.retrieve_chunks(q, self._store)
        citations = [
            {
                "file_name": c["file_name"],
                "score": round(float(c["score"]), 4),
                "excerpt": (c["text"][:600] + "…") if len(c["text"]) > 600 else c["text"],
            }
            for c in chunks
        ]
        rag_block = rag_retriever.format_rag_context(chunks)
        if not rag_block.strip():
            rag_block = (
                "(No knowledge base excerpts matched this query — rely on DigiiMark "
                "positioning from prior turns, ask a clarifying question, or call web_search_tool.)"
            )

        system_instruction = self._system_instruction(rag_block)

        self._tm.add_user_turn(session.session_id, user_message)
        session.contents.append(
            types.Content(role="user", parts=[types.Part.from_text(text=user_message)])
        )

        tools_used: List[str] = []
        rounds = 0
        final_text = ""
        appended_model = False

        while rounds < config.MAX_TOOL_ROUNDS:
            rounds += 1
            cfg_kw: Dict[str, Any] = {
                "system_instruction": system_instruction,
                "temperature": 0.7,
            }
            if self._genai_tools:
                cfg_kw["tools"] = self._genai_tools
            attempts = max(1, config.CHAT_GEN_MAX_ATTEMPTS)
            response = None
            try:
                for attempt in range(attempts):
                    try:
                        response = _client.models.generate_content(
                            model=config.CHAT_MODEL,
                            contents=session.contents,
                            config=types.GenerateContentConfig(**cfg_kw),
                        )
                        break
                    except Exception as exc:
                        retriable = _is_retriable_genai_failure(exc)
                        logger.warning(
                            "Gemini generate_content failed (attempt %s/%s, retriable=%s): %s",
                            attempt + 1,
                            attempts,
                            retriable,
                            exc,
                        )
                        if retriable and attempt + 1 < attempts:
                            time.sleep(min(1.0 * (2**attempt), 12.0))
                            continue
                        raise
            except Exception:
                logger.exception("Gemini generate_content failed after retries")
                final_text = (
                    "I'm having trouble reaching the AI service right now. "
                    "Please try again in a moment or email hello@digiimark.com."
                )
                self._append_model_text(session, final_text)
                appended_model = True
                break

            if response is None:
                break

            if not response.candidates:
                final_text = "I could not generate a safe reply to that message. Could you rephrase?"
                self._append_model_text(session, final_text)
                appended_model = True
                break

            cand = response.candidates[0]
            parts = _candidate_parts(cand)
            if not parts:
                final_text = "I did not get a response back. Please try again."
                self._append_model_text(session, final_text)
                appended_model = True
                break

            fc_parts = [p for p in parts if p.function_call]
            if fc_parts:
                session.contents.append(types.Content(role="model", parts=fc_parts))
                fr_parts: List[types.Part] = []
                for p in fc_parts:
                    fc = p.function_call
                    if not fc or not fc.name:
                        continue
                    name = fc.name
                    args = dict(fc.args) if fc.args else {}
                    result = self._tools.execute(name, **args)
                    tools_used.append(name)
                    self._tm.add_tool_call(session.session_id, name, args, result)
                    fr_parts.append(types.Part.from_function_response(name=name, response=result))
                session.contents.append(types.Content(role="user", parts=fr_parts))
                continue

            final_text = _parts_text(parts)
            session.contents.append(types.Content(role="model", parts=list(parts)))
            appended_model = True
            break

        if rounds >= config.MAX_TOOL_ROUNDS and not appended_model:
            final_text = (
                "I hit an internal limit while using tools. "
                "Please simplify your request or email hello@digiimark.com."
            )
            self._append_model_text(session, final_text)
            appended_model = True

        self._tm.add_model_turn(session.session_id, final_text)

        return {
            "reply": final_text,
            "citations": citations,
            "tools_used": tools_used,
        }
