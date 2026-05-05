"""
rag/indexer.py — Knowledge base health probe.

The chat agent no longer maintains its own vector store. The shared
knowledge base lives in Supabase (`knowledge_base_documents` +
`knowledge_base_chunks`) and is populated by `scripts/sync_voice_kb.py`.

This module exposes a thin `KBIndex` class so existing call sites in
server.py keep working with the same interface — the only thing it does
is count rows on demand for the /health endpoint.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config  # noqa: F401  (ensures repo-root is on sys.path)
from supabase_client import get_client

logger = logging.getLogger(__name__)


class KBIndex:
    """
    Minimal stand-in for the old FAISS VectorStore.

    Just queries `knowledge_base_chunks.count(*)` — used by the /health
    endpoint to expose how much KB content is available right now.
    """

    def __init__(self) -> None:
        self._cached_count: Optional[int] = None

    @property
    def total_chunks(self) -> int:
        """Return the current number of chunks in Supabase (cached after first call)."""
        if self._cached_count is None:
            self._cached_count = self._count_chunks()
        return self._cached_count

    def refresh(self) -> int:
        """Force a fresh count from Supabase."""
        self._cached_count = self._count_chunks()
        return self._cached_count

    @staticmethod
    def _count_chunks() -> int:
        try:
            res = (
                get_client()
                .table("knowledge_base_chunks")
                .select("id", count="exact")
                .limit(1)
                .execute()
            )
            return res.count or 0
        except Exception as exc:
            logger.warning(
                "Could not count knowledge_base_chunks (RAG retrieval may "
                "still work, but /health will report 0): %s",
                exc,
            )
            return 0


def build_kb_index() -> KBIndex:
    """Construct the index, eagerly probing Supabase so boot fails fast on bad creds."""
    index = KBIndex()
    chunks = index.refresh()
    logger.info("Knowledge base ready | chunks=%d", chunks)
    return index
