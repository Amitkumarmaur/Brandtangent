"""
supabase_client.py — Singleton Supabase client for the voice agent.

Uses the service role key so we can bypass RLS for transcript writes and
call the match_kb_chunks RPC without extra auth plumbing. Importing this
module is cheap: the client is built lazily on first access.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Optional

from supabase import Client, create_client

sys.path.insert(0, os.path.dirname(__file__))
import config

logger = logging.getLogger(__name__)

_client: Optional[Client] = None


def get_client() -> Client:
    """Return the process-wide Supabase service-role client."""
    global _client
    if _client is None:
        _client = create_client(
            config.SUPABASE_URL,
            config.SUPABASE_SERVICE_ROLE_KEY,
        )
        logger.debug("Supabase client initialised.")
    return _client
