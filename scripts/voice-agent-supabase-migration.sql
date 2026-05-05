-- ================================================================
-- DigiiMark — Voice Agent (Maya) Supabase Migration
-- Run in: https://supabase.com/dashboard/project/ulvinvuhajgzkpbycvtr/sql/new
-- Idempotent: safe to re-run. Creates:
--   * pgvector extension
--   * knowledge_base_documents + knowledge_base_chunks (RAG storage)
--   * match_kb_chunks RPC (semantic search)
--   * voice_calls + voice_call_turns + voice_call_tool_calls (transcripts)
--   * faq table (if missing) for agent + website consumption
--   * RLS policies (public read; service role handles writes)
-- ================================================================

-- ----------------------------------------------------------------
-- 0. Extensions
-- ----------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS vector;

-- ================================================================
-- 1. Knowledge base tables
-- ================================================================

-- 1.1 Documents — one row per canonical KB document.
--     A document may come from a manual markdown file (source_type='manual')
--     or be synced from another Supabase table (source_type='synced').
CREATE TABLE IF NOT EXISTS public.knowledge_base_documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  category      text,
  content       text NOT NULL,
  source_type   text NOT NULL DEFAULT 'manual'
                CHECK (source_type IN ('manual', 'synced')),
  source_table  text,
  source_id     uuid,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active     boolean NOT NULL DEFAULT true,
  content_hash  text,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Enforce uniqueness for synced rows (source_table + source_id pair).
-- Manual rows have NULL source fields so this does not block multiple manual docs.
CREATE UNIQUE INDEX IF NOT EXISTS knowledge_base_documents_source_unique
  ON public.knowledge_base_documents (source_table, source_id)
  WHERE source_table IS NOT NULL AND source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS knowledge_base_documents_category_idx
  ON public.knowledge_base_documents (category);

CREATE INDEX IF NOT EXISTS knowledge_base_documents_active_idx
  ON public.knowledge_base_documents (is_active) WHERE is_active = true;

-- 1.2 Chunks — embeddings for semantic retrieval.
--     Dimension 1536 matches gemini-embedding-001 output_dimensionality=1536
--     (Matryoshka truncation) and fits pgvector's native HNSW index limit.
CREATE TABLE IF NOT EXISTS public.knowledge_base_chunks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  uuid NOT NULL REFERENCES public.knowledge_base_documents (id) ON DELETE CASCADE,
  chunk_index  integer NOT NULL,
  content      text NOT NULL,
  embedding    vector(1536),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS knowledge_base_chunks_document_idx
  ON public.knowledge_base_chunks (document_id);

-- HNSW index for approximate nearest neighbour (cosine distance).
-- vector_cosine_ops requires the L2-normalised behaviour we want for relevance.
CREATE INDEX IF NOT EXISTS knowledge_base_chunks_embedding_hnsw
  ON public.knowledge_base_chunks
  USING hnsw (embedding vector_cosine_ops);

-- 1.3 Auto-update updated_at on document edits.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS knowledge_base_documents_set_updated_at
  ON public.knowledge_base_documents;
CREATE TRIGGER knowledge_base_documents_set_updated_at
  BEFORE UPDATE ON public.knowledge_base_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- 2. Semantic search RPC
