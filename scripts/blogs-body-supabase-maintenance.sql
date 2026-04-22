-- =============================================================================
-- DigiiMark — Blog body column maintenance (run once in Supabase SQL Editor)
-- =============================================================================
-- Goals:
--   1) Use `body_content` as the canonical Markdown field (matches Next.js app).
--   2) Backfill `body_content` from legacy `content` when the body is empty.
--   3) Normalize common paste issues so editor + site stay aligned.
--
-- After this, add and edit article Markdown in **`body_content`** in the Table Editor.
-- The app prefers `body_content` over `content` when both exist.

-- Optional: document the column (ignore errors if COMMENT not supported on your plan)
COMMENT ON COLUMN public.blogs.body_content IS
  'Markdown article body (headings, lists, GFM tables). Shown via react-markdown. Prefer this over legacy `content`.';

-- 1) Backfill: copy legacy content into body_content only when body is empty
UPDATE public.blogs
SET
  body_content = trim(both from content),
  updated_at = now()
WHERE
  (body_content IS NULL OR trim(both from body_content) = '')
  AND content IS NOT NULL
  AND trim(both from content) <> '';

-- 2) UTF-8 BOM: stripped at render time in the app (`normalizeMarkdownBody`).
--     Avoid DB byte-chopping here so multi-byte characters are never corrupted.

-- 3) Normalize CRLF → LF (optional; the app also normalizes at render time)
UPDATE public.blogs
SET
  body_content = replace(replace(body_content, E'\r\n', E'\n'), E'\r', E'\n'),
  updated_at = now()
WHERE
  body_content IS NOT NULL
  AND (body_content LIKE E'%\r\n%' OR body_content LIKE E'%\r%');
