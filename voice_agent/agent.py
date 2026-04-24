"""
agent.py — Core voice agent loop using Gemini Live API.

Architecture (fully async):
  ┌─────────────────────────────────────────────────────┐
  │  asyncio event loop                                  │
  │                                                      │
  │  _mic_sender()   — PyAudio thread → asyncio.Queue   │
  │       ↓                                              │
  │  Gemini Live API session (bidirectional stream)      │
  │       ↓                                              │
  │  _receiver()     — async for response in session    │
  │       ↓                                              │
  │  _speaker_player() — asyncio.Queue → PyAudio thread  │
  └─────────────────────────────────────────────────────┘

Three concurrent asyncio tasks run inside a single Live session:
  1. mic_sender   — reads PCM from mic threads, sends to Gemini
  2. receiver     — processes responses (audio, text, tool calls)
  3. speaker      — drains play queue, writes to speaker thread

Two daemon threads handle blocking PyAudio I/O and push/pull
bytes via thread-safe asyncio.Queue bridges.
"""

from __future__ import annotations

import asyncio
import json
import logging
import threading
from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING

import pyaudio
import google.genai as genai
import google.genai.types as genai_types

import config
from transcript_manager import TranscriptManager
from rag.retriever import retrieve_context_for_turn
from tools import registry as tool_registry

if TYPE_CHECKING:
    from rag.indexer import VectorStore

logger = logging.getLogger(__name__)

# ─── Audio constants ──────────────────────────────────────────────────────────
SEND_SAMPLE_RATE = 16_000   # Hz — Gemini Live API requires 16kHz mic input
RECV_SAMPLE_RATE = 24_000   # Hz — Gemini Live API outputs 24kHz
AUDIO_FORMAT     = pyaudio.paInt16
CHANNELS         = 1
CHUNK            = 512      # frames per read (smaller = lower latency)

# ─── Gemini client (singleton) ────────────────────────────────────────────────
_client = genai.Client(
    api_key=config.GEMINI_API_KEY,
    http_options={"api_version": "v1beta"},
)


