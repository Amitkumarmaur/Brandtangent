"""
rag/retriever.py — Semantic search over the Supabase knowledge base.

Given a text query, embed it and call the `match_kb_chunks` RPC to retrieve
the most relevant document chunks, then format them as a context block for
the agent's system prompt.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import List, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from rag.embedder import embed_query
from supabase_client import get_client

logger = logging.getLogger(__name__)


def retrieve_context(query: str, category: Optional[str] = None) -> str:
    """
    Embed the query, call the Supabase match_kb_chunks RPC, and return a
    formatted context string ready to inject into the agent system prompt.

    Args:
        query:    The user's current query / recent conversation turn.
        category: Optional document category filter (e.g. 'service', 'faq').

    Returns:
        A multi-line string of retrieved excerpts, or an empty string when
        nothing matches.
    """
    if not query or not query.strip():
        return ""

    try:
        vec = embed_query(query)
    except Exception as exc:
        logger.warning("Could not embed query for RAG retrieval: %s", exc)
        return ""

    if not vec:
        return ""

    try:
        response = get_client().rpc(
            "match_kb_chunks",
            {
                "query_embedding": vec,
                "match_count": config.TOP_K_RETRIEVAL,
                "filter_category": category,
            },
        ).execute()
    except Exception as exc:
        logger.error("match_kb_chunks RPC failed: %s", exc)
        return ""

    rows = response.data or []
    if not rows:
        return ""

    parts: List[str] = []
    for i, row in enumerate(rows, 1):
        title = row.get("document_title", "Untitled")
        cat = row.get("document_category") or "—"
        sim = float(row.get("similarity", 0.0))
        content = row.get("content", "").strip()
        parts.append(
            f"[Source {i}: {title} | category {cat} | relevance {sim:.2f}]\n{content}"
        )

    logger.debug("Retrieved %d RAG chunk(s) for query: %s...", len(rows), query[:60])
    return "\n\n---\n\n".join(parts)


def retrieve_context_for_turn(
    conversation_history: List[str],
    store=None,  # kept for backward compatibility with old call sites; unused
) -> str:
    """
    Build a retrieval query from the last few conversation turns and return
    a formatted context block.

    The `store` parameter is deprecated (was the in-memory FAISS VectorStore)
    but is retained so existing imports in server.py / agent.py keep working.
    """
    recent = " ".join(conversation_history[-3:]) if conversation_history else ""
    if not recent.strip():
        return ""
    return retrieve_context(recent)
