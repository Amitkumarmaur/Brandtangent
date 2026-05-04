# DigiiMark Live Chat AI Agent

Python service that powers an intelligent, **Gemini 2.5 Flash** chat agent for DigiiMark: RAG over a local `knowledge_base/`, a **`web_search_tool`** that runs **Google Search grounding** in a separate API call (Gemini does not allow mixing `google_search` with function calling in one request), CRM/calendar **webhooks**, Markdown **transcripts**, and a **`call_logs.json`** index.

## Quick start

```bash
cd chatagent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Set GEMINI_API_KEY in .env
python main.py
```

Open **http://127.0.0.1:8010/** for the static demo UI, or **http://127.0.0.1:8010/docs** for OpenAPI.

## Knowledge base and RAG

- Put **PDF, Markdown, text, or DOCX** files under `knowledge_base/`.
- On startup, existing files are **chunked, embedded** (`gemini-embedding-001`), and stored in **FAISS** under `rag/`.
- **watchdog** watches `knowledge_base/`; new or changed files are re-indexed automatically; deletes remove chunks.
- Each user turn runs retrieval against the **latest user message** (plus recent user lines) and injects excerpts into the system prompt. The model is instructed to **cite filenames** when using that content.

### Supabase / pgvector (optional)

This package ships with **FAISS** for zero-config local vector search. To use **Supabase + pgvector** instead, you would replace `rag/indexer.py` / `rag/retriever.py` with upsert/query against a table (same chunk schema: `file_name`, `text`, embedding). The watcher and chunking pipeline can stay as-is.

## API

| Method | Path | Purpose |
|--------|------|--------|
| POST | `/v1/chat/session` | Start a session (`user_identifier` optional). |
| POST | `/v1/chat/message` | Send a message (`session_id` optional — creates session if omitted). |
| POST | `/v1/chat/session/{id}/message` | Same as above with session in path. |
| POST | `/v1/chat/session/{id}/end` | Finalize: write `transcripts/YYYY-MM-DD_HH-MM-SS_session-{id}.md` and append **call_logs.json**. Body: `topics` (optional), `outcome` (default `completed`). |

Response fields from `/v1/chat/message` include `reply`, `citations` (KB hits for that turn), and `tools_used` (function tools only; Google Search is handled inside Gemini).

## Tools and webhooks

- **calendar_tool** — `CALENDAR_WEBHOOK_URL` (JSON POST; simulated if unset).
- **lead_capture_tool** — `LEAD_CAPTURE_WEBHOOK_URL`; requires **name, email, requirement**.
- **web_search_tool** — when the model calls it, the server runs a short grounded `generate_content` request. Toggle with `ENABLE_GOOGLE_SEARCH_TOOL` (default `true`).
- **Extra POST webhooks** — copy `webhook_tools.json.example` to `webhook_tools.json` and set the referenced env vars (see `tools/dynamic_webhooks.py`).

## Transcripts and logs

- **Transcripts:** `transcripts/YYYY-MM-DD_HH-MM-SS_session-{session_id}.md`
- **Index:** `transcripts/call_logs.json` — array of objects with `session_id`, timestamps, `user_identifier`, `topics`, `tools_used`, `outcome`, `transcript_file`, `turn_count`.

If `topics` is omitted on end, the service runs a **short Gemini pass** to infer topic tags from the transcript.

## Environment

See `.env.example`. **GEMINI_API_KEY** is required at import time.

## Website widget (Next.js)

The main site proxies requests to this service via **`CHAT_AGENT_URL`** (server-side only), e.g. `https://chat-api.yourdomain.com`. The UI calls **`/api/chat-agent/...`**; see `app/api/chat-agent/[...path]/route.ts` in the repo. In local dev, the proxy defaults to `http://127.0.0.1:8010` when `CHAT_AGENT_URL` is unset—run `python main.py` in `chatagent/` while `pnpm dev` is on port 3000.

## Production notes

- Run behind HTTPS (reverse proxy).
- Restrict CORS in `server.py` instead of `*`.
- Persist `rag/` and `transcripts/` on a volume if the service is containerized.
