-- ================================================================
-- DigiiMark — Case study ↔ content categories junction ONLY
-- Use this when:
--   - You already have `content_categories` + `blog_content_categories`, OR
--   - The full migration failed before step 3 because `case_studies` was missing
--     and you have since created `public.case_studies`.
--
-- Prerequisites (must exist first):
--   - public.case_studies (id uuid PK)
--   - public.content_categories (id uuid PK)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.case_study_content_categories (
  case_study_id uuid NOT NULL REFERENCES public.case_studies (id) ON DELETE CASCADE,
  content_category_id uuid NOT NULL REFERENCES public.content_categories (id) ON DELETE CASCADE,
  PRIMARY KEY (case_study_id, content_category_id)
);

CREATE INDEX IF NOT EXISTS idx_cs_cc_category_id
  ON public.case_study_content_categories (content_category_id);
CREATE INDEX IF NOT EXISTS idx_cs_cc_case_study_id
  ON public.case_study_content_categories (case_study_id);

ALTER TABLE public.case_study_content_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read case_study_content_categories" ON public.case_study_content_categories;
CREATE POLICY "Allow public read case_study_content_categories"
  ON public.case_study_content_categories
  FOR SELECT
  TO public
  USING (true);

-- Example tag (replace slug values with yours):
-- INSERT INTO public.case_study_content_categories (case_study_id, content_category_id)
-- SELECT cs.id, cc.id
-- FROM public.case_studies cs
-- CROSS JOIN public.content_categories cc
-- WHERE cs.slug = 'your-case-study-slug' AND cc.slug = 'ai'
-- ON CONFLICT DO NOTHING;
