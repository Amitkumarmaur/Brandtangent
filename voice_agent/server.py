"""
server.py — FastAPI WebSocket server for the DigiiMark Voice Agent web UI.

Architecture:
  Browser (mic audio via Web Audio API)
    → WebSocket (binary PCM frames)
      → FastAPI server
        → Gemini Live API (async bidirectional stream)
          → Audio response
        → WebSocket (binary audio + JSON transcript)
      → Browser (plays audio + shows transcript)

Run:
    cd voice_agent
    venv\\Scripts\\activate
    python server.py
    # Open http://localhost:8001 (or VOICE_WEB_PORT) in your browser
"""

from __future__ import annotations

import asyncio
import json
import logging
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Response
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import google.genai as genai
import google.genai.types as genai_types

# ─── Bootstrap ────────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
import config
from transcript_manager import TranscriptManager
from rag.indexer import build_vector_store, start_watcher
from rag.retriever import retrieve_context_for_turn
from tools import registry as tool_registry

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

# ─── Build vector store + start watcher ───────────────────────────────────────
logger.info("Building knowledge base vector store...")
vector_store = build_vector_store()
watcher = start_watcher(vector_store)
logger.info("Vector store ready: %d chunks indexed.", vector_store.total_chunks)

# ─── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(title="DigiiMark Voice Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WEB_DIR = Path(__file__).parent / "web"
WEB_DIR.mkdir(exist_ok=True)

# Serve static files from /static
(WEB_DIR / "static").mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(WEB_DIR / "static")), name="static")


@app.get("/favicon.ico", include_in_schema=False)
async def serve_favicon():
    """Silence favicon 404s."""
    return Response(status_code=204)


@app.get("/")
async def serve_index():
    """Serve the web UI."""
    index_path = WEB_DIR / "index.html"
    if index_path.exists():
        return HTMLResponse(index_path.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>Web UI not found. Place index.html in voice_agent/web/</h1>")


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "agent": config.AGENT_NAME,
        "voice": config.AGENT_VOICE,
        "model": config.LIVE_MODEL,
        "knowledge_chunks": vector_store.total_chunks,
        "tools": tool_registry.list_tools(),
    }


@app.get("/api/calls")
async def list_calls():
    """Return the calls log."""
    return TranscriptManager.load_calls_log()


