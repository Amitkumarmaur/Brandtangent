"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Loader2, RefreshCw, Send } from "lucide-react"

const API_PREFIX = "/api/chat-agent"

type ChatMessage = { role: "user" | "assistant"; content: string }

type ChatMessageResponse = {
  session_id: string
  reply: string
  tools_used?: string[]
}

/**
 * Witty rotating phrases shown while Alex is generating a reply.
 * Tone matches the persona: warm, dry, human — never chirpy, never robotic.
 */
const THINKING_PHRASES = [
  "Thinking it over\u2026",
  "One sec\u2026",
  "Checking the playbook\u2026",
  "Pulling that up\u2026",
  "Cooking\u2026",
  "Hmm, let me see\u2026",
  "Hang on\u2026",
  "Reading the room\u2026",
  "Working on it\u2026",
  "Just a moment\u2026",
] as const

/**
 * Randomised welcome lines shown as the very first assistant message when the
 * chat panel opens. Short, in character, no second introduction needed once
 * the user replies (the system prompt handles the rest).
 */
const WELCOME_LINES = [
  "Hey \u2014 Alex from DigiiMark. What's on your mind?",
  "Hi! Alex here from DigiiMark. How can I help today?",
  "Hey there. Alex from DigiiMark \u2014 what brings you in?",
  "Hi, Alex from DigiiMark. Ask me anything about what we do.",
  "Hey \u2014 Alex here. Marketing automation, SEO, web build \u2014 what's the question?",
] as const

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function ChatPanel() {
  const [ready, setReady] = useState<boolean | null>(null)
  const welcomeLine = useMemo(() => pickRandom(WELCOME_LINES), [])
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: "assistant", content: welcomeLine },
  ])
  const [input, setInput] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [thinkingPhrase, setThinkingPhrase] = useState<string>(THINKING_PHRASES[0])
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(input)
  inputRef.current = input

  const pingHealth = useCallback(() => {
    fetch(`${API_PREFIX}/health`, { cache: "no-store" })
      .then((r) => setReady(r.ok))
      .catch(() => setReady(false))
  }, [])

  useEffect(() => {
    pingHealth()
  }, [pingHealth])

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  /**
   * While Alex is generating, rotate the loader phrase every ~1.8s so the
   * widget feels alive instead of locked-up. The first phrase is picked at
   * random so the same word doesn't always appear first.
   */
  useEffect(() => {
    if (!sending) return
    setThinkingPhrase(pickRandom(THINKING_PHRASES))
    const interval = window.setInterval(() => {
      setThinkingPhrase((current) => {
        let next = current
        // Pick a different phrase than the one currently shown.
        while (next === current && THINKING_PHRASES.length > 1) {
          next = pickRandom(THINKING_PHRASES)
        }
        return next
      })
    }, 1800)
    return () => window.clearInterval(interval)
  }, [sending])

  const endSessionRemote = useCallback(async (sid: string | null) => {
    if (!sid) return
    try {
      await fetch(
        `${API_PREFIX}/v1/chat/session/${encodeURIComponent(sid)}/end`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outcome: "completed" }),
        }
      )
    } catch {
      /* best-effort */
    }
  }, [])

  const startNewConversation = useCallback(async () => {
    await endSessionRemote(sessionId)
    setSessionId(null)
    setMessages([{ role: "assistant", content: pickRandom(WELCOME_LINES) }])
  }, [endSessionRemote, sessionId])

  const send = useCallback(async () => {
    const text = inputRef.current.trim()
    if (!text || sending) return
    setInput("")
    setMessages((m) => [...m, { role: "user", content: text }])
    setSending(true)
    try {
      const res = await fetch(`${API_PREFIX}/v1/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionId ?? undefined,
        }),
      })
      const raw = await res.text()
      let data: ChatMessageResponse & { error?: string; detail?: unknown }
      try {
        data = JSON.parse(raw) as typeof data
      } catch {
        throw new Error(raw.slice(0, 200) || `Request failed (${res.status})`)
      }
      if (!res.ok) {
        const d = data.detail
        const msg =
          typeof d === "string"
            ? d
            : Array.isArray(d)
              ? d.map((x: unknown) => JSON.stringify(x)).join("; ")
              : data.error ?? `Request failed (${res.status})`
        throw new Error(msg)
      }
      setSessionId(data.session_id)
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "" },
      ])
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong."
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            ready === false
              ? "Live chat is offline right now. Try the form on the previous screen, or email hello@digiimark.com."
              : msg,
        },
      ])
    } finally {
      setSending(false)
    }
  }, [sending, sessionId, ready])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-grey-200 bg-white">
        <p className="text-xs text-grey-400">
          {ready === null ? "Checking…" : ready ? "Online" : "Offline"}
        </p>
        <button
          type="button"
          onClick={() => void startNewConversation()}
          className="inline-flex items-center gap-1 text-xs font-medium text-grey-600 hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          New chat
        </button>
      </div>

      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 bg-white"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[90%] rounded-2xl rounded-br-md bg-ignite-orange text-white px-3 py-2 text-sm leading-relaxed"
                  : "max-w-[95%] rounded-2xl rounded-bl-md bg-grey-100 text-grey-600 px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-bl-md bg-grey-100 px-3 py-2 flex items-center gap-2 text-grey-400 text-sm italic"
              aria-live="polite"
            >
              <Loader2 className="w-4 h-4 animate-spin shrink-0 not-italic" />
              {thinkingPhrase}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-grey-200 bg-grey-100">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="Type a message…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-grey-200 bg-white px-3 py-2 text-sm text-foreground placeholder:text-grey-400 outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
            disabled={sending}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={sending || !input.trim()}
            className="self-end shrink-0 h-10 w-10 rounded-xl bg-ignite-orange text-white flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none hover:bg-ignite-orange/90 transition-colors shadow-[0_4px_14px_rgba(255,87,34,0.25)]"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
