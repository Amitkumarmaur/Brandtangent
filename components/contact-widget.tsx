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
  chat: "Chat with our AI",
  voice: "Voice consultation",
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
          className={`pointer-events-auto w-[min(100vw-2.5rem,22rem)] sm:w-[22rem] flex flex-col rounded-md border border-border bg-white shadow-[var(--shadow-layered-strong)] overflow-hidden transition-[max-height] duration-200 ${
            view === "launcher"
              ? "max-h-[min(100dvh-6rem,28rem)]"
              : "max-h-[min(100dvh-6rem,36rem)] h-[min(100dvh-6rem,36rem)]"
          }`}
          role="dialog"
          aria-label="Contact Brandtangent"
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

      {/* Trigger — indigo pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-12 w-12 rounded-full bg-accent-orange text-white flex items-center justify-center hover:bg-accent-orange/90 active:opacity-90 transition-colors shadow-[var(--shadow-accent-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange"
        aria-expanded={open}
        aria-label={open ? "Close contact" : "Contact Brandtangent"}
      >
        {open ? <X className="w-5 h-5" /> : <HeadphonesIcon className="w-5 h-5" />}
      </button>
    </div>
  )
}

function Header({ view, onBack, onClose }: { view: View; onBack: () => void; onClose: () => void }) {
  const isLauncher = view === "launcher"
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-secondary">
      <div className="flex items-center gap-2 min-w-0">
        {!isLauncher ? (
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Back to options"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-2 h-2 rounded-full bg-accent-orange shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-[14px] font-normal text-foreground truncate">
            {isLauncher ? "Get in touch" : VIEW_TITLES[view]}
          </p>
          <p className="text-[12px] text-muted-foreground font-normal truncate">
            {isLauncher ? "Pick how you'd like to talk" : "Brandtangent"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
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
      <div className="px-4 py-4 border-b border-border">
        <p className="text-[14px] text-muted-foreground font-normal leading-relaxed">
          Hey there. We&apos;re a brand strategy and creative agency — pick
          whichever channel works for you.
        </p>
      </div>
      <ul className="p-3 space-y-2">
        <LauncherCard
          icon={<Mail className="w-4.5 h-4.5" />}
          title="Send a message"
          subtitle="We'll reply within one business day"
          onClick={() => onPick("form")}
        />
        <LauncherCard
          icon={<MessageSquare className="w-4.5 h-4.5" />}
          title="Chat with our AI"
          subtitle="Live answers from our AI consultant"
          onClick={() => onPick("chat")}
        />
        <LauncherCard
          icon={<Mic className="w-4.5 h-4.5" />}
          title="Voice consultation"
          subtitle="Real voice call with our AI consultant"
          onClick={() => onPick("voice")}
        />
      </ul>
    </div>
  )
}

function LauncherCard({
  icon, title, subtitle, onClick,
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
        className="group w-full flex items-center gap-3 rounded-md border border-border bg-white px-3 py-3 text-left hover:border-accent-orange/30 hover:bg-secondary hover:shadow-[var(--shadow-layered)] transition-all"
      >
        <span className="shrink-0 w-9 h-9 rounded-full border border-border text-muted-foreground flex items-center justify-center group-hover:text-accent-orange group-hover:border-accent-orange/40 group-hover:bg-accent-orange/10 transition-colors">
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[14px] font-normal text-foreground">{title}</span>
          <span className="block text-[12px] text-muted-foreground font-normal leading-relaxed">{subtitle}</span>
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent-orange transition-colors shrink-0" />
      </button>
    </li>
  )
}
