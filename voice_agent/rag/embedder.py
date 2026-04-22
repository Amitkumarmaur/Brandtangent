"""
rag/embedder.py — Gemini embedding wrapper.

Converts text into dense vectors using Google's text-embedding-004 model.
"""

from __future__ import annotations

import logging
from typing import List

import google.genai as genai

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config

logger = logging.getLogger(__name__)

# Initialise the Gemini client once
_client = genai.Client(api_key=config.GEMINI_API_KEY)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Embed a list of text strings and return their vector representations.

    Args:
        texts: List of strings to embed.

    Returns:
        List of embedding vectors (each a list of floats).
    """
    if not texts:
        return []

    embeddings: List[List[float]] = []

    # text-embedding-004 supports batch requests; batch in groups of 100
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
    """
    Embed a single query string.

    Args:
        query: The search query.

    Returns:
        Embedding vector as a list of floats.
    """
    results = embed_texts([query])
    return results[0] if results else []
