-- If the app errors with "column careers.description does not exist", run this once in Supabase SQL Editor.
-- Then re-run scripts/update-careers-job-descriptions.sql (or your own UPDATEs) to populate HTML.

ALTER TABLE public.careers ADD COLUMN IF NOT EXISTS description text;

-- Optional: one-time copy from a legacy column (uncomment and rename if applicable).
-- UPDATE public.careers SET description = job_description
-- WHERE description IS NULL AND job_description IS NOT NULL;
