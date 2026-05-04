"""Shared Gemini API client for chat, embeddings, and grounded web search."""

from __future__ import annotations

import os

import google.genai as genai
from google.genai.types import HttpOptions, HttpRetryOptions

import config

# Longer timeout and explicit retries — short defaults caused intermittent failures under load.
client = genai.Client(
    api_key=config.GEMINI_API_KEY,
    http_options=HttpOptions(
        timeout=int(os.getenv("GEMINI_HTTP_TIMEOUT_MS", "180000")),
        retry_options=HttpRetryOptions(
            attempts=int(os.getenv("GEMINI_HTTP_RETRY_ATTEMPTS", "6")),
        ),
    ),
)
