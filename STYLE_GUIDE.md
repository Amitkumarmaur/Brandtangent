# DigiiMark Digital Agency: Official Style Guide

This document serves as the single source of truth for the DigiiMark design system and development standards. All future pages, components, and UI elements must strictly adhere to these patterns to ensure a high-end, consistent, and performant user experience.

---

## 1. Color Palette (Tailwind Tokens)

We use centralized color variables defined in `app/globals.css`. **Never use hardcoded hex values** (e.g., `#FF5722`, `#0A0A0A`). Always use the following Tailwind classes:

### Base Colors
- **Foreground (Text/Dark Backgrounds):** `text-foreground`, `bg-foreground` (Maps to `#0A0A0A` / Almost Black)
- **Background (Main App Body):** `bg-background` (Maps to `#ffffff` / White)

### Brand Colors
- **Ignite Orange:** `text-ignite-orange`, `bg-ignite-orange`, `border-ignite-orange` (Maps to `#FF5722`)
  - *Usage:* Primary CTAs, accent lines, hover states, icons.
- **Success Green:** `text-success`, `bg-success` (Maps to `#10B981`)
  - *Usage:* Positive metrics, checkmarks, success states.

### Grayscale (Surface & Borders)
- **Grey 100:** `bg-grey-100` (Maps to `#F5F7F9` or `#f8f8f8`)
  - *Usage:* Subtle off-white backgrounds for alternating sections (e.g., Services Grid, Trust Indicators).
- **Grey 200:** `border-grey-200`, `bg-grey-200` (Maps to `#E5E5E5`)
  - *Usage:* Standard borders for cards, inputs, and section dividers.
- **Grey 400:** `text-grey-400` (Maps to `#7D7D7D` or `#A0A0A0`)
  - *Usage:* Secondary text, subtitles, descriptions, placeholders.
- **Grey 600:** `text-grey-600`, `border-grey-600` (Maps to `#4A4A4A`)
- **Grey 800:** `bg-grey-800` (Maps to `#1A1A1A`)
  - *Usage:* Elevated surfaces in Dark Mode (e.g., Metrics Dashboard cards).

---

## 2. Typography & Heading Hierarchy

All layouts must follow strict HTML semantic practices for SEO and accessibility.
- **Font Family:** Global sans-serif (Inter/Geist) defined in `layout.tsx`.
- **H1:** Reserved for the Hero Section *only* (`<h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.5rem] font-bold">`).
- **H2:** Main section titles (`<h2 className="text-3xl md:text-5xl font-bold">`).
- **H3:** Component-level titles (e.g., Card titles, sub-sections). *Never skip from H2 to H4.*
- **Body Text:** Standard readability (`<p className="text-base md:text-lg text-grey-400">`).

---

## 3. Spacing & Layout Rhythm

Visual consistency is driven by standard section padding and container constraints.

### Section Wrappers
Every new major section should use this wrapper:
```tsx
<section className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
  <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    {/* Content */}
  </div>
</section>
```
- **Vertical Padding:** Always use `py-16 md:py-20` for standard sections.
- **Container Width:** Always use `max-w-7xl mx-auto px-6 lg:px-8`.

### Borders & Corners
- **Cards/Containers:** Moderate to high rounded corners (`rounded-2xl` or `rounded-[1.5rem]`). High-radius buttons/pills: `rounded-full` or `rounded-[2rem]`.
- **Borders:** Thin, subtle borders: `border border-grey-200`.

---

## 4. Performance & SEO Guidelines

### Images
- **Rule:** Never use the native `<img>` tag.
- **Standard:** Use Next.js `<Image>` component for automatic WebP conversion, sizing, and lazy loading.
- **Implementation:** Always provide `width` and `height` properties or use `fill` with `className="object-cover"`. Provide meaningful, keyword-rich `alt` text.

### Client vs Server Components
- **Rule:** Use `"use client"` *only* when necessary (e.g., Framer Motion animations, state `useState`, or intersection observers). Keep text-heavy pages and outer layout shells as Server Components.

### Framer Motion Animations
- **Standard Entrance:** `initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}`.
- **Performance:** Use `useInView(ref, { once: true, margin: "-100px" })` to trigger animations only when elements enter the screen, reducing main thread blocking on initial paint.
