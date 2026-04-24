"""
server.py — FastAPI WebSocket server for the DigiiMark Voice Agent web UI.

Architecture:
  Browser (mic audio via Web Audio API)
    → WebSocket (binary PCM frames)
      → FastAPI server
        → Gemini Live API (async bidirectional stream)
        ↑         ↓
        |         └→ Supabase (RAG retrieval, transcripts, content lookups)
        ↓
      ← WebSocket (binary audio + JSON transcript)
    ← Browser (plays audio + shows transcript)

Run:
    cd voice_agent
    source venv/bin/activate
    python server.py
    # Open http://localhost:8001 (or $PORT) in your browser
"""

from __future__ import annotations

import asyncio
import json
import logging
import sys
from pathlib import Path

from fastapi import FastAPI, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

import google.genai as genai
import google.genai.types as genai_types

# ─── Bootstrap ────────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
import config
from rag.retriever import retrieve_context_for_turn
from supabase_client import get_client
from tools import registry as tool_registry
from transcript_manager import TranscriptManager

logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL, logging.INFO),
    format="[%(asctime)s] %(levelname)-8s %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("digiimark.server")

# ─── Gemini client ────────────────────────────────────────────────────────────
_client = genai.Client(
    api_key=config.GEMINI_API_KEY,
    http_options={"api_version": "v1beta"},
)

# ─── Warm up Supabase connection (fail fast on bad creds) ─────────────────────
try:
    _kb_count_probe = (
        get_client()
        .table("knowledge_base_chunks")
        .select("id", count="exact")
        .limit(1)
        .execute()
    )
    _INITIAL_KB_CHUNKS = _kb_count_probe.count or 0
    logger.info("Supabase connected. knowledge_base_chunks: %d", _INITIAL_KB_CHUNKS)
except Exception as exc:
    logger.warning(
        "Supabase probe failed — RAG retrieval may not work. Check credentials. (%s)",
        exc,
    )
    _INITIAL_KB_CHUNKS = 0

# ─── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(title="DigiiMark Voice Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WEB_DIR = Path(__file__).parent / "web"
WEB_DIR.mkdir(exist_ok=True)
(WEB_DIR / "static").mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(WEB_DIR / "static")), name="static")


@app.get("/favicon.ico", include_in_schema=False)
async def serve_favicon():
    return Response(status_code=204)


@app.get("/")
async def serve_index():
    """Serve the web UI."""
    index_path = WEB_DIR / "index.html"
    if index_path.exists():
        return HTMLResponse(index_path.read_text(encoding="utf-8"))
    return HTMLResponse(
        "<h1>Web UI not found. Place index.html in voice_agent/web/</h1>"
    )


@app.get("/api/health")
async def health():
    """Health + feature flags for the browser widget."""
    try:
        probe = (
            get_client()
            .table("knowledge_base_chunks")
            .select("id", count="exact")
            .limit(1)
            .execute()
        )
        kb_chunks = probe.count or 0
    except Exception:
        kb_chunks = _INITIAL_KB_CHUNKS

    return {
        "status": "ok",
        "agent": config.AGENT_NAME,
        "voice": config.AGENT_VOICE,
        "model": config.LIVE_MODEL,
        "knowledge_chunks": kb_chunks,
        "tools": tool_registry.list_tools(),
    }


