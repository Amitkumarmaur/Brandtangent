# DigiiMark Voice AI Agent

A real-time **voice AI agent** for DigiiMark — an AI-first marketing automation agency.  
Powered by **Gemini 2.0 Flash Live API** for speech-to-speech conversations, with a
**RAG knowledge base**, automatic document indexing, full **call transcripts**, and
extendable **webhook-based tools**.

---

## ✨ Features

| Feature | Detail |
|---------|--------|
| 🎙️ **Real-time voice** | Gemini Live API — sub-second latency, speech-in / speech-out |
| 🧠 **RAG knowledge base** | Drop files in `knowledge_base/` → auto-indexed via FAISS |
| 📝 **Call transcripts** | Every call saved as `.md` + indexed in `calls_log.json` |
| 🔧 **Tools / webhooks** | Calendar booking, lead capture — extendable with any webhook |
| 👁️ **File watcher** | `watchdog` monitors `knowledge_base/` for changes 24/7 |
| 🖥️ **Rich terminal UI** | Colour-coded live transcript, startup banners, call log table |

---

## 📁 Project Structure

```
voice_agent/
├── main.py                     # Entry point — run this
├── agent.py                    # Gemini Live API voice loop
├── config.py                   # All settings & environment variables
├── transcript_manager.py       # Save call transcripts + calls_log.json
├── setup.py                    # One-click setup script
│
├── rag/
│   ├── indexer.py              # File watcher + FAISS indexer
│   ├── retriever.py            # Semantic search
│   ├── embedder.py             # Gemini text-embedding-004 wrapper
│   ├── vector_store.faiss      # Auto-generated — do not commit
│   └── vector_metadata.json    # Auto-generated — do not commit
│
├── tools/
│   ├── base.py                 # BaseTool class + ToolRegistry
│   ├── calendar_tool.py        # Book appointments via webhook
│   └── lead_capture_tool.py    # Save lead info via webhook
│
├── knowledge_base/             # Drop company documents here
│   ├── digiimark_overview.md   # Company info, services, FAQs
│   └── digiimark_pricing.md    # Pricing guide
│
├── transcripts/                # Auto-created — one .md per call
│   └── calls_log.json          # Master calls index
│
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
├── .env                        # Your secrets — never commit this
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Python 3.10+** (check: `python --version`)
- **Microphone & Speakers** connected to your machine
- **Gemini API key** — get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 2. Run Setup (one-time)

```bash
cd voice_agent
python setup.py
```

This will:
- Create a virtual environment (`venv/`)
- Install all Python dependencies
- Copy `.env.example` → `.env`
- Run a Gemini API connectivity test

### 3. Configure `.env`

Open `voice_agent/.env` and fill in:

```env
GEMINI_API_KEY=your_actual_key_here
CALENDAR_WEBHOOK_URL=https://your-make-or-n8n-webhook.com/calendar
```

### 4. Run the Agent

```bash
# Activate venv first
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start the voice agent
python main.py
```

Speak into your microphone. The agent responds in real-time.  
Press **Ctrl+C** to end the call and save the transcript.

---

## 🎛️ Commands

```bash
# Run the voice agent (default)
python main.py

# List all audio devices (find correct mic/speaker index)
python main.py --list-devices

# Re-index the knowledge base without starting a call
python main.py --index-only

# View all past call records
python main.py --list-calls

# View a specific call's transcript
python main.py --call-id abc123de
```

---

## 🧠 Knowledge Base

The agent uses **Retrieval-Augmented Generation (RAG)** to answer questions from your company documents.

### Adding Documents

Simply drop files into the `knowledge_base/` folder:

```
knowledge_base/
├── digiimark_overview.md     ← Company info (pre-loaded)
├── digiimark_pricing.md      ← Pricing guide (pre-loaded)
├── case_studies.pdf          ← Drop any new file here
├── services_brochure.docx    ← Automatically indexed!
└── team_bios.txt             ← Works with .txt, .md, .pdf, .docx
```

**How it works:**
1. On startup — all files are indexed into a local FAISS vector store
2. While running — `watchdog` detects new/changed files and re-indexes them automatically
3. On each conversation turn — the agent embeds the user's last message, retrieves the top 4 relevant chunks, and injects them into its system prompt

**Supported formats:** `.md`, `.txt`, `.pdf`, `.docx`

---

## 🔧 Tools

Tools are Python classes that the agent can call during a conversation using  
**Gemini function calling**. Each tool fires a **webhook POST request**.

### Calendar Tool

Triggered when a user wants to book a call.  
Example phrases: *"I'd like to book a discovery call"*, *"Can I schedule a meeting?"*

**Webhook payload sent to `CALENDAR_WEBHOOK_URL`:**
```json
{
  "prospect_name": "John Smith",
  "prospect_email": "john@example.com",
  "prospect_phone": "+1-555-0123",
  "preferred_date": "2026-04-20",
  "preferred_time": "3:00 PM IST",
  "meeting_reason": "SEO strategy discussion",
  "timezone": "Asia/Kolkata",
  "source": "voice_agent",
  "agent": "Maya"
}
```

### Lead Capture Tool

Triggered when a user wants to be contacted but isn't ready to book.  
Example phrases: *"Just leave my details"*, *"Follow up with me later"*

### Adding a New Tool

1. Create `tools/my_new_tool.py`:

```python
from tools.base import BaseTool

