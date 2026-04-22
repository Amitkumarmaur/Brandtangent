-- ================================================================
-- DigiiMark — Blogs Table Setup & Demo Data
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Open the SQL Editor and create a "New Query"
-- 3. Paste this entire script and click "Run"
-- ================================================================

-- 1. Create the blogs table (if it doesn't already have these columns)
CREATE TABLE IF NOT EXISTS public.blogs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  slug         text UNIQUE NOT NULL,
  category     text,
  excerpt      text,
  content      text, -- Supports Markdown
  image_url    text,
  author_name  text DEFAULT 'DigiiMark Team',
  author_image text,
  read_time    text,
  published_at timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (anyone can view blog posts)
DROP POLICY IF EXISTS "Allow public read" ON public.blogs;
CREATE POLICY "Allow public read"
  ON public.blogs
  FOR SELECT
  TO public
  USING (true);

-- 4. Clear existing demo data (optional, remove if you have real data)
-- TRUNCATE public.blogs;

-- 5. Insert Demo Data
INSERT INTO public.blogs (title, slug, category, excerpt, content, image_url, author_name, author_image, read_time, published_at)
VALUES 
(
  'The Future of Cloud Infrastructure in 2026',
  'future-cloud-infrastructure-2026',
  'Technology',
  'Discover the architectural shifts redefining cloud infrastructure, focusing on serverless deployments and edge computing.',
  '# The Future of Cloud Infrastructure\n\nIn 2026, the cloud is no longer just a place to host servers; it is a distributed intelligence layer. Companies like **DigiiMark** are at the forefront of this transition, leveraging serverless architectures to provide localized, high-speed marketing automation.\n\n## Key Trends\n\n1. **Edge Intelligence**: Moving LLM inference closer to the user to reduce latency.\n2. **Zero-Ops Environments**: Developers focus solely on business logic while the infrastructure scales autonomously.\n3. **Sustainable Compute**: AI-driven power management for data centers.\n\nStay tuned as we continue to push the boundaries of what is possible.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
  'DigiiMark Engineering',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
  '6 min read',
  NOW() - INTERVAL '2 days'
),
(
  'Mastering AI Automation for Real Estate',
  'ai-automation-real-estate',
  'Industry',
  'How real estate agencies are leveraging AI agents to automate lead qualification and significantly increase conversion rates.',
  '# AI in Real Estate\n\nReal estate is an industry built on relationships, but sustained by data. AI agents are now handling the initial layers of lead engagement, allowing human agents to focus on closing deals.\n\n## The Automation Framework\n\n- **Instant Lead Response**: AI respond to inquiries within 30 seconds, 24/7.\n- **Virtual Property Tours**: Personalized video narrations generated on the fly.\n- **Predictive Matching**: Algorithms that suggest properties based on subtle behavioral cues.\n\nAt DigiiMark, our real estate stack integrates seamlessly with platforms like HubSpot and Salesforce to ensure no lead is ever dropped.',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
  'Sarah Mitchell',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
  '4 min read',
  NOW() - INTERVAL '1 week'
),
(
  'Designing for the B2B Metaverse Ecosystem',
  'designing-b2b-metaverse',
  'Design',
  'Why B2B enterprises are investing heavily into immersive web experiences and how designers are adapting.',
  '# The B2B Metaverse\n\nDesign is shifting from 2D interfaces to immersive, spatial experiences. This isn''t just about VR; it''s about how data is visualized and interacted with in three dimensions.\n\n## Design Principles for 2026\n\n- **Atmospheric UI**: Interfaces that blend into the environment.\n- **Haptic Feedback Design**: Designing for the sense of touch in digital spaces.\n- **Collaborative Workspaces**: Persistent virtual rooms where teams can iterate on complex products.\n\nWe are currently developing several experimental UI systems that redefine how our clients interact with their marketing performance metrics.',
  'https://images.unsplash.com/photo-1614729939124-032f0b5609ce?auto=format&fit=crop&q=80&w=1200',
  'Alex Chen',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
  '8 min read',
  NOW() - INTERVAL '3 weeks'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  image_url = EXCLUDED.image_url,
  author_name = EXCLUDED.author_name;
