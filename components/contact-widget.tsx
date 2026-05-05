"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ChevronRight,
  HeadphonesIcon,
  Mail,
  MessageSquare,
  Mic,
  X,
} from "lucide-react"
import { ChatPanel } from "@/components/contact/chat-panel"
import { ContactForm } from "@/components/contact/contact-form"
import { VoicePanel } from "@/components/contact/voice-panel"

type View = "launcher" | "form" | "chat" | "voice"

const VIEW_TITLES: Record<Exclude<View, "launcher">, string> = {
  form: "Send us a message",
  chat: "Chat with Alex",
  voice: "Talk to Maya",
}

export function ContactWidget() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>("launcher")

  const close = () => {
    setOpen(false)
    setTimeout(() => setView("launcher"), 200)
  }

  const goBack = () => setView("launcher")

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 font-sans pointer-events-none">
      {open && (
        <div
          className={`pointer-events-auto w-[min(100vw-2.5rem,22rem)] sm:w-[22rem] flex flex-col rounded-2xl border border-grey-200 bg-white shadow-[0_12px_40px_rgba(10,10,10,0.12)] overflow-hidden transition-[max-height] duration-200 ${
            view === "launcher"
              ? "max-h-[min(100dvh-6rem,28rem)]"
              : "max-h-[min(100dvh-6rem,36rem)] h-[min(100dvh-6rem,36rem)]"
          }`}
          role="dialog"
          aria-label="Contact DigiiMark"
        >
          <Header view={view} onBack={goBack} onClose={close} />

          {view === "launcher" && <Launcher onPick={setView} />}
          {view === "form" && (
            <div className="flex-1 min-h-0 overflow-y-auto bg-white">
              <ContactForm />
            </div>
          )}
          {view === "chat" && <ChatPanel />}
          {view === "voice" && <VoicePanel />}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-ignite-orange text-white shadow-[0_8px_24px_rgba(255,87,34,0.35)] flex items-center justify-center hover:bg-ignite-orange/90 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ignite-orange focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-label={open ? "Close DigiiMark contact" : "Contact DigiiMark"}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <HeadphonesIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}

function Header({
  view,
  onBack,
  onClose,
}: {
  view: View
  onBack: () => void
  onClose: () => void
}) {
  const isLauncher = view === "launcher"
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-grey-200 bg-grey-100">
      <div className="flex items-center gap-2 min-w-0">
        {!isLauncher ? (
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-lg text-grey-600 hover:text-foreground hover:bg-white/80 transition-colors"
            aria-label="Back to options"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-2 h-2 rounded-full bg-ignite-orange shrink-0" />
        )}
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-foreground truncate">
            {isLauncher ? "Get in touch" : VIEW_TITLES[view]}
          </p>
          <p className="text-xs text-grey-400 truncate">
            {isLauncher
              ? "Pick how you'd like to talk"
              : "DigiiMark"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-lg text-grey-600 hover:text-foreground hover:bg-white/80 transition-colors shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

function Launcher({ onPick }: { onPick: (v: View) => void }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-white">
      <div className="px-4 py-4 border-b border-grey-200">
        <p className="text-sm text-grey-600 leading-relaxed">
          Hey there. We&apos;re an AI-first marketing agency — pick whichever
          channel works for you.
        </p>
      </div>
      <ul className="p-2 space-y-2">
        <LauncherCard
          icon={<Mail className="w-5 h-5" />}
          title="Send a message"
          subtitle="We'll reply within one business day"
          onClick={() => onPick("form")}
        />
        <LauncherCard
          icon={<MessageSquare className="w-5 h-5" />}
          title="Chat with Alex"
          subtitle="Live answers from our AI consultant"
          onClick={() => onPick("chat")}
        />
        <LauncherCard
          icon={<Mic className="w-5 h-5" />}
          title="Talk to Maya"
          subtitle="Real voice call with our AI consultant"
          onClick={() => onPick("voice")}
        />
      </ul>
    </div>
  )
}

function LauncherCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group w-full flex items-center gap-3 rounded-xl border border-grey-200 bg-white px-3 py-3 text-left hover:border-ignite-orange/40 hover:bg-peach-light transition-colors"
      >
        <span className="shrink-0 w-9 h-9 rounded-lg bg-grey-100 text-ignite-orange flex items-center justify-center group-hover:bg-white">
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-foreground">
            {title}
          </span>
          <span className="block text-xs text-grey-400 leading-relaxed">
            {subtitle}
          </span>
        </span>
        <ChevronRight className="w-4 h-4 text-grey-300 group-hover:text-ignite-orange transition-colors shrink-0" />
      </button>
    </li>
  )
}