-- ================================================================
-- Called from the voice agent every time a new turn needs context.
-- Returns top-N chunks ordered by cosine similarity, with document metadata.
CREATE OR REPLACE FUNCTION public.match_kb_chunks (
  query_embedding  vector(1536),
  match_count      int  DEFAULT 4,
  filter_category  text DEFAULT NULL
)
RETURNS TABLE (
  chunk_id           uuid,
  document_id        uuid,
  document_title     text,
  document_category  text,
  content            text,
  similarity         float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    c.id          AS chunk_id,
    c.document_id,
    d.title       AS document_title,
    d.category    AS document_category,
    c.content,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base_chunks c
  JOIN public.knowledge_base_documents d ON d.id = c.document_id
  WHERE d.is_active = true
    AND c.embedding IS NOT NULL
    AND (filter_category IS NULL OR d.category = filter_category)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ================================================================
-- 3. Voice call transcript tables
-- ================================================================

-- 3.1 One row per call.
CREATE TABLE IF NOT EXISTS public.voice_calls (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id           text NOT NULL UNIQUE,
  started_at        timestamptz NOT NULL,
  ended_at          timestamptz,
  duration_seconds  integer,
  agent_name        text,
  voice_name        text,
  model             text,
  topics            text[] NOT NULL DEFAULT '{}',
  tools_used        text[] NOT NULL DEFAULT '{}',
  turn_count        integer NOT NULL DEFAULT 0,
  caller_metadata   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS voice_calls_started_at_idx
  ON public.voice_calls (started_at DESC);

-- 3.2 One row per conversation turn.
CREATE TABLE IF NOT EXISTS public.voice_call_turns (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id    text NOT NULL REFERENCES public.voice_calls (call_id) ON DELETE CASCADE,
  turn_index integer NOT NULL,
  role       text NOT NULL CHECK (role IN ('user', 'assistant')),
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS voice_call_turns_call_idx
  ON public.voice_call_turns (call_id, turn_index);

-- 3.3 One row per tool invocation.
CREATE TABLE IF NOT EXISTS public.voice_call_tool_calls (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id    text NOT NULL REFERENCES public.voice_calls (call_id) ON DELETE CASCADE,
  tool_name  text NOT NULL,
  args       jsonb NOT NULL DEFAULT '{}'::jsonb,
  result     jsonb NOT NULL DEFAULT '{}'::jsonb,
  called_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS voice_call_tool_calls_call_idx
  ON public.voice_call_tool_calls (call_id, called_at);

-- ================================================================
-- 4. FAQ table (created if missing, aligned with website + voice agent)
-- ================================================================
-- Matches the schema documented in
-- playground/digiimark-supabase-schema.md. Safe if the table already exists
-- with the same core columns.
CREATE TABLE IF NOT EXISTS public.faq (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question              text NOT NULL,
  answer                text NOT NULL,
  linked_service_id     uuid,
  linked_case_study_id  uuid,
  sort_order            integer NOT NULL DEFAULT 0,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Back-fill `is_active` on pre-existing `faq` tables that predate this migration.
ALTER TABLE public.faq
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Only attempt the FK if the target tables exist (avoids errors in early envs).
DO $fk$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'services') THEN
    BEGIN
      ALTER TABLE public.faq
        ADD CONSTRAINT faq_linked_service_id_fkey
        FOREIGN KEY (linked_service_id) REFERENCES public.services (id) ON DELETE SET NULL;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'case_studies') THEN
    BEGIN
      ALTER TABLE public.faq
        ADD CONSTRAINT faq_linked_case_study_id_fkey
        FOREIGN KEY (linked_case_study_id) REFERENCES public.case_studies (id) ON DELETE SET NULL;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END
$fk$;

CREATE INDEX IF NOT EXISTS faq_is_active_idx ON public.faq (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS faq_sort_order_idx ON public.faq (sort_order);

DROP TRIGGER IF EXISTS faq_set_updated_at ON public.faq;
CREATE TRIGGER faq_set_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- 5. Row-Level Security
-- ================================================================

-- 5.1 Knowledge base — public read is fine (contains public company content),
--     writes are restricted to service role (bypasses RLS).
ALTER TABLE public.knowledge_base_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_chunks    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read knowledge_base_documents"
  ON public.knowledge_base_documents;
CREATE POLICY "Allow public read knowledge_base_documents"
  ON public.knowledge_base_documents
  FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read knowledge_base_chunks"
  ON public.knowledge_base_chunks;
CREATE POLICY "Allow public read knowledge_base_chunks"
  ON public.knowledge_base_chunks
  FOR SELECT
  TO public
  USING (true);

-- 5.2 Voice calls — NO public read (contains PII from prospects).
--     Only service role can read/write; admin UI will use service role client.
ALTER TABLE public.voice_calls            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_call_turns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_call_tool_calls  ENABLE ROW LEVEL SECURITY;

-- No SELECT policies — default deny. Service role bypasses this.

-- 5.3 FAQ — public read, service role writes.
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read faq" ON public.faq;
CREATE POLICY "Allow public read faq"
  ON public.faq
  FOR SELECT
  TO public
  USING (is_active = true);

-- ================================================================
-- 6. Verification queries (run manually to sanity-check)
-- ================================================================
-- SELECT count(*) FROM public.knowledge_base_documents;
-- SELECT count(*) FROM public.knowledge_base_chunks;
-- SELECT count(*) FROM public.voice_calls;
-- SELECT count(*) FROM public.faq;
-- SELECT extname FROM pg_extension WHERE extname = 'vector';
-- SELECT indexname FROM pg_indexes WHERE tablename IN
--   ('knowledge_base_chunks','knowledge_base_documents','voice_calls',
--    'voice_call_turns','voice_call_tool_calls','faq');
