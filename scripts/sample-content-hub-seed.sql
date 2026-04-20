-- ================================================================
-- DigiiMark — Sample data for content hub tables
-- Run in Supabase SQL Editor AFTER:
--   - scripts/content-categories-migration.sql (content_categories + junctions)
-- Assumes `blogs` uses the production-style columns:
--   seo_title, slug, meta_description, hero_image, body_content, published, published_at
-- Idempotent: safe to re-run (ON CONFLICT / DO NOTHING).
-- ================================================================

-- 1) Sample blog posts (no `category` column — topics live in blog_content_categories)
INSERT INTO public.blogs (
  seo_title,
  slug,
  meta_description,
  hero_image,
  body_content,
  published,
  published_at,
  display_order
)
VALUES
  (
    'The Future of Cloud Infrastructure in 2026',
    'future-cloud-infrastructure-2026',
    'Serverless, edge, and sustainable compute trends shaping B2B infrastructure this year.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    $markdown$# The future of cloud infrastructure in 2026

Cloud is no longer “a server somewhere.” In 2026 it behaves like a **distributed intelligence layer**: workloads move between regions, inference pushes toward the edge, and finance expects **unit economics** tied to outcomes—not vague capacity plans.

## Why this shift matters for GTM teams

When campaigns spike, latency and reliability become revenue problems. A slow form submit, a flaky personalization call, or a regional outage during a launch can quietly burn pipeline. Marketing and product need the same **SLO language** so trade-offs are explicit.

## What we are watching

1. **Edge intelligence** — Real-time scoring and copy variants closer to the user, with guardrails and caching so costs stay predictable.
2. **Zero-ops defaults** — Platforms that scale, patch, and observe themselves so engineering stays on features, not pager theater.
3. **Sustainable compute** — Carbon-aware scheduling and right-sized inference so growth does not outrun responsibility.

| Pattern | Best when | Watch out for |
| --- | --- | --- |
| Serverless-first APIs | Bursty traffic, many small integrations | Cold start + vendor limits |
| Regional active-active | Global audiences, strict uptime | Data consistency + operational complexity |
| Edge caching | Read-heavy personalization | Stale content + invalidation discipline |

## How DigiiMark fits

We wire **marketing automation** into modern stacks without brittle glue code: clear contracts between CMS, CRM, analytics, and AI services—so launches are repeatable, not heroic.

> **Takeaway:** Treat latency, failover, and observability as product requirements. When infra is boring, campaigns get brave.

If you want a concrete architecture review for your next launch window, we map the critical path in a week—not a quarter.
$markdown$,
    true,
    now() - interval '3 days',
    1
  ),
  (
    'AI Lead Qualification for Real Estate Teams',
    'ai-lead-qualification-real-estate',
    'How agencies use AI agents to respond in seconds and route hot buyers to closers.',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    $markdown$# AI lead qualification for real estate teams

Real estate still runs on relationships—but the **first five minutes** are increasingly automated. Buyers compare agencies by responsiveness, clarity, and how easy it is to move from curiosity to a qualified tour.

## The baseline buyers expect now

- **Sub-minute acknowledgment** on web and paid leads
- **Structured triage** that respects fair housing and brokerage policies
- **Calendar handoff** that actually books—not “someone will call you”

## A practical qualification playbook

1. **Instant intake** — Capture intent, budget band, timeline, and preferred neighborhoods with conversational prompts (not a wall of fields).
2. **Routing rules** — Hot leads to closers; nurture leads to sequences; ambiguous leads to a human review queue with full transcript context.
3. **CRM truth** — HubSpot, Salesforce, or custom stacks stay synchronized so no lead disappears between marketing and brokerage ops.

## What “good” looks like in reporting

Measure **speed-to-first-human**, **tour booking rate**, and **lead-to-appointment**—not vanity chat counts. AI should increase qualified conversations, not chatter.

| Metric | Why it matters |
| --- | --- |
| Median first response time | Correlates with conversion in competitive markets |
| Qualified tour rate | Separates curiosity from intent |
| Agent time saved | Proves automation is lifting capacity |

## Closing thought

AI should **amplify** agents: faster triage, cleaner handoffs, and fewer dropped balls. The goal is not to remove humans—it is to remove the scramble.

DigiiMark connects the stack end-to-end so your team spends time closing, not copy-pasting between tools.
$markdown$,
    true,
    now() - interval '6 days',
    2
  ),
  (
    'Design Systems That Survive a Rebrand',
    'design-systems-b2b-rebrand',
    'Tokens, components, and governance patterns that keep product and marketing aligned.',
    'https://images.unsplash.com/photo-1614729939124-032f0b5609ce?auto=format&fit=crop&q=80&w=1200',
    $markdown$# Design systems that survive a rebrand

Rebrands break fragile UI libraries because they confuse **surface changes** with **contract changes**. A durable system anchors on tokens, accessibility, and release discipline—so marketing and product can move together without forked chaos.

## Why systems fail during brand shifts

- Color and type updates ripple across dozens of components with no single source of truth.
- “One-off” campaign pages bypass components and reintroduce inconsistency.
- Accessibility regressions appear when contrast ratios and focus states are not part of the migration checklist.

## Checklist for a resilient system

- **Tokens first** — Semantic naming (`action.primary`, `surface.muted`) survives palette rotations better than `orange-500`.
- **Regression gates** — Visual and interaction tests on checkout, signup, pricing, and any flow tied to revenue.
- **Documentation marketing can use** — Practical examples, do/don’t guidance, and approved composition patterns—not a Storybook graveyard.

## Governance without bureaucracy

Use **owners**, **RFCs for breaking changes**, and a predictable release train. Small frequent updates beat annual “big bang” migrations.

> **Takeaway:** A rebrand is a migration project. Treat it like one: inventory surfaces, define token mapping, and measure accessibility before you celebrate the new palette.

DigiiMark helps teams ship **coherent** acquisition experiences—landing pages, dashboards, and email systems that share the same design language under pressure.
$markdown$,
    true,
    now() - interval '10 days',
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  seo_title = EXCLUDED.seo_title,
  meta_description = EXCLUDED.meta_description,
  hero_image = EXCLUDED.hero_image,
  body_content = EXCLUDED.body_content,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 2) Link blogs ↔ content_categories (many-to-many)
