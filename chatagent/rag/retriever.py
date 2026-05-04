"""
rag/retriever.py — Semantic search over the shared Supabase knowledge base.

Both the chat and voice agents read from the same `knowledge_base_chunks`
table via the `match_kb_chunks` RPC. Chunk shape returned:

    {
        "chunk_id":          uuid,
        "document_id":       uuid,
        "document_title":    text,
        "document_category": text,
        "content":           text,
        "similarity":        float,
    }
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Any, Dict, List, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from rag.embedder import embed_query
from supabase_client import get_client

logger = logging.getLogger(__name__)


def retrieve_chunks(
    query: str,
    top_k: Optional[int] = None,
    category: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Embed the query and call the Supabase match_kb_chunks RPC.

    Returns a list of dicts (see module docstring), or [] when nothing matches.
    """
    if not query or not query.strip():
        return []

    try:
        vec = embed_query(query)
    except Exception as exc:
        logger.warning("Could not embed query for RAG retrieval: %s", exc)
        return []

    if not vec:
        return []

    k = top_k if top_k is not None else config.TOP_K_RETRIEVAL

    try:
        response = get_client().rpc(
            "match_kb_chunks",
            {
                "query_embedding": vec,
                "match_count": k,
                "filter_category": category,
            },
        ).execute()
    except Exception as exc:
        logger.error("match_kb_chunks RPC failed: %s", exc)
        return []

    rows = response.data or []
    logger.debug("Retrieved %d RAG chunk(s) for query: %s...", len(rows), query[:60])
    return rows


def format_rag_context(chunks: List[Dict[str, Any]]) -> str:
    """Format chunks as a context block ready to inject into the system prompt."""
    if not chunks:
        return ""

    parts: List[str] = []
    for i, row in enumerate(chunks, 1):
        title = row.get("document_title", "Untitled")
        cat = row.get("document_category") or "—"
        sim = float(row.get("similarity", 0.0))
        content = (row.get("content") or "").strip()
        # Title + category is internal-only metadata; the model uses it for
        # reasoning but the persona instructions tell it never to mention
        # filenames or sources verbatim to the user.
        parts.append(
            f"[Source {i}: {title} | category {cat} | relevance {sim:.2f}]\n{content}"
        )
    return "\n\n---\n\n".join(parts)


def build_retrieval_query(last_user_message: str, recent_snippets: List[str]) -> str:
    """Combine the latest user message with recent context for richer retrieval."""
    tail = " ".join(recent_snippets[-3:]) if recent_snippets else ""
    return f"{last_user_message}\n{tail}".strip()
