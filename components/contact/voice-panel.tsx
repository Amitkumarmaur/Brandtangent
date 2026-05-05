"use client"

/**
 * components/contact/voice-panel.tsx
 *
 * Native React voice client for the contact widget. Opens its own WebSocket
 * to the deployed voice agent (NEXT_PUBLIC_VOICE_AGENT_URL → /ws/voice),
 * captures the mic at 16 kHz via an AudioWorklet, plays Gemini's 24 kHz PCM
 * response back to the user, and renders a sleek UI with:
 *
 *   - Maya's portrait + breathing halo (color shifts to orange while she
 *     speaks, blue while you speak)
 *   - A single-line live caption (no admin transcript dump)
 *   - Elegant tool-call cards that fade in/out
 *   - A big start button in idle, a discreet end button while live
 */

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Mic,
  PhoneOff,
  Search,
  Sparkles,
} from "lucide-react"

const VOICE_URL =
  process.env.NEXT_PUBLIC_VOICE_AGENT_URL?.replace(/\/$/, "") || ""

type VoiceState = "idle" | "connecting" | "live" | "ended"

type Caption = { role: "user" | "assistant"; text: string } | null
type ToolCall = {
  id: number
  tool: string
  result?: { message?: string; [k: string]: unknown }
}

const TOOL_LABELS: Record<string, { label: string; icon: typeof Mic }> = {
  find_service: { label: "Looking up services", icon: Search },
  find_case_study: { label: "Pulling case studies", icon: Sparkles },
  find_faq: { label: "Checking the playbook", icon: Search },
  book_appointment_tool: { label: "Booking your call", icon: Calendar },
  lead_capture_tool: { label: "Saving your details", icon: Mail },
}

function describeTool(name: string) {
  return TOOL_LABELS[name] ?? { label: name.replace(/_/g, " "), icon: Sparkles }
}

function wsUrlFor(httpUrl: string): string {
  if (!httpUrl) return ""
  return httpUrl.replace(/^http/, "ws") + "/ws/voice"
}

