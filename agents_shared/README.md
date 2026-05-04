# `agents_shared/` — one persona, two agents

Both DigiiMark AI agents derive their system prompt from this folder. Edit
the markdown here, and the change ships to both **chat** (`chatagent/`) and
**voice** (`voice_agent/`) on the next deploy. No more drift.

## Files

| File | Purpose |
|------|---------|
| `persona/base.md` | Identity, brand, tone, hard rules. Channel-agnostic. |
| `persona/knowledge.md` | How to use retrieved KB excerpts (no filename citations, etc.). |
| `persona/channel_chat.md` | Chat-only format rules + chat tools (`web_search_tool`, `lead_capture_tool`, `calendar_tool`). |
| `persona/channel_voice.md` | Voice-only format rules + voice tools (`find_service`, `find_case_study`, `find_faq`, `book_appointment_tool`, `lead_capture_tool`). |
| `persona.py` | `build_system_prompt(channel, agent_name, rag_context)` assembler. |

## Usage

```python
from agents_shared import build_system_prompt

prompt = build_system_prompt(
    channel="chat",          # or "voice"
    agent_name="Alex",       # "Maya" for voice
    rag_context=rag_block,   # pre-formatted retrieved excerpts
)
```

## Editing rules

- **Anything that should be true for both agents** goes in `base.md` or
  `knowledge.md`.
- **Format constraints** (length, markdown allowed?, opening style) and
  **tool descriptions** go in the channel-specific file.
- Use the literal token `{agent_name}` wherever the persona's first name
  should appear. The assembler substitutes it last so both files stay
  channel-agnostic.

## Deployment context

Both agent Docker images build from the **repo root** so this folder is
copied into each container alongside the agent's own source. See:

- `chatagent/Dockerfile`
- `voice_agent/Dockerfile`

If you move or rename `agents_shared/`, update both Dockerfiles and the
`PYTHONPATH` they set.