INSERT INTO public.blog_content_categories (blog_id, content_category_id)
SELECT b.id, c.id
FROM public.blogs b
CROSS JOIN public.content_categories c
WHERE b.slug = 'future-cloud-infrastructure-2026'
  AND c.slug IN ('technology', 'ai')
ON CONFLICT DO NOTHING;

INSERT INTO public.blog_content_categories (blog_id, content_category_id)
SELECT b.id, c.id
FROM public.blogs b
CROSS JOIN public.content_categories c
WHERE b.slug = 'ai-lead-qualification-real-estate'
  AND c.slug IN ('industry', 'ai')
ON CONFLICT DO NOTHING;

INSERT INTO public.blog_content_categories (blog_id, content_category_id)
SELECT b.id, c.id
FROM public.blogs b
CROSS JOIN public.content_categories c
WHERE b.slug = 'design-systems-b2b-rebrand'
  AND c.slug IN ('design', 'development')
ON CONFLICT DO NOTHING;

-- 3) Sample case study ↔ content_categories (uses existing case_study rows by slug)
INSERT INTO public.case_study_content_categories (case_study_id, content_category_id)
SELECT cs.id, c.id
FROM public.case_studies cs
CROSS JOIN public.content_categories c
WHERE cs.slug = 'techflow-saas-platform'
  AND c.slug IN ('ai', 'development', 'data')
ON CONFLICT DO NOTHING;

INSERT INTO public.case_study_content_categories (case_study_id, content_category_id)
SELECT cs.id, c.id
FROM public.case_studies cs
CROSS JOIN public.content_categories c
WHERE cs.slug = 'retailpro-ecommerce-transformation'
  AND c.slug IN ('design', 'data', 'development')
ON CONFLICT DO NOTHING;