export function VoicePanel() {
  const [state, setState] = useState<VoiceState>("idle")
  const [caption, setCaption] = useState<Caption>(null)
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [error, setError] = useState<string | null>(null)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [isMayaSpeaking, setIsMayaSpeaking] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const playCtxRef = useRef<AudioContext | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const workletRef = useRef<AudioWorkletNode | null>(null)
  const playQueueRef = useRef<ArrayBuffer[]>([])
  const isPlayingRef = useRef(false)
  const lastAudioAtRef = useRef<number>(0)
  const speakingTimerRef = useRef<number | null>(null)
  const callStartRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)
  const toolCallSeqRef = useRef(0)

  /**
   * Heuristic for the breathing halo: if we received any audio chunk in the
   * last 250ms, treat Maya as actively speaking (warm halo). Otherwise we
   * fall back to "listening" (cool halo).
   */
  useEffect(() => {
    if (state !== "live") {
      setIsMayaSpeaking(false)
      return
    }
    const tick = window.setInterval(() => {
      setIsMayaSpeaking(Date.now() - lastAudioAtRef.current < 250)
    }, 80)
    speakingTimerRef.current = tick
    return () => window.clearInterval(tick)
  }, [state])

  // Call timer.
  useEffect(() => {
    if (state !== "live") {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      return
    }
    callStartRef.current = Date.now()
    setElapsedSec(0)
    const id = window.setInterval(() => {
      if (callStartRef.current) {
        setElapsedSec(Math.floor((Date.now() - callStartRef.current) / 1000))
      }
    }, 500)
    timerIntervalRef.current = id
    return () => window.clearInterval(id)
  }, [state])

  /**
   * Drain the queued 24 kHz PCM chunks from Gemini through the playback
   * AudioContext so Maya's voice plays serially without overlapping.
   */
  const drainPlayQueue = useCallback(async () => {
    if (isPlayingRef.current) return
    const ctx = playCtxRef.current
    if (!ctx) return
    isPlayingRef.current = true
    try {
      while (playQueueRef.current.length > 0) {
        const chunk = playQueueRef.current.shift()!
        const int16 = new Int16Array(chunk)
        const float32 = new Float32Array(int16.length)
        for (let i = 0; i < int16.length; i++) {
          float32[i] = int16[i] / 0x8000
        }
        const buffer = ctx.createBuffer(1, float32.length, 24000)
        buffer.copyToChannel(float32, 0)
        await new Promise<void>((resolve) => {
          const source = ctx.createBufferSource()
          source.buffer = buffer
          source.connect(ctx.destination)
          source.onended = () => resolve()
          source.start()
        })
      }
    } finally {
      isPlayingRef.current = false
    }
  }, [])

  const teardown = useCallback(() => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "control", action: "end_call" }))
      }
    } catch {
      /* best effort */
    }
    try {
      wsRef.current?.close()
    } catch {
      /* noop */
    }
    wsRef.current = null

    micStreamRef.current?.getTracks().forEach((t) => t.stop())
    micStreamRef.current = null

    workletRef.current?.disconnect()
    workletRef.current = null

    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null

    playCtxRef.current?.close().catch(() => {})
    playCtxRef.current = null

    playQueueRef.current = []
    isPlayingRef.current = false
    if (speakingTimerRef.current) {
      window.clearInterval(speakingTimerRef.current)
      speakingTimerRef.current = null
    }
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => teardown()
  }, [teardown])

  const startCall = useCallback(async () => {
    if (!VOICE_URL) {
      setError("Voice agent URL not configured.")
      return
    }
    setError(null)
    setCaption(null)
    setToolCalls([])
    setState("connecting")

    try {
      // Request mic — must be inside a user gesture for autoplay policy.
      const mic = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      micStreamRef.current = mic

      const audioCtx = new AudioContext({ sampleRate: 16000 })
      audioCtxRef.current = audioCtx
      const playCtx = new AudioContext({ sampleRate: 24000 })
      playCtxRef.current = playCtx
      // Resume both contexts — Chrome leaves them suspended until a gesture
      // unlocks them.
      await audioCtx.resume().catch(() => {})
      await playCtx.resume().catch(() => {})

      await audioCtx.audioWorklet.addModule("/voice/audio-processor.js")
      const worklet = new AudioWorkletNode(audioCtx, "pcm-processor")
      workletRef.current = worklet
      const source = audioCtx.createMediaStreamSource(mic)
      source.connect(worklet)
      // Connect to destination with zero gain to keep the worklet alive
      // without feeding mic into the speakers.
      const sink = audioCtx.createGain()
      sink.gain.value = 0
      worklet.connect(sink).connect(audioCtx.destination)

      worklet.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
        const ws = wsRef.current
        if (!ws || ws.readyState !== WebSocket.OPEN) return
        ws.send(event.data)
      }

      const ws = new WebSocket(wsUrlFor(VOICE_URL))
      ws.binaryType = "arraybuffer"
      wsRef.current = ws

      ws.onopen = () => {
        setState("live")
      }

      ws.onmessage = (event: MessageEvent) => {
        if (event.data instanceof ArrayBuffer) {
          lastAudioAtRef.current = Date.now()
          playQueueRef.current.push(event.data)
          void drainPlayQueue()
          return
        }
        try {
          const msg = JSON.parse(event.data as string)
          if (msg.type === "transcript" && msg.text) {
            setCaption({ role: msg.role, text: msg.text })
          } else if (msg.type === "tool_call") {
            const id = ++toolCallSeqRef.current
            const card: ToolCall = {
              id,
              tool: msg.tool,
              result: msg.result,
            }
            setToolCalls((prev) => [...prev.slice(-1), card])
            // Auto-clear after 6s so the screen stays calm.
            window.setTimeout(() => {
              setToolCalls((prev) => prev.filter((c) => c.id !== id))
            }, 6000)
          } else if (msg.type === "error") {
            setError(msg.message || "Something went wrong.")
          } else if (msg.type === "call_ended") {
            setState("ended")
          }
        } catch {
          /* ignore non-JSON */
        }
      }

      ws.onerror = () => {
        setError("Couldn't reach the voice agent. Try again.")
        setState("idle")
        teardown()
      }

      ws.onclose = () => {
        if (state === "live") {
          setState("ended")
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start the call."
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError("Microphone permission was denied.")
      } else {
        setError(msg)
      }
      setState("idle")
      teardown()
    }
  }, [drainPlayQueue, state, teardown])

  const endCall = useCallback(() => {
    setState("ended")
    teardown()
  }, [teardown])

  const restart = useCallback(() => {
    setCaption(null)
    setToolCalls([])
    setError(null)
    setState("idle")
  }, [])

  if (!VOICE_URL) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-10 h-full bg-white">
        <div className="w-12 h-12 rounded-full bg-grey-100 text-grey-400 flex items-center justify-center">
          <Mic className="w-6 h-6" />
        </div>
        <p className="font-heading text-base font-semibold text-foreground">
          Voice agent not configured
        </p>
        <p className="text-sm text-grey-400 leading-relaxed max-w-xs">
          Set <code className="font-mono text-xs">NEXT_PUBLIC_VOICE_AGENT_URL</code>{" "}
          in your environment to enable Maya in this widget.
        </p>
      </div>
    )
  }

  const haloClass = (() => {
    if (state === "live" && isMayaSpeaking) {
      return "ring-ignite-orange/70 ring-[6px] scale-[1.02] shadow-[0_0_48px_rgba(255,87,34,0.45)]"
    }
    if (state === "live") {
      return "ring-blue-400/60 ring-[5px] shadow-[0_0_36px_rgba(96,165,250,0.4)]"
    }
    if (state === "connecting") {
      return "ring-grey-300 ring-[4px] animate-pulse"
    }
    return "ring-ignite-orange/30 ring-[3px]"
  })()

  const mm = String(Math.floor(elapsedSec / 60)).padStart(2, "0")
  const ss = String(elapsedSec % 60).padStart(2, "0")

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-white via-white to-grey-100 overflow-hidden">
      {/* Soft background bloom that brightens while Maya is speaking */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-2/3 transition-opacity duration-700 ${
          isMayaSpeaking ? "opacity-100" : "opacity-40"
        }`}
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 25%, rgba(255,210,184,0.55), transparent 70%)",
        }}
      />

      <div className="relative flex-1 min-h-0 flex flex-col items-center px-5 pt-6 pb-3">
        {/* Portrait + halo */}
        <div className="relative">
          <div
            className={`relative w-32 h-32 rounded-full overflow-hidden bg-grey-100 ring-offset-2 ring-offset-white transition-all duration-300 ${haloClass}`}
          >
            <Image
              src="/images/maya.png"
              alt="Maya — DigiiMark voice consultant"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>
          {state === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white drop-shadow-md animate-spin" />
            </div>
          )}
        </div>

        <p className="mt-4 font-heading text-base font-semibold text-foreground">
          Maya
        </p>
        <p className="text-xs text-grey-400">DigiiMark voice consultant</p>

        {/* Live caption */}
        <div className="mt-5 w-full max-w-[18rem] min-h-[3.5rem] flex items-start justify-center">
          {caption ? (
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider font-medium text-grey-400 mb-1">
                {caption.role === "user" ? "You" : "Maya"}
              </p>
              <p
                className="text-sm text-grey-600 leading-relaxed line-clamp-3"
                aria-live="polite"
              >
                {caption.text}
              </p>
            </div>
          ) : state === "idle" ? (
            <p className="text-sm text-grey-400 text-center leading-relaxed">
              A 60-second chat with our AI consultant. Ask about services,
              pricing, anything.
            </p>
          ) : state === "connecting" ? (
            <p className="text-sm text-grey-400 text-center">
              Connecting to Maya…
            </p>
          ) : state === "ended" ? (
            <p className="text-sm text-grey-600 text-center font-medium">
              Thanks for chatting.
            </p>
          ) : (
            <p className="text-sm text-grey-400 text-center italic">
              Listening…
            </p>
          )}
        </div>

        {/* Tool call cards */}
        <div className="mt-3 w-full max-w-[18rem] space-y-2">
          {toolCalls.map((tc) => {
            const meta = describeTool(tc.tool)
            const Icon = meta.icon
            const summary =
              tc.result && typeof tc.result.message === "string"
                ? (tc.result.message as string)
                : null
            return (
              <div
                key={tc.id}
                className="flex items-start gap-2 rounded-xl border border-grey-200 bg-white/90 backdrop-blur px-3 py-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <span className="shrink-0 w-7 h-7 rounded-lg bg-peach-light text-ignite-orange flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {meta.label}
                  </p>
                  {summary && (
                    <p className="text-[11px] text-grey-400 leading-snug line-clamp-2">
                      {summary}
                    </p>
                  )}
                </div>
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer / controls */}
      <div className="relative shrink-0 border-t border-grey-200 bg-white/80 backdrop-blur px-4 py-3">
        {error && (
          <p
            role="alert"
            className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1 text-center"
          >
            {error}
          </p>
        )}

        {state === "idle" && (
          <button
            type="button"
            onClick={() => void startCall()}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-ignite-orange text-white text-sm font-semibold hover:bg-ignite-orange/90 transition-colors shadow-[0_4px_14px_rgba(255,87,34,0.25)]"
          >
            <Mic className="w-4 h-4" />
            Start conversation
          </button>
        )}

        {state === "connecting" && (
          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-grey-200 text-grey-400 text-sm font-semibold"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting…
          </button>
        )}

        {state === "live" && (
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 h-11 rounded-xl bg-grey-100 text-grey-600 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono">{mm}:{ss}</span>
              <span className="text-xs text-grey-400 ml-auto">In call</span>
            </div>
            <button
              type="button"
              onClick={endCall}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              aria-label="End call"
            >
              <PhoneOff className="w-4 h-4" />
              End
            </button>
          </div>
        )}

        {state === "ended" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={restart}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-ignite-orange text-white text-sm font-semibold hover:bg-ignite-orange/90 transition-colors"
            >
              <Mic className="w-4 h-4" />
              Talk again
            </button>
          </div>
        )}

        <a
          href={VOICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1 text-[10px] text-grey-400 hover:text-grey-600 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open admin console
        </a>
      </div>
    </div>
  )
}
