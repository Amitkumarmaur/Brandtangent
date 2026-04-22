-- DigiiMark — careers + applications + resume storage
-- Run in Supabase SQL Editor after reviewing your existing schema.
--
-- Requires tables (per playground/digiimark-supabase-schema.md):
--   careers (id uuid PK default gen_random_uuid(), job_title, description, location, type, status, created_at, …)
--   applications (id, career_id FK → careers, full_name, email, phone, resume_url, cover_letter, created_at)
--
-- Server route: app/api/careers/apply/route.ts
-- Env: SUPABASE_SERVICE_ROLE_KEY (server only), optional CAREERS_FALLBACK_CAREER_ID

-- 1) Storage bucket for resume files (service role uploads; adjust RLS for your security model)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- 2) Seed a catch-all open role so the careers page always has something to attach applications to
INSERT INTO public.careers (id, job_title, description, location, type, status)
SELECT
  gen_random_uuid(),
  'General application',
  'Submit your resume for upcoming roles and speculative applications. Our team reviews every profile.',
  'Remote',
  'Various',
  'open'
WHERE NOT EXISTS (
  SELECT 1 FROM public.careers WHERE job_title = 'General application'
);

-- 3) Example RLS (tune for production): public read open jobs; no public insert on applications (API uses service role).
--    Uncomment and adjust if your `careers` / `applications` tables already have policies.

-- ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Public read open careers" ON public.careers;
-- CREATE POLICY "Public read open careers"
--   ON public.careers FOR SELECT
--   USING (status = 'open');
