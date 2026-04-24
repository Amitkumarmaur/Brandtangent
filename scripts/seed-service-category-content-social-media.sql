-- DigiiMark — Upsert `service_categories` row for slug `content-social-media`.
-- Populates every marketing column used by `app/services/[category]/page.tsx`.
-- Run in Supabase SQL Editor (review RLS; this is a direct table write).

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.service_categories WHERE slug = 'content-social-media') THEN
    UPDATE public.service_categories
    SET
      name = 'Content & Social Media',
      seo_title = 'Content & Social Media Services | DigiiMark',
      meta_description =
        'Editorial systems, social distribution, and creative production for B2B teams — from LinkedIn to short-form, with measurement tied to pipeline.',
      icon = NULL,
      display_order = 50,
      hero_display_title = 'SOCIAL-FIRST' || chr(10) || 'CONTENT SYSTEMS',
      hero_description =
        'We build editorial engines and paid/organic social programs that stay on-message across every touchpoint — mapped to ICPs, funnels, and revenue.',
      hero_animated_words = ARRAY['ALWAYS-ON', 'PLATFORM-NATIVE', 'MEASURED', 'BRAND-SAFE']::text[],
      hero_stat_value = '48%',
      hero_stat_label = 'avg. lower CAC on content-led programs (client benchmark)',
      featured_projects =
        '[
          {
            "title": "B2B social hub",
            "image": "https://images.unsplash.com/photo-1611162616475-46b635cb686a?auto=format&fit=crop&w=1200&q=80",
            "category": "Content",
            "flag": "Featured",
            "accent": "#FF5722",
            "stat": { "value": "+41%", "label": "MQL lift" }
          },
          {
            "title": "Creator + paid social",
            "image": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80",
            "category": "Social",
            "accent": "#8B5CF6",
            "stat": { "value": "2.4M", "label": "monthly impressions" }
          }
        ]'::jsonb,
      expertise_badge = 'Our expertise',
      expertise_title = 'Content & social capabilities',
      expertise_subtitle =
        'From narrative strategy to creator governance — everything we ship ladders to pipeline, not vanity metrics.',
      process_heading = 'How we run content & social',
      process_description =
        'A phased model so calendars, creative, and boosts stay aligned with legal, brand, and revenue targets.',
      process_steps =
        '[
          {
            "title": "Discover & align",
            "items": [
              "ICP / journey mapping",
              "Channel + message audits",
              "Compliance & tone guardrails"
            ]
          },
          {
            "title": "Produce & package",
            "items": [
              "Editorial calendar",
              "Creative sprints",
              "Repurpose / atomization workflows"
            ]
          },
          {
            "title": "Distribute & learn",
            "items": [
              "Paid + organic flighting",
              "Experiments & lift reads",
              "Weekly ingestion into GTM"
            ]
          }
        ]'::jsonb,
      tech_stack_ids = ARRAY[]::uuid[],
      target_industries =
        '[
          {
            "industry": "B2B SaaS",
            "headline": "Dark social that still attributes",
            "services": "LinkedIn + podcasts + email bridges",
            "yearsExp": 7,
            "clients": 32,
            "clientLabel": "ARR $5–500M",
            "caseStudies": [{ "name": "Pipeline series", "bg": "#1a1a2e" }]
          },
          {
            "industry": "Professional services",
            "headline": "Trust before the pitch",
            "services": "Founder-led + expert content",
            "yearsExp": 5,
            "clients": 18,
            "clientLabel": "Partnerships",
            "caseStudies": [{ "name": "Authority flywheel", "bg": "#16213e" }]
          }
        ]'::jsonb
    WHERE slug = 'content-social-media';
  ELSE
    INSERT INTO public.service_categories (
      name,
      slug,
      seo_title,
      meta_description,
      icon,
      display_order,
      hero_display_title,
      hero_description,
      hero_animated_words,
      hero_stat_value,
      hero_stat_label,
      featured_projects,
      expertise_badge,
      expertise_title,
      expertise_subtitle,
      process_heading,
      process_description,
      process_steps,
      tech_stack_ids,
      target_industries
    )
    VALUES (
      'Content & Social Media',
      'content-social-media',
      'Content & Social Media Services | DigiiMark',
      'Editorial systems, social distribution, and creative production for B2B teams — from LinkedIn to short-form, with measurement tied to pipeline.',
      NULL,
      50,
      'SOCIAL-FIRST' || chr(10) || 'CONTENT SYSTEMS',
      'We build editorial engines and paid/organic social programs that stay on-message across every touchpoint — mapped to ICPs, funnels, and revenue.',
      ARRAY['ALWAYS-ON', 'PLATFORM-NATIVE', 'MEASURED', 'BRAND-SAFE']::text[],
      '48%',
      'avg. lower CAC on content-led programs (client benchmark)',
      '[
        {
          "title": "B2B social hub",
          "image": "https://images.unsplash.com/photo-1611162616475-46b635cb686a?auto=format&fit=crop&w=1200&q=80",
          "category": "Content",
          "flag": "Featured",
          "accent": "#FF5722",
          "stat": { "value": "+41%", "label": "MQL lift" }
        },
        {
          "title": "Creator + paid social",
          "image": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1200&q=80",
          "category": "Social",
          "accent": "#8B5CF6",
          "stat": { "value": "2.4M", "label": "monthly impressions" }
        }
      ]'::jsonb,
      'Our expertise',
      'Content & social capabilities',
      'From narrative strategy to creator governance — everything we ship ladders to pipeline, not vanity metrics.',
      'How we run content & social',
      'A phased model so calendars, creative, and boosts stay aligned with legal, brand, and revenue targets.',
      '[
        {
          "title": "Discover & align",
          "items": [
            "ICP / journey mapping",
            "Channel + message audits",
            "Compliance & tone guardrails"
          ]
        },
        {
          "title": "Produce & package",
          "items": [
            "Editorial calendar",
            "Creative sprints",
            "Repurpose / atomization workflows"
          ]
        },
        {
          "title": "Distribute & learn",
          "items": [
            "Paid + organic flighting",
            "Experiments & lift reads",
            "Weekly ingestion into GTM"
          ]
        }
      ]'::jsonb,
      ARRAY[]::uuid[],
      '[
        {
          "industry": "B2B SaaS",
          "headline": "Dark social that still attributes",
          "services": "LinkedIn + podcasts + email bridges",
          "yearsExp": 7,
          "clients": 32,
          "clientLabel": "ARR $5–500M",
          "caseStudies": [{ "name": "Pipeline series", "bg": "#1a1a2e" }]
        },
        {
          "industry": "Professional services",
          "headline": "Trust before the pitch",
          "services": "Founder-led + expert content",
          "yearsExp": 5,
          "clients": 18,
          "clientLabel": "Partnerships",
          "caseStudies": [{ "name": "Authority flywheel", "bg": "#16213e" }]
        }
      ]'::jsonb
    );
  END IF;
END $$;
