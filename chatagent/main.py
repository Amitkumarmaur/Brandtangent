"""Run the DigiiMark Live Chat API (uvicorn)."""

from __future__ import annotations

import uvicorn

import config

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host=config.CHAT_WEB_HOST,
        port=config.CHAT_WEB_PORT,
        reload=False,
    )
