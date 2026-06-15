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

const THINKING_PHRASES = [
  "Thinking it over…",
  "One sec…",
  "Checking the playbook…",
  "Pulling that up…",
  "Cooking…",
  "Hmm, let me see…",
  "Hang on…",
  "Reading the room…",
  "Working on it…",
  "Just a moment…",
] as const

const WELCOME_LINES = [
  "Hey — Alex from Brandtangent. What's on your mind?",
  "Hi! Alex here from Brandtangent. How can I help today?",
  "Hey there. Alex from Brandtangent — what brings you in?",
  "Hi, Alex from Brandtangent. Ask me anything about what we do.",
  "Hey — Alex here. Brand strategy, identity, creative — what's the question?",
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

  useEffect(() => {
    if (!sending) return
    setThinkingPhrase(pickRandom(THINKING_PHRASES))
    const interval = window.setInterval(() => {
      setThinkingPhrase((current) => {
        let next = current
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
              ? "Live chat is offline right now. Try the form on the previous screen, or email hello@brandtangent.com."
              : msg,
        },
      ])
    } finally {
      setSending(false)
    }
  }, [sending, sessionId, ready])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white">
        <p className="text-xs text-muted-foreground">
          {ready === null ? "Checking…" : ready ? "Online" : "Offline"}
        </p>
        <button
          type="button"
          onClick={() => void startNewConversation()}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                  ? "max-w-[90%] rounded-md rounded-br-[4px] bg-primary text-primary-foreground px-3 py-2 text-sm leading-relaxed"
                  : "max-w-[95%] rounded-md rounded-bl-[4px] bg-muted text-muted-foreground px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div
              className="rounded-md rounded-bl-[4px] bg-muted px-3 py-2 flex items-center gap-2 text-muted-foreground text-sm italic"
              aria-live="polite"
            >
              <Loader2 className="w-4 h-4 animate-spin shrink-0 not-italic" />
              {thinkingPhrase}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-white">
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
            className="flex-1 resize-none rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-[rgba(28,28,28,0.4)] focus-visible:shadow-[rgba(0,0,0,0.1)_0px_4px_12px]"
            disabled={sending}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={sending || !input.trim()}
            className="self-end shrink-0 h-10 w-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none hover:opacity-90 transition-opacity shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
