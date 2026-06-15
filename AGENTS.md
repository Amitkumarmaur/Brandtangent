# DigiiMark Website — Agent Instructions

> Read this file first before doing any work on this project.

## Project Overview

This is the website for **DigiiMark**, an AI-first marketing automation agency.
Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Motion.

## Mandatory Reading

Before creating or modifying ANY file, read these in order:

1. **`.agents/skills/digiimark-project/SKILL.md`** — Project context, tech stack, file structure, component patterns, and all design rules.
2. **`STYLE_GUIDE.md`** — Complete design system: colors, typography, spacing, layout, buttons, borders, animation patterns, and the component checklist.
3. **`app/globals.css`** — All CSS custom properties and Tailwind theme tokens. This is the source of truth for every color, font, and utility class.

## Design System Enforcement

Every component, page, and section **must** follow the patterns documented in
`STYLE_GUIDE.md`. Key rules:

- **Colors:** Use tokenized classes (`bg-ignite-orange`, `text-grey-400`, `bg-foreground`). Never hardcode hex values.
- **Typography:** `font-heading` (Poppins) for headings, `font-sans` (Inter) for body. H2 scale: `text-3xl md:text-4xl lg:text-5xl font-semibold`.
- **Layout:** Container is always `max-w-7xl mx-auto px-6 lg:px-8`. Section padding is `py-16 md:py-20`.
- **Eyebrow labels:** `w-2 h-2` orange dot + `text-sm uppercase tracking-wider` text, with `mb-4`.
- **Images:** Always use Next.js `<Image>`, never `<img>`.
- **Animations:** Motion (`motion/react`) with `viewport={{ once: true }}`.

## Keeping References in Sync

When you modify `app/globals.css` (add/remove/change tokens), you **must** also update:
1. `STYLE_GUIDE.md` — the markdown design system reference
2. `public/style-guide.html` — the visual style guide

When you add a new page or major component, update the file structure section in
`.agents/skills/digiimark-project/SKILL.md`.

## AI agents — chat, voice, and shared persona

The site ships with a unified "Get in touch" widget (`components/contact-widget.tsx`)
that exposes three channels: contact form, live chat (Alex), live voice (Maya).

- **Chat agent** — Python service at `chatagent/` (FastAPI). Browser hits
  `/api/chat-agent/v1/...` which proxies to `CHAT_AGENT_URL` (Railway).
- **Voice agent** — Python service at `voice_agent/` (FastAPI + WebSocket +
  Gemini Live API). Embedded inside the contact widget via an iframe pointing
  at `NEXT_PUBLIC_VOICE_AGENT_URL`.
- **Shared persona** — both agents derive their system prompt from
  `agents_shared/persona/*.md` via `agents_shared.persona.build_system_prompt()`.
  **Edit the markdown there** — never duplicate prompt copy back into
  `chatagent/config.py` or `voice_agent/config.py`. Channel-specific format
  rules and tool descriptions live in `channel_chat.md` / `channel_voice.md`.
- **Shared Supabase** — both agents read from one knowledge base
  (`knowledge_base_documents` + `knowledge_base_chunks`, populated by
  `scripts/sync_voice_kb.py`) and write transcripts to mirrored tables:
  - Voice: `voice_calls` / `voice_call_turns` / `voice_call_tool_calls`
  - Chat: `chat_sessions` / `chat_session_turns` / `chat_session_tool_calls`
  Both stores have RLS denying anon reads; the agents use the service role key.

Both agent Docker images build from the **repo root** so they can copy
`agents_shared/` into the image. See `voice_agent/Dockerfile`,
`chatagent/Dockerfile`, and the per-service `railway.json` files. Both agents
are stateless and survive Railway restarts.

### Required env vars (Vercel + `.env.local`)

| Variable | Purpose |
|---|---|
| `CHAT_AGENT_URL` | URL of the deployed chat agent (e.g. `https://chat.digiimark.com`). The proxy at `app/api/chat-agent/[...path]/route.ts` forwards there. |
| `NEXT_PUBLIC_VOICE_AGENT_URL` | URL of the deployed voice agent (e.g. `https://voice.digiimark.com`). Used as the iframe `src` in the voice panel. |
| `CONTACT_INQUIRY_WEBHOOK_URL` | Webhook the contact form posts to (Make / n8n / Zapier). |

### Required env vars on each agent's server (Railway)

| Variable | Used by |
|---|---|
| `GEMINI_API_KEY` | Both agents (LLM + embeddings) |
| `SUPABASE_URL` | Both agents (RAG + transcripts) |
| `SUPABASE_SERVICE_ROLE_KEY` | Both agents (writes bypass RLS) |
| `CALCOM_API_KEY`, `CALCOM_EVENT_TYPE_ID` | Voice agent (booking) |
| `LEAD_CAPTURE_WEBHOOK_URL` | Both agents (lead webhook) |
| `CALENDAR_WEBHOOK_URL` | Chat agent (booking via webhook) |
| `CORS_ORIGINS` | Voice agent (CORS + iframe frame-ancestors) |

## Available Skills

Skills are in `.agents/skills/`. Read the relevant SKILL.md before using:

| Skill | Purpose |
|-------|---------|
| `digiimark-project` | Core project rules, patterns, and file structure |
| `nano-banana-image-gen` | Generate images using Google Nano Banana 2 API |

## Quick Commands

```bash
pnpm dev          # Start dev server (port 3001)
pnpm build        # Production build
pnpm lint         # Run ESLint
```
