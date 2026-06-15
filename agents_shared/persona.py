"""
agents_shared/persona.py — single source of truth for both Brandtangent agents.

`build_system_prompt(channel, agent_name, rag_context)` assembles the system
prompt from four markdown files under `persona/`:

    base.md           — identity, brand, tone, hard rules (always in)
    knowledge.md      — how to use retrieved KB excerpts
    channel_chat.md   — chat-specific format + tools
    channel_voice.md  — voice-specific format + tools

The chat agent and the voice agent both call this with their own channel
identifier so they share an identical persona but get channel-appropriate
formatting and tool guidance.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

Channel = Literal["chat", "voice"]

_PERSONA_DIR = Path(__file__).parent / "persona"

_TEMPLATE = """\
{base}

---

{channel}

---

{knowledge}

---

# Retrieved knowledge (working memory — do not cite filenames or sources)

{rag_context}
"""


@lru_cache(maxsize=8)
def _read(name: str) -> str:
    """Read a markdown file from the persona/ directory (cached)."""
    path = _PERSONA_DIR / name
    if not path.is_file():
        raise FileNotFoundError(
            f"Shared persona file missing: {path}. "
            "agents_shared/persona/ must contain base.md, knowledge.md, "
            "channel_chat.md, and channel_voice.md."
        )
    return path.read_text(encoding="utf-8").strip()


def build_system_prompt(
    channel: Channel,
    agent_name: str,
    rag_context: str = "",
) -> str:
    """
    Assemble the full system prompt for the given channel.

    Args:
        channel: "chat" or "voice".
        agent_name: First-person name the model should adopt
            (e.g. "Alex" for chat, "Maya" for voice).
        rag_context: Pre-formatted retrieved knowledge block. Pass an empty
            string when nothing matched; this function will substitute a
            sensible placeholder so the model knows the KB was queried but
            had nothing useful.
    """
    if channel not in ("chat", "voice"):
        raise ValueError(f"Unknown channel: {channel!r}. Use 'chat' or 'voice'.")

    base = _read("base.md")
    knowledge = _read("knowledge.md")
    channel_block = _read(f"channel_{channel}.md")

    rag_block = rag_context.strip() or (
        "(No knowledge base excerpts matched this turn. "
        "Either ask a clarifying question or use the appropriate research tool "
        "rather than guessing.)"
    )

    rendered = _TEMPLATE.format(
        base=base,
        channel=channel_block,
        knowledge=knowledge,
        rag_context=rag_block,
    )

    return rendered.replace("{agent_name}", agent_name)
