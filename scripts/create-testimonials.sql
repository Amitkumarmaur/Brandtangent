-- ================================================================
-- DigiiMark — Testimonials Table + RLS + Storage Bucket Setup
-- Run this in: https://supabase.com/dashboard/project/ulvinvuhajgzkpbycvtr/sql/new
-- ================================================================

-- 1. Create the testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name  text NOT NULL,
  role_company text,
  quote        text NOT NULL,
  rating       integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_url    text,
  created_at   timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (anyone can view testimonials)
CREATE POLICY "Allow public read"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (true);

-- 4. Authenticated insert (admins only)
CREATE POLICY "Allow authenticated insert"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. Authenticated update (admins only)
CREATE POLICY "Allow authenticated update"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Authenticated delete (admins only)
CREATE POLICY "Allow authenticated delete"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- ================================================================
-- Storage bucket (run via Supabase Dashboard > Storage > New Bucket)
-- Bucket name: testimonial-images
-- Public: YES
-- ================================================================

-- Optional: storage RLS for the bucket (paste in SQL editor too)
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files from the bucket
CREATE POLICY "Public read testimonial images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'testimonial-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload testimonial images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'testimonial-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated delete testimonial images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonial-images');
