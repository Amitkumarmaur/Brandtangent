"""
rag/embedder.py — Gemini embedding wrapper.

Uses `gemini-embedding-001` with Matryoshka Representation Learning (MRL)
truncated to 1536 dimensions. Why 1536:
  * Fits pgvector's native HNSW index limit (2000 dims) without a halfvec cast.
  * Halves storage vs the full 3072-d vector with negligible accuracy loss.
  * Matches the OpenAI `text-embedding-3-small` dimension for portability.

We set `task_type` on every request so the model applies the right embedding
strategy — query vs document — which measurably improves retrieval quality.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import List

import google.genai as genai
import google.genai.types as genai_types

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config

logger = logging.getLogger(__name__)

_client = genai.Client(api_key=config.GEMINI_API_KEY)

# Task types supported by gemini-embedding-001. See:
# https://ai.google.dev/gemini-api/docs/embeddings#task-types
_TASK_QUERY = "RETRIEVAL_QUERY"
_TASK_DOCUMENT = "RETRIEVAL_DOCUMENT"


def _embed(texts: List[str], task_type: str) -> List[List[float]]:
    """Internal: batch-embed texts with an explicit task type."""
    if not texts:
        return []

    embeddings: List[List[float]] = []
    batch_size = 100

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        try:
            response = _client.models.embed_content(
                model=config.EMBEDDING_MODEL,
                contents=batch,
                config=genai_types.EmbedContentConfig(
                    task_type=task_type,
                    output_dimensionality=config.EMBEDDING_DIMENSION,
                ),
            )
        except Exception as exc:
            logger.error(
                "Embedding failed (task=%s, batch %d): %s",
                task_type, i // batch_size, exc,
            )
            raise

        for emb in response.embeddings:
            embeddings.append(list(emb.values))

    logger.debug("Embedded %d text(s) with task_type=%s.", len(texts), task_type)
    return embeddings


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Embed a list of document texts for indexing.

    Returns a list of 1536-dim vectors.
    """
    return _embed(texts, task_type=_TASK_DOCUMENT)


def embed_query(query: str) -> List[float]:
    """
    Embed a single retrieval query.

    Returns a 1536-dim vector.
    """
    results = _embed([query], task_type=_TASK_QUERY)
    return results[0] if results else []
