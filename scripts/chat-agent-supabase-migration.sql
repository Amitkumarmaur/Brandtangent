-- ================================================================
-- DigiiMark — Chat Agent (Alex) Supabase Migration
-- Mirrors the voice_calls / voice_call_turns / voice_call_tool_calls
-- shape so both agents can be queried with one mental model.
-- Run in: https://supabase.com/dashboard/project/xkmxdzzwslkttsptmajd/sql/new
-- Idempotent: safe to re-run.
-- ================================================================

-- 1. One row per chat session.
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        text NOT NULL UNIQUE,
  started_at        timestamptz NOT NULL,
  ended_at          timestamptz,
  duration_seconds  integer,
  agent_name        text,
  model             text,
  user_identifier   text,
  outcome           text,
  topics            text[] NOT NULL DEFAULT '{}',
  tools_used        text[] NOT NULL DEFAULT '{}',
  turn_count        integer NOT NULL DEFAULT 0,
  caller_metadata   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_sessions_started_at_idx
  ON public.chat_sessions (started_at DESC);

-- 2. One row per conversation turn (user or assistant).
CREATE TABLE IF NOT EXISTS public.chat_session_turns (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  text NOT NULL REFERENCES public.chat_sessions (session_id) ON DELETE CASCADE,
  turn_index  integer NOT NULL,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text NOT NULL,
  citations   jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_session_turns_session_idx
  ON public.chat_session_turns (session_id, turn_index);

-- 3. One row per tool invocation in a chat session.
CREATE TABLE IF NOT EXISTS public.chat_session_tool_calls (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  text NOT NULL REFERENCES public.chat_sessions (session_id) ON DELETE CASCADE,
  tool_name   text NOT NULL,
  args        jsonb NOT NULL DEFAULT '{}'::jsonb,
  result      jsonb NOT NULL DEFAULT '{}'::jsonb,
  called_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_session_tool_calls_session_idx
  ON public.chat_session_tool_calls (session_id, called_at);

-- 4. RLS — chat transcripts contain PII; deny anon reads.
ALTER TABLE public.chat_sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_session_turns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_session_tool_calls  ENABLE ROW LEVEL SECURITY;

-- No SELECT policies — default deny. Service role bypasses this; admin UIs
-- must use the service-role client server-side.
