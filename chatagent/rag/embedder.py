"""
rag/embedder.py — Gemini embedding wrapper for the chat agent.

Uses `gemini-embedding-001` with Matryoshka Representation Learning truncated
to 1536 dimensions, matching the voice agent and the `vector(1536)` column
in Supabase. We set `task_type` on every request so the model applies the
right embedding strategy — query vs document — which measurably improves
retrieval quality.

The chat agent only embeds queries (documents are embedded by
`scripts/sync_voice_kb.py` and stored in `knowledge_base_chunks`).
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

# Task types supported by gemini-embedding-001.
# https://ai.google.dev/gemini-api/docs/embeddings#task-types
_TASK_QUERY = "RETRIEVAL_QUERY"


def embed_query(query: str) -> List[float]:
    """Embed a single retrieval query. Returns a 1536-dim vector."""
    if not query or not query.strip():
        return []
    try:
        response = _client.models.embed_content(
            model=config.EMBEDDING_MODEL,
            contents=[query],
            config=genai_types.EmbedContentConfig(
                task_type=_TASK_QUERY,
                output_dimensionality=config.EMBEDDING_DIMENSION,
            ),
        )
    except Exception as exc:
        logger.error("Embedding failed: %s", exc)
        raise

    if not response.embeddings:
        return []
    return list(response.embeddings[0].values)