class MyNewTool(BaseTool):
    name = "my_new_tool"
    description = "What this tool does in one sentence."
    parameters = {
        "type": "object",
        "properties": {
            "param1": {"type": "string", "description": "..."},
        },
        "required": ["param1"],
    }

    def execute(self, param1: str, **kwargs) -> dict:
        # Your logic here — call an API, fire a webhook, etc.
        import httpx
        response = httpx.post("https://your-webhook.com", json={"param1": param1})
        return {"result": "success", "message": "Done!"}
```

2. Register it in `tools/__init__.py`:

```python
from tools.my_new_tool import MyNewTool
registry.register(MyNewTool())
```

That's it — Gemini will automatically know when to use it.

---

## 📝 Transcripts

Every call is saved automatically:

**Per-call transcript** (`transcripts/2026-04-15_11-30-00_abc123.md`):
```markdown
# DigiiMark Voice Agent — Call Transcript

**Call ID:** `abc123de`
**Date:** 2026-04-15
**Duration:** 3m 42s

## Conversation
🧑 **User**: Tell me about your SEO services
🤖 **Maya**: Great question! Our SEO service covers...

## Tool Calls
### `calendar_tool`
**Arguments:** { "prospect_name": "John", ... }
**Result:** { "result": "success", "message": "Appointment booked!" }
```

**Master log** (`transcripts/calls_log.json`):
```json
[
  {
    "call_id": "abc123de",
    "date": "2026-04-15",
    "time": "11:30:00",
    "duration_seconds": 222,
    "transcript_file": "transcripts/2026-04-15_11-30-00_abc123de.md",
    "topics": ["SEO", "appointment booking"],
    "tools_used": ["calendar_tool"],
    "turn_count": 8
  }
]
```

---

## ⚙️ Configuration Reference

All settings are in `config.py` and loaded from `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | *(required)* | Google AI Studio API key |
| `CALENDAR_WEBHOOK_URL` | — | Webhook URL for appointment booking |
| `LEAD_CAPTURE_WEBHOOK_URL` | — | Webhook URL for lead capture |
| `AGENT_NAME` | `Maya` | The agent's name (used in responses) |
| `AGENT_VOICE` | `Aoede` | Gemini voice preset |
| `INPUT_DEVICE_INDEX` | *(system default)* | Mic device index (from `--list-devices`) |
| `OUTPUT_DEVICE_INDEX` | *(system default)* | Speaker device index |
| `LOG_LEVEL` | `INFO` | Logging verbosity: `DEBUG`, `INFO`, `WARNING` |

### Available Gemini Voice Presets

`Aoede`, `Charon`, `Fenrir`, `Kore`, `Puck`

---

## 🔌 Webhook Integration Examples

### Make.com (Recommended)
1. Create a new scenario → add a **Webhooks** module
2. Copy the webhook URL → paste into `CALENDAR_WEBHOOK_URL` in `.env`
3. Add downstream modules (Google Calendar, Notion, HubSpot CRM, Slack notification, etc.)

### n8n
1. Add a **Webhook** node (HTTP POST)
2. Copy the URL → paste into `.env`
3. Build your automation with Google Calendar, HubSpot, email, etc.

### Zapier
1. Create a Zap → trigger: **Webhooks by Zapier** (Catch Hook)
2. Paste URL into `.env`
3. Add actions (Calendly, Google Sheets, Gmail, Slack, etc.)

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `EnvironmentError: GEMINI_API_KEY is not set` | Add key to `voice_agent/.env` |
| `ModuleNotFoundError: No module named 'pyaudio'` | Run `pip install pyaudio` (may need PortAudio: `brew install portaudio` on Mac) |
| No audio input / output | Run `python main.py --list-devices` and set correct indices in `.env` |
| `ModuleNotFoundError: No module named 'faiss'` | Run `pip install faiss-cpu` |
| Knowledge base not updating | Check `watchdog` is installed; try `--index-only` flag |
| Gemini API 429 error | You've hit rate limits. Wait 1 minute and retry. |
| Call transcript not saved | Check write permissions on `transcripts/` folder |

---

## 🗺️ Roadmap / Extending the Agent

- [ ] **Web interface** — Browser-based UI for the voice agent
- [ ] **Phone integration** — Twilio / Vonage SIP to handle real phone calls
- [ ] **Multi-language** — Detect caller language and respond in kind
- [ ] **CRM tool** — Push call data + transcript to HubSpot / Salesforce automatically
- [ ] **Email tool** — Send a summary email after every call
- [ ] **Sentiment analysis** — Tag transcripts by sentiment for QA review
- [ ] **Embeddings dashboard** — Visualise the knowledge base graph

---

## 📄 License

Internal tool for DigiiMark. Not for redistribution.

---

*Built with ❤️ using Gemini Live API, FAISS, and Python.*
