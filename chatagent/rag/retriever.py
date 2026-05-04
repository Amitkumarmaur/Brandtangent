"""
rag/retriever.py — Query the vector store each turn for grounded answers.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Any, Dict, List

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from rag.embedder import embed_query
from rag.indexer import VectorStore

logger = logging.getLogger(__name__)


def retrieve_chunks(query: str, store: VectorStore, top_k: int | None = None) -> List[Dict[str, Any]]:
    k = top_k if top_k is not None else config.TOP_K_RETRIEVAL
    if store.total_chunks == 0:
        return []

    try:
        vec = embed_query(query)
    except Exception as exc:
        logger.warning("Query embed failed: %s", exc)
        return []

    if not vec:
        return []

    return store.search(vec, top_k=k)


def format_rag_context(chunks: List[Dict[str, Any]]) -> str:
    if not chunks:
        return ""

    parts: List[str] = []
    for i, chunk in enumerate(chunks, 1):
        # Omit filenames in context so the model does not echo them in user-facing answers.
        parts.append(f"Excerpt {i}:\n{chunk['text']}")
    return "\n\n---\n\n".join(parts)


def build_retrieval_query(last_user_message: str, recent_snippets: List[str]) -> str:
    tail = " ".join(recent_snippets[-3:]) if recent_snippets else ""
    return f"{last_user_message}\n{tail}".strip()
