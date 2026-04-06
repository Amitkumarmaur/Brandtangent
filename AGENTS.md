# DigiiMark Website — Agent Instructions

> Read this file first before doing any work on this project.

## Project Overview

This is the website for **DigiiMark**, an AI-first marketing automation agency.
Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.

## Mandatory Reading

Before creating or modifying ANY file, read these in order:

1. **`.agents/skills/digiimark-project/SKILL.md`** — Project context, tech stack, file structure, component patterns, and all design rules.
2. **`STYLE_GUIDE.md`** — Complete design system: colors, typography, spacing, layout, buttons, borders, animation patterns, and the component checklist.
3. **`app/globals.css`** — All CSS custom properties and Tailwind theme tokens. This is the source of truth for every color, font, and utility class.

## Design System Enforcement

Every component, page, and section **must** follow the patterns documented in
`STYLE_GUIDE.md`. Key rules:

- **Colors:** Use tokenized classes (`bg-ignite-orange`, `text-grey-400`, `bg-foreground`). Never hardcode hex values.
- **Typography:** `font-heading` (Poppins) for headings, `font-sans` (Inter) for body. H2 scale: `text-3xl md:text-4xl lg:text-5xl font-semibold`.
- **Layout:** Container is always `max-w-7xl mx-auto px-6 lg:px-8`. Section padding is `py-16 md:py-20`.
- **Eyebrow labels:** `w-2 h-2` orange dot + `text-sm uppercase tracking-wider` text, with `mb-4`.
- **Images:** Always use Next.js `<Image>`, never `<img>`.
- **Animations:** Framer Motion with `viewport={{ once: true }}`.

## Keeping References in Sync

When you modify `app/globals.css` (add/remove/change tokens), you **must** also update:
1. `STYLE_GUIDE.md` — the markdown design system reference
2. `public/style-guide.html` — the visual style guide

When you add a new page or major component, update the file structure section in
`.agents/skills/digiimark-project/SKILL.md`.

## Available Skills

Skills are in `.agents/skills/`. Read the relevant SKILL.md before using:

| Skill | Purpose |
|-------|---------|
| `digiimark-project` | Core project rules, patterns, and file structure |
| `nano-banana-image-gen` | Generate images using Google Nano Banana 2 API |

## Quick Commands

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
```
