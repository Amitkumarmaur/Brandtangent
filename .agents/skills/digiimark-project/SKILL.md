---
name: digiimark-project
description: >-
  Core project skill for the DigiiMark website. Provides brand context, tech
  stack, file structure, styling rules, and component patterns. Use this skill
  BEFORE creating any new page, component, section, or visual asset. Reference
  it when working on anything related to the DigiiMark site — layout, styling,
  content, new pages, or modifications to existing ones.
---

# DigiiMark Project Skill

## What is DigiiMark?

DigiiMark is an **AI-first marketing automation agency** that engineers
intelligent marketing systems for B2B companies. The website is a premium
agency site showcasing services, projects, and brand authority.

**Core positioning:** "We engineer intelligent marketing systems that scale
without limits."

**Target audience:** B2B founders, SaaS/FinTech/Enterprise companies, GCC
and global enterprises.

**Brand personality:** Engineering precision + design quality. Bold, confident,
outcome-driven. Systems thinking. Not a generic digital agency.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix primitives) |
| Motion | Framer Motion |
| 3D | Three.js + React Three Fiber |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Package manager | pnpm |
| Deploy | Vercel |

## Critical Files to Read First

Before making any change, read these files to understand the current state:

| File | What it contains |
|------|-----------------|
| `STYLE_GUIDE.md` | Complete design system: colors, typography, spacing, layout, buttons, rules |
| `app/globals.css` | All CSS custom properties and Tailwind theme tokens |
| `app/layout.tsx` | Root layout with fonts (Poppins + Inter), metadata, viewport |
| `public/style-guide.html` | Visual style guide (open in browser for reference) |

**Always read `STYLE_GUIDE.md` before creating or modifying any component.**

## File Structure

```
app/
├── layout.tsx            # Root layout (fonts, metadata)
├── page.tsx              # Homepage (composes all sections)
├── globals.css           # Design tokens, theme, utilities
├── services/
│   ├── web-development/  # Web dev service page
│   └── seo/              # SEO service page
└── projects/
    └── page.tsx          # Projects showcase

components/
├── header.tsx            # Site header/nav
├── footer.tsx            # Site footer
├── hero-section.tsx      # Homepage hero (H1)
├── trust-indicators.tsx  # Tech stack + globe + logos
├── about-us.tsx          # Founders + achievements
├── testimonial-section.tsx
├── services-scroll.tsx   # Service categories (dark)
├── projects-section.tsx  # Project portfolio
├── partners-section.tsx  # Partner logos
├── metrics-dashboard.tsx # Impact stats (dark)
├── blog-section.tsx      # Blog cards
├── clients-section.tsx   # Client logos (dark)
├── faq-section.tsx       # FAQ accordion
├── tech-globe.tsx        # 3D globe (Three.js)
├── ui/                   # shadcn/ui primitives
└── services/             # Service page sub-components

.agents/skills/
├── digiimark-project/    # THIS SKILL — project rules
└── nano-banana-image-gen/# Image generation with Nano Banana 2

public/
├── style-guide.html      # Visual style guide
└── images/               # Static assets
```

## Design System Quick Reference

### Colors (use tokens, never hardcoded hex)

| Token | Usage |
|-------|-------|
| `bg-ignite-orange` / `text-ignite-orange` | CTAs, accent dots, eyebrow labels |
| `bg-foreground` | Dark section backgrounds (#0A0A0A) |
| `bg-dark-surface` | Premium dark sections (#0F0F0F) |
| `bg-background` | White sections |
| `bg-grey-100` | Light alternating sections (#F8F8F8) |
| `border-grey-200` | Borders and dividers |
| `text-grey-400` | Body text, subtitles |
| `text-foreground` | Headings on light bg |
| `text-white` | Headings on dark bg |
| `bg-peach` / `bg-peach-light` | Warm accent panels |

### Typography

- **Headings:** `font-heading` (Poppins)
- **Body:** `font-sans` (Inter, default)
- **Code/stats:** `font-mono`
- **H1:** `text-3xl sm:text-4xl lg:text-[3.2rem] font-bold uppercase` (hero only)
- **H2:** `text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight`
- **H3:** `text-xl md:text-2xl font-semibold tracking-tight`
- **Eyebrow:** `w-2 h-2` orange dot + `text-sm uppercase tracking-wider font-medium`

### Section Pattern

```tsx
<section className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
  <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-ignite-orange" />
      <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
        Section Label
      </span>
    </div>
    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight">
      Section Title
    </h2>
    {/* Content */}
  </div>
</section>
```

### Rules

- One H1 per page (hero only). All sections use H2.
- Container: `max-w-7xl mx-auto px-6 lg:px-8` — never `container` or arbitrary widths.
- Section padding: `py-16 md:py-20`.
- Eyebrow dot: always `w-2 h-2`, always `mb-4`.
- Use `grey-*` tokens, never Tailwind's default `gray-*`.
- Use Next.js `<Image>`, never `<img>`.
- Framer Motion: always `viewport={{ once: true }}`.
- `"use client"` only when needed (state, motion, observers).

## When Creating a New Page

1. Read `STYLE_GUIDE.md` for the full design system.
2. Read `app/globals.css` for available color tokens.
3. Read `app/layout.tsx` to understand root layout and fonts.
4. Follow the section pattern above for every section.
5. Alternate section backgrounds: white → grey-100 → dark → white → etc.
6. One H1 in the hero, H2 for every section below.
7. Use existing components from `components/ui/` where possible.

## When Creating a New Component

1. Place it in `components/` (top-level for sections, `ui/` for primitives).
2. Use Server Components by default. Add `"use client"` only if needed.
3. Follow the heading hierarchy from `STYLE_GUIDE.md`.
4. Use design tokens from `globals.css` — no hardcoded colors.
5. Add Framer Motion entrance animations with `viewport={{ once: true }}`.

## When Modifying globals.css

If you add, remove, or change any CSS custom property in `app/globals.css`:

1. Update `STYLE_GUIDE.md` to reflect the change.
2. Update `public/style-guide.html` to reflect the change visually.
3. Check all components that reference the changed token.

## Available Skills

| Skill | Path | When to use |
|-------|------|-------------|
| **digiimark-project** | `.agents/skills/digiimark-project/` | Before ANY work on the site |
| **nano-banana-image-gen** | `.agents/skills/nano-banana-image-gen/` | When generating images, icons, illustrations, or visual assets |

## Environment Variables

| Variable | Purpose | File |
|----------|---------|------|
| `GEMINI_API_KEY` | Google Nano Banana 2 image generation | `.env.local` |

## Deployment

- **Platform:** Vercel
- **Build:** `pnpm build` (runs `next build`)
- **Dev:** `pnpm dev` (default port 3000)
