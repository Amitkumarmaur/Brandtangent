-- ================================================================
-- DigiiMark agents — security hardening pass
-- Idempotent: safe to re-run.
--
-- Fixes:
--  1. linter 0011 — pin search_path on agent-owned functions
--     (match_kb_chunks, set_updated_at) so privilege-escalation
--     via shadowed objects is impossible.
--  2. linter 0013 — enable RLS on the previously-unprotected
--     `leads` sink (no policies → deny by default for anon /
--     authenticated; the agents use the service role and bypass RLS).
--  3. linter 0006 — drop the duplicate FAQ SELECT policy added by
--     the voice migration; the original site policy `faqs_public_read`
--     is preserved unchanged.
--
-- Run in: https://supabase.com/dashboard/project/xkmxdzzwslkttsptmajd/sql/new
-- ================================================================

ALTER FUNCTION public.match_kb_chunks(vector, integer, text)
  SET search_path = public;

ALTER FUNCTION public.set_updated_at()
  SET search_path = public;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read faq" ON public.faq;
