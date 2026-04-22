-- ================================================================
-- DigiiMark — Content categories (blogs + case studies)
-- Run in Supabase SQL Editor after `blogs` and `case_studies` exist.
-- Idempotent: safe to re-run.
--
-- Troubleshooting
-- -----------------
-- If this script errors on step 3 (case_study_content_categories) because
-- `case_studies` did not exist yet, create that table first, then run:
--   scripts/content-categories-case-study-junction-only.sql
-- If you only see "relation case_study_content_categories does not exist" when
-- running an INSERT, you skipped CREATE TABLE — run the junction-only script
-- above (or re-run this full file from the top).
-- ================================================================

-- 1. Reference table
CREATE TABLE IF NOT EXISTS public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Junction: blogs (many-to-many)
CREATE TABLE IF NOT EXISTS public.blog_content_categories (
  blog_id uuid NOT NULL REFERENCES public.blogs (id) ON DELETE CASCADE,
  content_category_id uuid NOT NULL REFERENCES public.content_categories (id) ON DELETE CASCADE,
  PRIMARY KEY (blog_id, content_category_id)
);

-- 3. Junction: case studies (many-to-many)
CREATE TABLE IF NOT EXISTS public.case_study_content_categories (
  case_study_id uuid NOT NULL REFERENCES public.case_studies (id) ON DELETE CASCADE,
  content_category_id uuid NOT NULL REFERENCES public.content_categories (id) ON DELETE CASCADE,
  PRIMARY KEY (case_study_id, content_category_id)
);

CREATE INDEX IF NOT EXISTS idx_blog_content_categories_category_id
  ON public.blog_content_categories (content_category_id);
CREATE INDEX IF NOT EXISTS idx_blog_content_categories_blog_id
  ON public.blog_content_categories (blog_id);
CREATE INDEX IF NOT EXISTS idx_cs_cc_category_id
  ON public.case_study_content_categories (content_category_id);
CREATE INDEX IF NOT EXISTS idx_cs_cc_case_study_id
  ON public.case_study_content_categories (case_study_id);

-- 4. RLS
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_content_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read content_categories" ON public.content_categories;
CREATE POLICY "Allow public read content_categories"
  ON public.content_categories
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public read blog_content_categories" ON public.blog_content_categories;
CREATE POLICY "Allow public read blog_content_categories"
  ON public.blog_content_categories
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public read case_study_content_categories" ON public.case_study_content_categories;
CREATE POLICY "Allow public read case_study_content_categories"
  ON public.case_study_content_categories
  FOR SELECT
  TO public
  USING (true);

-- 5. Seed canonical categories (aligns with blog mock + seed-blogs.sql labels)
INSERT INTO public.content_categories (name, slug, display_order)
VALUES
  ('Technology', 'technology', 0),
  ('Industry', 'industry', 10),
  ('Development', 'development', 20),
  ('AI', 'ai', 30),
  ('Design', 'design', 40),
  ('Data', 'data', 50)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order;

-- 6. Backfill blog tags from legacy `blogs.category` text (only if that column exists).
--    Some projects use a blogs schema without `category`; tag rows in
--    `blog_content_categories` manually or via the Dashboard in that case.
DO $backfill$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'blogs'
      AND column_name = 'category'
  ) THEN
    EXECUTE $sql$
      INSERT INTO public.blog_content_categories (blog_id, content_category_id)
      SELECT b.id, c.id
      FROM public.blogs b
      INNER JOIN public.content_categories c
        ON lower(trim(b.category::text)) = lower(trim(c.name))
      WHERE b.category IS NOT NULL
        AND trim(b.category::text) <> ''
      ON CONFLICT DO NOTHING
    $sql$;
  END IF;
END
$backfill$;
