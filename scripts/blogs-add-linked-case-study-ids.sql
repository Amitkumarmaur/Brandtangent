-- ================================================================
-- DigiiMark — Link blogs to case studies for "Related work" section
-- Adds uuid[] on blogs (mirrors linked_faq_ids pattern).
-- Run once in Supabase SQL Editor.
-- ================================================================

ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS linked_case_study_ids uuid[] NOT NULL DEFAULT '{}'::uuid[];

COMMENT ON COLUMN public.blogs.linked_case_study_ids IS
  'Case studies to feature at the bottom of this blog post (order preserved).';

-- Example: attach TechFlow + RetailPro to the real-estate AI blog (replace blog id if needed)
-- UPDATE public.blogs SET
--   linked_case_study_ids = ARRAY[
--     'aaaaaaaa-1111-4111-a111-aaaaaaaaaaaa'::uuid,
--     'bbbbbbbb-2222-4222-b222-bbbbbbbbbbbb'::uuid
--   ]::uuid[],
--   updated_at = now()
-- WHERE slug = 'ai-lead-qualification-real-estate';