@app.get("/api/calls")
async def list_calls(limit: int = 50):
    """Return the most recent calls from Supabase."""
    try:
        res = (
            get_client()
            .table("voice_calls")
            .select("*")
            .order("started_at", desc=True)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as exc:
        logger.error("list_calls failed: %s", exc)
        return []


@app.get("/api/calls/{call_id}")
async def get_call(call_id: str):
    """Return a specific call + its turns + tool calls."""
    try:
        client = get_client()
        call_res = (
            client.table("voice_calls").select("*").eq("call_id", call_id).execute()
        )
        if not call_res.data:
            return {"error": "Call not found"}
        call = call_res.data[0]

        turns_res = (
            client.table("voice_call_turns")
            .select("turn_index, role, content, created_at")
            .eq("call_id", call_id)
            .order("turn_index")
            .execute()
        )
        tools_res = (
            client.table("voice_call_tool_calls")
            .select("tool_name, args, result, called_at")
            .eq("call_id", call_id)
            .order("called_at")
            .execute()
        )

        return {
            **call,
            "turns": turns_res.data or [],
            "tool_calls": tools_res.data or [],
        }
    except Exception as exc:
        logger.error("get_call failed: %s", exc)
        return {"error": str(exc)}


# ─── WebSocket voice endpoint ────────────────────────────────────────────────

@app.websocket("/ws/voice")
async def voice_ws(ws: WebSocket):
    """
    WebSocket endpoint for real-time voice interaction.

    Protocol:
      Client → Server:
        - Binary frames: raw PCM audio (16kHz, 16-bit, mono)
        - JSON text frames: {"type": "control", "action": "end_call"}

      Server → Client:
        - Binary frames: raw PCM audio (24kHz, 16-bit, mono)
        - JSON text frames:
            {"type": "transcript", "role": "user"|"assistant", "text": "..."}
            {"type": "tool_call", "tool": "...", "args": {...}, "result": {...}}
            {"type": "status", "message": "..."}
            {"type": "call_started", "call_id": "..."}
            {"type": "call_ended", "call_id": "..."}
    """
    await ws.accept()
    logger.info("WebSocket connected.")

    # Capture caller metadata (best-effort).
    caller_metadata = {
        "user_agent": ws.headers.get("user-agent", ""),
        "referrer": ws.headers.get("referer", ""),
        "forwarded_for": ws.headers.get("x-forwarded-for", ""),
    }

    tm = TranscriptManager()
    call_id = tm.start_call(caller_metadata=caller_metadata)
    conversation_history: list[str] = []

    await ws.send_json({"type": "call_started", "call_id": call_id})
    await ws.send_json(
        {
            "type": "status",
            "message": f"Connected to {config.AGENT_NAME}. Start speaking!",
        }
    )

    # Build system prompt with RAG context.
    def build_prompt() -> str:
        rag_ctx = retrieve_context_for_turn(conversation_history)
        return config.SYSTEM_PROMPT_TEMPLATE.format(
            agent_name=config.AGENT_NAME,
            rag_context=rag_ctx or "(Knowledge base empty.)",
        )

    session_config = genai_types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        input_audio_transcription=genai_types.AudioTranscriptionConfig(),
        output_audio_transcription=genai_types.AudioTranscriptionConfig(),
        speech_config=genai_types.SpeechConfig(
            voice_config=genai_types.VoiceConfig(
                prebuilt_voice_config=genai_types.PrebuiltVoiceConfig(
                    voice_name=config.AGENT_VOICE,
                )
            )
        ),
        system_instruction=genai_types.Content(
            parts=[genai_types.Part(text=build_prompt())]
        ),
        tools=tool_registry.gemini_tools_config(),
    )

    # Buffers so we commit one turn per complete utterance instead of one
    # turn per streamed transcription fragment (Gemini sends output text
    # word-by-word as it speaks).
    pending = {"user": "", "assistant": ""}

    async def _flush_pending(role: str) -> None:
        text = pending[role].strip()
        pending[role] = ""
        if not text:
            return
        if role == "user":
            conversation_history.append(f"Caller: {text}")
        else:
            conversation_history.append(f"{config.AGENT_NAME}: {text}")
        try:
            tm.add_turn(call_id, role, text)
        except Exception as exc:
            logger.error("add_turn failed: %s", exc)
        try:
            await ws.send_json(
                {
                    "type": "transcript",
                    "role": role,
                    "text": text,
                    "final": True,
                }
            )
        except Exception:
            pass

    try:
        async with _client.aio.live.connect(
            model=config.LIVE_MODEL,
            config=session_config,
        ) as session:
            logger.info("Gemini Live session opened for call %s", call_id)

            # ── Task: Forward browser mic audio → Gemini ────────────────
            async def forward_audio():
                try:
                    while True:
                        data = await ws.receive()

                        if data.get("type") == "websocket.disconnect":
                            break

                        if "bytes" in data and data["bytes"]:
                            await session.send_realtime_input(
                                audio=genai_types.Blob(
                                    data=data["bytes"],
                                    mime_type="audio/pcm",
                                )
                            )
                        elif "text" in data and data["text"]:
                            try:
                                msg = json.loads(data["text"])
                                if msg.get("action") == "end_call":
                                    break
                            except json.JSONDecodeError:
                                pass

                except WebSocketDisconnect:
                    pass
                except Exception as exc:
                    logger.error("forward_audio error: %s", exc)

            # ── Task: Forward Gemini responses → browser ────────────────
            async def receive_gemini():
                """
                Continuously receive messages from Gemini Live.

                `session.receive()` is a *per-turn* async iterator — it yields
                messages for the current model turn and then exhausts when it
                sees turn_complete. We loop so subsequent turns keep flowing.
                """
                should_stop = False
                try:
                    while not should_stop:
                        async for response in session.receive():
                            if hasattr(response, "setup_complete") and response.setup_complete:
                                logger.info(
                                    "Call %s: Gemini setup complete.", call_id
                                )
                                continue

                            if hasattr(response, "go_away") and response.go_away:
                                logger.warning(
                                    "Call %s: Gemini sent GoAway — ending.", call_id
                                )
                                should_stop = True
                                break

                            if response.data:
                                try:
                                    await ws.send_bytes(response.data)
                                except Exception:
                                    should_stop = True
                                    break

                            if hasattr(response, "server_content") and response.server_content:
                                sc = response.server_content

                                # Input transcription — accumulate caller words.
                                if hasattr(sc, "input_transcription") and sc.input_transcription:
                                    raw = (
                                        sc.input_transcription.text
                                        if hasattr(sc.input_transcription, "text")
                                        else str(sc.input_transcription)
                                    )
                                    if raw:
                                        pending["user"] += raw
                                        try:
                                            await ws.send_json(
                                                {
                                                    "type": "transcript",
                                                    "role": "user",
                                                    "text": pending["user"].strip(),
                                                    "final": False,
                                                }
                                            )
                                        except Exception:
                                            should_stop = True
                                            break

                                # Output transcription — accumulate Maya's words.
                                if hasattr(sc, "output_transcription") and sc.output_transcription:
                                    raw = (
                                        sc.output_transcription.text
                                        if hasattr(sc.output_transcription, "text")
                                        else str(sc.output_transcription)
                                    )
                                    if raw:
                                        # Flush any pending caller text — if the
                                        # agent started speaking, the caller's turn
                                        # is definitely over.
                                        if pending["user"].strip():
                                            await _flush_pending("user")
                                        pending["assistant"] += raw
                                        try:
                                            await ws.send_json(
                                                {
                                                    "type": "transcript",
                                                    "role": "assistant",
                                                    "text": pending["assistant"].strip(),
                                                    "final": False,
                                                }
                                            )
                                        except Exception:
                                            should_stop = True
                                            break

                                # Turn boundary — flush everything we've collected.
                                if sc.turn_complete:
                                    logger.debug("Call %s: Turn complete.", call_id)
                                    await _flush_pending("user")
                                    await _flush_pending("assistant")

                            if response.tool_call:
                                for fc in response.tool_call.function_calls:
                                    args = dict(fc.args) if fc.args else {}
                                    result = tool_registry.execute(fc.name, **args)
                                    tm.add_tool_call(call_id, fc.name, args, result)

                                    try:
                                        await ws.send_json(
                                            {
                                                "type": "tool_call",
                                                "tool": fc.name,
                                                "args": args,
                                                "result": result,
                                            }
                                        )
                                    except Exception:
                                        should_stop = True
                                        break

                                    try:
                                        await session.send(
                                            input=genai_types.LiveClientToolResponse(
                                                function_responses=[
                                                    genai_types.FunctionResponse(
                                                        id=fc.id,
                                                        name=fc.name,
                                                        response=result,
                                                    )
                                                ]
                                            )
                                        )
                                    except Exception as e:
                                        logger.error(
                                            "Failed to send tool response: %s", e
                                        )

                        if not should_stop:
                            logger.debug(
                                "Call %s: Turn iterator exhausted, re-entering.",
                                call_id,
                            )

                except Exception as exc:
                    logger.error("receive_gemini error: %s", exc)

            # Run both tasks concurrently.
            send_task = asyncio.create_task(forward_audio(), name="forward_audio")
            recv_task = asyncio.create_task(receive_gemini(), name="receive_gemini")

            done, pending = await asyncio.wait(
                [send_task, recv_task],
                return_when=asyncio.FIRST_COMPLETED,
            )

            for t in done:
                logger.info(
                    "Task %s finished first, ending call session.", t.get_name()
                )
                if t.exception():
                    logger.error(
                        "Task %s failed with: %s", t.get_name(), t.exception()
                    )

            for p in pending:
                p.cancel()

    except Exception as exc:
        logger.error("Session error: %s", exc, exc_info=True)
        try:
            await ws.send_json({"type": "error", "message": str(exc)})
        except Exception:
            pass
    finally:
        # Flush any buffered transcription that didn't get a final turn_complete
        # before the session closed.
        try:
            await _flush_pending("user")
            await _flush_pending("assistant")
        except Exception:
            pass

        topics = _infer_topics(conversation_history)
        try:
            tm.end_call(call_id, topics=topics)
        except Exception as exc:
            logger.error("end_call failed: %s", exc)
        try:
            await ws.send_json(
                {
                    "type": "call_ended",
                    "call_id": call_id,
                }
            )
        except Exception:
            pass

        logger.info("Call %s ended.", call_id)


def _infer_topics(history: list[str]) -> list[str]:
    keywords = {
        "seo": "SEO",
        "automation": "marketing automation",
        "pricing": "pricing",
        "cost": "pricing",
        "appointment": "appointment booking",
        "book": "appointment booking",
        "schedule": "appointment booking",
        "web": "web development",
        "content": "content strategy",
        "social": "social media",
        "lead": "lead generation",
        "email": "email marketing",
    }
    text = " ".join(history).lower()
    return sorted({label for kw, label in keywords.items() if kw in text})


# ─── Run with uvicorn ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    port = config.VOICE_WEB_PORT
    print(f"\n  DigiiMark Voice Agent — Web UI")
    print(f"  Open: http://localhost:{port}\n")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
