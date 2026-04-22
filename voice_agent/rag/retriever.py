"""
rag/retriever.py — Semantic search over the vector store.

Given a text query, retrieve the most relevant document chunks
and format them as a context string for the agent's system prompt.
"""

from __future__ import annotations

import logging
from typing import List

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from rag.embedder import embed_query
from rag.indexer import VectorStore

logger = logging.getLogger(__name__)


def retrieve_context(query: str, store: VectorStore) -> str:
    """
    Embed the query, search the vector store, and return a formatted
    context string ready to inject into the agent system prompt.

    Args:
        query:  The user's current query / conversation turn.
        store:  The initialized VectorStore instance.

    Returns:
        A multi-line string of retrieved document excerpts, or an empty
        string if no relevant chunks are found.
    """
    if store.total_chunks == 0:
        return "(No knowledge base documents indexed yet.)"

    try:
        vec = embed_query(query)
    except Exception as exc:
        logger.warning("Could not embed query for RAG retrieval: %s", exc)
        return ""

    results = store.search(vec, top_k=config.TOP_K_RETRIEVAL)

    if not results:
        return ""

    parts: List[str] = []
    for i, chunk in enumerate(results, 1):
        parts.append(
            f"[Source {i}: {chunk['file_name']} | relevance {chunk['score']:.2f}]\n"
            f"{chunk['text']}"
        )

    context = "\n\n---\n\n".join(parts)
    logger.debug("Retrieved %d RAG chunks for query: %s…", len(results), query[:60])
    return context


def retrieve_context_for_turn(conversation_history: List[str], store: VectorStore) -> str:
    """
    Build a query from the last few turns of conversation and retrieve context.

    Args:
        conversation_history: List of recent conversation messages (strings).
        store: The initialized VectorStore.

    Returns:
        Formatted context string.
    """
    # Use the last 3 turns as the retrieval query
    recent = " ".join(conversation_history[-3:]) if conversation_history else ""
    if not recent.strip():
        return ""
    return retrieve_context(recent, store)
