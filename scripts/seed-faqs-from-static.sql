-- ================================================================
-- DigiiMark — Seed FAQ table from the hardcoded homepage FAQs.
-- Source: components/faq-section.tsx (legacy static array).
-- Idempotent: re-running will not duplicate rows (deduped by question text).
--
-- Prerequisite: run scripts/voice-agent-supabase-migration.sql first so
-- the `faq` table exists.
-- ================================================================

INSERT INTO public.faq (question, answer, sort_order, is_active)
SELECT * FROM (VALUES
  (
    'Can you create a content management system for my website?',
    'Yes, we specialize in building highly scalable and customized Content Management Systems (CMS) tailored to your specific operational needs, allowing your team to seamlessly update and oversee content without needing technical skills.',
    10, true
  ),
  (
    'May I know the name of some of the biggest brands you have worked with?',
    'In the last few years, our client base has grown substantially. We work confidentially with leading global enterprises and innovative startups spanning tech, real estate, healthcare, and e-commerce. Due to NDAs, we selectively share enterprise case studies on request.',
    20, true
  ),
  (
    'I''m looking for a content marketing agency. Do you have writers in your agency?',
    'Absolutely! DigiiMark houses a dedicated team of expert copywriters and content strategists who specialize in SEO-driven web copy, engaging blog content, and high-converting marketing materials.',
    30, true
  ),
  (
    'Why should I choose you as my web design agency?',
    'Our approach bridges aesthetic design with engineering precision. We don''t just build beautiful sites; we build high-performance, conversion-focused digital experiences engineered using cutting-edge frameworks like React and Next.js.',
    40, true
  ),
  (
    'Can you create a theme-based WordPress website?',
    'While our expertise lies heavily in modern, custom-coded web applications (like Next.js), we absolutely provide highly optimized, secure, and beautiful theme-based CMS solutions when it fits your business requirements best.',
    50, true
  ),
  (
    'Do I need to hire a web designer to develop my business site?',
    'When working with DigiiMark, you get an entire end-to-end team. We provide the UX researchers, UI designers, and frontend/backend developers needed to successfully launch your platform without any external hiring.',
    60, true
  )
) AS v(question, answer, sort_order, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM public.faq f WHERE f.question = v.question
);

-- Verify:
-- SELECT sort_order, question FROM public.faq ORDER BY sort_order;