@app.get("/api/calls/{call_id}")
async def get_call(call_id: str):
    """Return a specific call record."""
    entry = TranscriptManager.find_call(call_id)
    if not entry:
        return {"error": "Call not found"}

    transcript_path = Path(entry.get("transcript_file", ""))
    transcript_content = ""
    if transcript_path.exists():
        transcript_content = transcript_path.read_text(encoding="utf-8")

    return {**entry, "transcript_content": transcript_content}


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
            {"type": "call_ended", "call_id": "...", "transcript_file": "..."}
    """
    await ws.accept()
    logger.info("WebSocket connected.")

    tm = TranscriptManager()
    call_id = tm.start_call()
    conversation_history: list[str] = []

    await ws.send_json({"type": "call_started", "call_id": call_id})
    await ws.send_json({"type": "status", "message": f"Connected to {config.AGENT_NAME}. Start speaking!"})

    # Build system prompt with RAG context
    def build_prompt():
        rag_ctx = retrieve_context_for_turn(conversation_history, vector_store)
        return config.SYSTEM_PROMPT_TEMPLATE.format(
            agent_name=config.AGENT_NAME,
            rag_context=rag_ctx or "(Knowledge base empty.)",
        )

    session_config = genai_types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        input_audio_transcription=genai_types.AudioTranscriptionConfig(),
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

    try:
        async with _client.aio.live.connect(
            model=config.LIVE_MODEL,
            config=session_config,
        ) as session:
            logger.info("Gemini Live session opened for call %s", call_id)

            # ── Task: Forward browser mic audio → Gemini ──────────────────
            async def forward_audio():
                try:
                    while True:
                        data = await ws.receive()

                        if data.get("type") == "websocket.disconnect":
                            break

                        # Binary = audio
                        if "bytes" in data and data["bytes"]:
                            await session.send_realtime_input(
                                audio=genai_types.Blob(
                                    data=data["bytes"],
                                    mime_type="audio/pcm",
                                )
                            )

                        # Text = control messages
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

            # ── Task: Forward Gemini responses → browser ──────────────────
            async def receive_gemini():
                """
                Continuously receive messages from Gemini Live.

                IMPORTANT: session.receive() is a *per-turn* async iterator.
                It yields messages for the current model turn and then
                exhausts when it sees turn_complete. We must re-enter the
                iterator in a while-loop to keep listening for subsequent
                turns (i.e. the next time the user speaks and the model
                responds).
                """
                should_stop = False
                try:
                    while not should_stop:
                        async for response in session.receive():
                            # ── Setup complete ──
                            if hasattr(response, "setup_complete") and response.setup_complete:
                                logger.info("Call %s: Gemini setup complete.", call_id)
                                continue

                            # ── GoAway — server is shutting us down ──
                            if hasattr(response, "go_away") and response.go_away:
                                logger.warning("Call %s: Gemini sent GoAway — ending.", call_id)
                                should_stop = True
                                break

                            # ── Audio data → browser ──
                            if response.data:
                                try:
                                    await ws.send_bytes(response.data)
                                except Exception:
                                    should_stop = True
                                    break

                            # ── Agent text ──
                            if response.text:
                                text = response.text.strip()
                                if text:
                                    conversation_history.append(text)
                                    tm.add_turn(call_id, "assistant", text)
                                    try:
                                        await ws.send_json({
                                            "type": "transcript",
                                            "role": "assistant",
                                            "text": text,
                                        })
                                    except Exception:
                                        should_stop = True
                                        break

                            # ── User transcript (server-side VAD) ──
                            if hasattr(response, "server_content") and response.server_content:
                                sc = response.server_content
                                # Turn complete is normal — just log it
                                if sc.turn_complete:
                                    logger.debug("Call %s: Turn complete.", call_id)
                                if hasattr(sc, "input_transcription") and sc.input_transcription:
                                    user_text = (
                                        sc.input_transcription.text.strip()
                                        if hasattr(sc.input_transcription, "text")
                                        else str(sc.input_transcription).strip()
                                    )
                                    if user_text:
                                        conversation_history.append(user_text)
                                        tm.add_turn(call_id, "user", user_text)
                                        try:
                                            await ws.send_json({
                                                "type": "transcript",
                                                "role": "user",
                                                "text": user_text,
                                            })
                                        except Exception:
                                            should_stop = True
                                            break

                            # ── Tool calls ──
                            if response.tool_call:
                                for fc in response.tool_call.function_calls:
                                    args = dict(fc.args) if fc.args else {}
                                    result = tool_registry.execute(fc.name, **args)
                                    tm.add_tool_call(call_id, fc.name, args, result)

                                    try:
                                        await ws.send_json({
                                            "type": "tool_call",
                                            "tool": fc.name,
                                            "args": args,
                                            "result": result,
                                        })
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
                                        logger.error("Failed to send tool response: %s", e)

                        # session.receive() iterator exhausted (turn ended).
                        # Loop back to wait for the next turn.
                        if not should_stop:
                            logger.debug("Call %s: Turn iterator exhausted, re-entering receive loop.", call_id)

                except Exception as exc:
                    logger.error("receive_gemini error: %s", exc)

            # Run both tasks concurrently
            send_task = asyncio.create_task(forward_audio(), name="forward_audio")
            recv_task = asyncio.create_task(receive_gemini(), name="receive_gemini")
            
            done, pending = await asyncio.wait(
                [send_task, recv_task],
                return_when=asyncio.FIRST_COMPLETED,
            )
            
            # Diagnostic: which task finished?
            for t in done:
                logger.info("Task %s finished first, ending call session.", t.get_name())
                if t.exception():
                    logger.error("Task %s failed with: %s", t.get_name(), t.exception())

            for p in pending:
                p.cancel()

    except Exception as exc:
        logger.error("Session error: %s", exc, exc_info=True)
        try:
            await ws.send_json({"type": "error", "message": str(exc)})
        except Exception:
            pass
    finally:
        # Save transcript
        topics = _infer_topics(conversation_history)
        path = tm.end_call(call_id, topics=topics)
        try:
            await ws.send_json({
                "type": "call_ended",
                "call_id": call_id,
                "transcript_file": str(path) if path else None,
            })
        except Exception:
            pass

        logger.info("Call %s ended. Transcript: %s", call_id, path)


def _infer_topics(history: list[str]) -> list[str]:
    keywords = {
        "seo": "SEO", "automation": "marketing automation",
        "pricing": "pricing", "cost": "pricing",
        "appointment": "appointment booking", "book": "appointment booking",
        "schedule": "appointment booking", "web": "web development",
        "content": "content strategy", "social": "social media",
        "lead": "lead generation", "email": "email marketing",
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