class DigiiMarkVoiceAgent:
    """
    Real-time voice agent powered by Gemini Live API.

    Usage:
        agent = DigiiMarkVoiceAgent(vector_store)
        agent.run()   # blocks until Ctrl+C
    """

    def __init__(self, vector_store: "VectorStore") -> None:
        self._store = vector_store
        self._tm = TranscriptManager()
        self._call_id: Optional[str] = None
        self._history: List[str] = []          # running conversation text
        self._pa = pyaudio.PyAudio()

        # Thread-safe queues bridging PyAudio threads ↔ asyncio loop
        self._mic_queue: asyncio.Queue[bytes | None] = asyncio.Queue()
        self._play_queue: asyncio.Queue[bytes | None] = asyncio.Queue()

        self._stop_event = threading.Event()

    # ── System prompt ──────────────────────────────────────────────────────

    def _build_system_prompt(self) -> str:
        rag_ctx = retrieve_context_for_turn(self._history, self._store)
        return config.SYSTEM_PROMPT_TEMPLATE.format(
            agent_name=config.AGENT_NAME,
            rag_context=rag_ctx or "(Knowledge base empty — answer from general knowledge.)",
        )

    # ── Gemini session config ──────────────────────────────────────────────

    def _session_config(self) -> genai_types.LiveConnectConfig:
        return genai_types.LiveConnectConfig(
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
                parts=[genai_types.Part(text=self._build_system_prompt())]
            ),
            tools=tool_registry.gemini_tools_config(),
        )

    # ── PyAudio mic thread (blocking → queue) ─────────────────────────────

    def _mic_thread(self, loop: asyncio.AbstractEventLoop) -> None:
        """Open microphone and push PCM frames into mic_queue via the loop."""
        stream = self._pa.open(
            format=AUDIO_FORMAT,
            channels=CHANNELS,
            rate=SEND_SAMPLE_RATE,
            input=True,
            input_device_index=config.INPUT_DEVICE_INDEX,
            frames_per_buffer=CHUNK,
        )
        logger.debug("🎤 Mic stream open.")
        try:
            while not self._stop_event.is_set():
                data = stream.read(CHUNK, exception_on_overflow=False)
                asyncio.run_coroutine_threadsafe(
                    self._mic_queue.put(data), loop
                )
        finally:
            stream.stop_stream()
            stream.close()
            asyncio.run_coroutine_threadsafe(
                self._mic_queue.put(None), loop  # sentinel
            )
            logger.debug("🎤 Mic stream closed.")

    # ── PyAudio speaker thread (queue → blocking write) ───────────────────

    def _speaker_thread(self, loop: asyncio.AbstractEventLoop) -> None:
        """Read PCM frames from play_queue and write to speaker."""
        stream = self._pa.open(
            format=AUDIO_FORMAT,
            channels=CHANNELS,
            rate=RECV_SAMPLE_RATE,
            output=True,
            output_device_index=config.OUTPUT_DEVICE_INDEX,
            frames_per_buffer=CHUNK,
        )
        logger.debug("🔊 Speaker stream open.")
        try:
            while not self._stop_event.is_set():
                future = asyncio.run_coroutine_threadsafe(
                    self._play_queue.get(), loop
                )
                data = future.result(timeout=1.0)
                if data is None:  # sentinel — stop
                    break
                stream.write(data)
        except Exception as exc:
            if not self._stop_event.is_set():
                logger.error("Speaker error: %s", exc)
        finally:
            stream.stop_stream()
            stream.close()
            logger.debug("🔊 Speaker stream closed.")

    # ── Async tasks ────────────────────────────────────────────────────────

    async def _task_send_audio(self, session) -> None:
        """Drain mic_queue and stream PCM audio to Gemini."""
        while True:
            data = await self._mic_queue.get()
            if data is None:
                break
            await session.send_realtime_input(
                audio=genai_types.Blob(data=data, mime_type="audio/pcm")
            )

    async def _task_receive(self, session) -> None:
        """Process all responses from Gemini — audio, text, tool calls."""
        from rich.console import Console
        console = Console()

        async for response in session.receive():

            # ── Audio output ───────────────────────────────────────────────
            if response.data:
                await self._play_queue.put(response.data)

            # ── Text transcript from agent ─────────────────────────────────
            if response.text:
                text = response.text.strip()
                if text:
                    self._history.append(f"{config.AGENT_NAME}: {text}") 
                    if self._call_id:
                        self._tm.add_turn(self._call_id, "assistant", text)
                    console.print(f"[cyan]{config.AGENT_NAME}:[/cyan] {text}")

            # ── User speech transcript (server-side VAD) ───────────────────
            if hasattr(response, "server_content") and response.server_content:
                sc = response.server_content

                # Input transcription (what the user said)
                if hasattr(sc, "input_transcription") and sc.input_transcription:
                    user_text = sc.input_transcription.text.strip() if hasattr(sc.input_transcription, 'text') else str(sc.input_transcription).strip()
                    if user_text:
                        self._history.append(f"Caller: {user_text}")
                        if self._call_id:
                            self._tm.add_turn(self._call_id, "user", user_text)
                        console.print(f"[white]  You:[/white] {user_text}")

            # ── Function / tool calls ──────────────────────────────────────
            if response.tool_call:
                await self._handle_tool_call(session, response.tool_call)

            # ── Server closing the session ─────────────────────────────────
            if hasattr(response, "go_away") and response.go_away:
                logger.info("Server sent go_away — closing session.")
                break

            # ── Turn complete signal ───────────────────────────────────────
            if hasattr(response, "server_content") and response.server_content:
                if getattr(response.server_content, "turn_complete", False):
                    logger.debug("Turn complete.")

    async def _handle_tool_call(self, session, tool_call) -> None:
        """Execute tool(s) and send response(s) back to Gemini."""
        responses = []
        for fc in tool_call.function_calls:
            args = dict(fc.args) if fc.args else {}
            logger.info("🔧 Tool: %s | args: %s", fc.name, args)

            # Run sync tool in the default executor so it doesn't block the loop
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, lambda: tool_registry.execute(fc.name, **args)
            )

            if self._call_id:
                self._tm.add_tool_call(self._call_id, fc.name, args, result)

            responses.append(
                genai_types.FunctionResponse(
                    id=fc.id,
                    name=fc.name,
                    response=result,
                )
            )

        await session.send(
            input=genai_types.LiveClientToolResponse(function_responses=responses)
        )

    # ── Main async call ────────────────────────────────────────────────────

    async def _run_async(self) -> None:
        from rich.console import Console
        from rich.panel import Panel
        console = Console()

        self._call_id = self._tm.start_call()
        loop = asyncio.get_event_loop()

        console.print(
            Panel(
                f"[bold green]DigiiMark Voice Agent[/bold green]\n"
                f"  Agent : [cyan]{config.AGENT_NAME}[/cyan]  |  "
                f"Voice : [yellow]{config.AGENT_VOICE}[/yellow]\n"
                f"  Model : [dim]{config.LIVE_MODEL}[/dim]\n"
                f"  Tools : [magenta]{', '.join(tool_registry.list_tools())}[/magenta]\n\n"
                f"[dim]Speak into the microphone. "
                f"Press [bold]Ctrl+C[/bold] to end the call.[/dim]",
                title="📞 Call Started",
                border_style="green",
            )
        )

        # Start PyAudio threads (blocking I/O outside the event loop)
        self._stop_event.clear()
        mic_t = threading.Thread(target=self._mic_thread, args=(loop,), daemon=True)
        spk_t = threading.Thread(target=self._speaker_thread, args=(loop,), daemon=True)
        mic_t.start()
        spk_t.start()

        try:
            async with _client.aio.live.connect(
    model=config.LIVE_MODEL,
    config=self._session_config(),
) as session:
    console.print("[green]✓ Connected to Gemini Live. Start speaking![/green]\n")

    # ✅ PATCH 1 — Maya greets the caller first (ADD THESE 4 LINES)
    opening = config.OPENING_TRIGGER.format(agent_name=config.AGENT_NAME)
    await session.send(input=opening, end_of_turn=True)

    # Run sender + receiver concurrently
    send_task = asyncio.create_task(self._task_send_audio(session))
                recv_task = asyncio.create_task(self._task_receive(session))

                # Wait for either to complete (receiver ends when session closes)
                done, pending = await asyncio.wait(
                    [send_task, recv_task],
                    return_when=asyncio.FIRST_COMPLETED,
                )
                for task in pending:
                    task.cancel()

        except asyncio.CancelledError:
            pass
        except Exception as exc:
            logger.error("Agent session error: %s", exc, exc_info=True)
            console.print(f"[red]Session error: {exc}[/red]")
        finally:
            # Signal threads to stop
            self._stop_event.set()
            await self._play_queue.put(None)   # unblock speaker thread
            await self._mic_queue.put(None)    # unblock sender task

            mic_t.join(timeout=2)
            spk_t.join(timeout=2)

            self._end_call()

    # ── Public entry point ─────────────────────────────────────────────────

    def run(self) -> None:
        """Start the voice agent. Blocks until the call ends (Ctrl+C or session close)."""
        try:
            asyncio.run(self._run_async())
        except KeyboardInterrupt:
            from rich.console import Console
            Console().print("\n[yellow]↩  Call ended.[/yellow]")

    # ── Post-call cleanup ──────────────────────────────────────────────────

    def _end_call(self) -> None:
        from rich.console import Console
        console = Console()

        if self._call_id:
            topics = self._infer_topics(self._history)
            path = self._tm.end_call(self._call_id, topics=topics)
            if path:
                console.print(f"\n[green]✅ Transcript saved:[/green] [dim]{path}[/dim]")
            self._call_id = None

        try:
            self._pa.terminate()
        except Exception:
            pass

    @staticmethod
    def _infer_topics(history: List[str]) -> List[str]:
        keywords = {
            "seo": "SEO",
            "automation": "marketing automation",
            "pricing": "pricing",
            "cost": "pricing",
            "price": "pricing",
            "appointment": "appointment booking",
            "book": "appointment booking",
            "schedule": "appointment booking",
            "call": "appointment booking",
            "web": "web development",
            "content": "content strategy",
            "social": "social media",
            "lead": "lead generation",
            "email": "email marketing",
            "crm": "CRM",
            "growth": "growth systems",
        }
        text = " ".join(history).lower()
        return sorted({label for kw, label in keywords.items() if kw in text})
