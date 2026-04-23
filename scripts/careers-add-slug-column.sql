-- Optional: store URL slug on `careers` so `/careers/[slug]` matches Supabase exactly
-- (the app still derives slug from `job_title` if this column is missing).
-- Run once in Supabase SQL Editor.

ALTER TABLE public.careers ADD COLUMN IF NOT EXISTS slug text;

-- Backfill from title (ASCII-style slug; close to app `careerSlugFromTitle`)
UPDATE public.careers
SET
  slug = trim(
    both '-'
    from
      regexp_replace(
        regexp_replace(lower(trim(job_title)), '[^a-z0-9]+', '-', 'g'),
        '-+',
        '-',
        'g'
      )
  )
WHERE
  coalesce(trim(slug), '') = '';

-- Optional: enforce uniqueness after verifying no two rows share the same slug
-- ALTER TABLE public.careers ADD CONSTRAINT careers_slug_key UNIQUE (slug);
