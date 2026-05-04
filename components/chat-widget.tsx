"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, MessageCircle, Send, X } from "lucide-react"

const API_PREFIX = "/api/chat-agent"

type ChatMessage = { role: "user" | "assistant"; content: string }

type ChatMessageResponse = {
  session_id: string
  reply: string
  tools_used?: string[]
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState<boolean | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
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
    if (open) pingHealth()
  }, [open, pingHealth])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  const endSessionRemote = useCallback(async (sid: string | null) => {
    if (!sid) return
    try {
      await fetch(`${API_PREFIX}/v1/chat/session/${encodeURIComponent(sid)}/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome: "completed" }),
      })
    } catch {
      /* best-effort */
    }
  }, [])

  const startNewConversation = useCallback(async () => {
    await endSessionRemote(sessionId)
    setSessionId(null)
    setMessages([])
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
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "" }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong."
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            ready === false
              ? "Chat backend is offline. From the repo root run `pnpm dev:with-chat` (starts the site and the agent), or run `python main.py` in `chatagent/` with `pnpm dev`. On Vercel, set `CHAT_AGENT_URL` to your deployed chat API. Ensure `chatagent/.env` has `GEMINI_API_KEY`."
              : msg,
        },
      ])
    } finally {
      setSending(false)
    }
  }, [sending, sessionId, ready])

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 font-sans pointer-events-none">
      {open && (
        <div
          className="pointer-events-auto w-[min(100vw-2.5rem,22rem)] sm:w-[22rem] max-h-[min(100dvh-6rem,32rem)] flex flex-col rounded-2xl border border-grey-200 bg-white shadow-[0_12px_40px_rgba(10,10,10,0.12)] overflow-hidden"
          role="dialog"
          aria-label="DigiiMark live chat"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-grey-200 bg-grey-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-ignite-orange shrink-0" />
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-foreground truncate">DigiiMark</p>
                <p className="text-xs text-grey-400 truncate">
                  {ready === null ? "Checking…" : ready ? "Live chat" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => void startNewConversation()}
                className="text-xs font-medium text-grey-600 hover:text-foreground px-2 py-1 rounded-lg hover:bg-white/80 transition-colors"
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-grey-600 hover:text-foreground hover:bg-white/80 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            className="flex-1 min-h-[12rem] max-h-[20rem] overflow-y-auto px-4 py-3 space-y-3 bg-white"
          >
            {messages.length === 0 && (
              <p className="text-sm text-grey-400 leading-relaxed">
                Ask about services, automation, or how we work. We will pull answers from our knowledge base when
                possible.
              </p>
            )}
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
                <div className="rounded-2xl rounded-bl-md bg-grey-100 px-3 py-2 flex items-center gap-2 text-grey-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking…
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
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-ignite-orange text-white shadow-[0_8px_24px_rgba(255,87,34,0.35)] flex items-center justify-center hover:bg-ignite-orange/90 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-label={open ? "Close DigiiMark chat" : "Open DigiiMark chat"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
