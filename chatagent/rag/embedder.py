"""
rag/embedder.py — Gemini embeddings for chunk indexing and retrieval queries.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import List

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from gemini_client import client as _client

logger = logging.getLogger(__name__)


def embed_texts(texts: List[str]) -> List[List[float]]:
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
            )
            for emb in response.embeddings:
                embeddings.append(emb.values)
        except Exception as exc:
            logger.error("Embedding request failed for batch %d: %s", i // batch_size, exc)
            raise

    logger.debug("Embedded %d texts.", len(texts))
    return embeddings


def embed_query(query: str) -> List[float]:
    results = embed_texts([query])
    return results[0] if results else []
