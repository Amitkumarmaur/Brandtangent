# DigiiMark — Visual Style Guide

> Single source of truth for design decisions across the DigiiMark website.
> Every new page, section, and component **must** follow these patterns.

---

## 1. Color Palette

All colors are defined as CSS custom properties in `app/globals.css` and exposed
as Tailwind tokens. **Never use hardcoded hex values.** Always use the token classes below.

### Brand Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Ignite Orange | `#FF5722` | `text-ignite-orange` `bg-ignite-orange` `border-ignite-orange` | Primary CTAs, accent dots, eyebrow labels, hover states |
| Success Green | `#10B981` | `text-success` `bg-success` | Positive metrics, checkmarks, success states |

### Neutrals (Grey Scale)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Grey 50 | `#FAFAFA` | `bg-grey-50` | Barely-off-white backgrounds |
| Grey 100 | `#F8F8F8` | `bg-grey-100` | Alternating section backgrounds (light) |
| Grey 200 | `#E5E5E5` | `border-grey-200` `bg-grey-200` | Borders, dividers, section separators |
| Grey 300 | `#C4C4C4` | `text-grey-300` `border-grey-300` | Disabled states, lighter borders |
| Grey 400 | `#7D7D7D` | `text-grey-400` | Body text (secondary), subtitles, descriptions |
| Grey 600 | `#4A4A4A` | `text-grey-600` | Body text (primary on light bg), strong captions |
| Grey 800 | `#1A1A1A` | `bg-grey-800` | Card surfaces on dark sections |
| Grey 900 | `#0A0A0A` | `bg-grey-900` | Deepest black surfaces |

### Semantic Colors

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Foreground | `#0A0A0A` | `text-foreground` `bg-foreground` | Primary text, dark section backgrounds |
| Background | `#FFFFFF` | `bg-background` | Page body, light sections |
| Dark Surface | `#0F0F0F` | `bg-dark-surface` | Premium dark sections (About, etc.) |

### Accent / Warm Tones

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Peach Light | `#FFF5F0` | `bg-peach-light` | Warm panel backgrounds, hero cards |
| Peach | `#FFD2B8` | `bg-peach` | Warm accents, folder-tab elements |

### Color Rules

- **Light sections:** `bg-background` or `bg-grey-100`. Text: `text-foreground` for headings, `text-grey-400` for body.
- **Dark sections:** `bg-foreground` or `bg-dark-surface`. Text: `text-white` for headings, `text-grey-400` or `text-white/60` for body.
- **Accent color** is always `ignite-orange`. Never use it as a section background (use `bg-dark-surface` instead).
- **Never use** Tailwind's default `gray-*` scale. Always use the custom `grey-*` tokens.

---

## 2. Typography

### Font Families

| Family | Token | Tailwind Class | Usage |
|--------|-------|----------------|-------|
| **Poppins** | `--font-heading` | `font-heading` | All headings (H1–H3), eyebrow labels, brand name |
| **Inter** | `--font-sans` | `font-sans` (default) | Body text, buttons, navigation, UI elements |
| **Geist Mono** | `--font-mono` | `font-mono` | Code snippets, technical labels, stat numbers |

### Heading Hierarchy

Every page must follow this heading structure. Never skip levels (e.g., H2 → H4).

#### H1 — Page Hero (one per page)

```tsx
<h1 className="font-heading text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.5rem] leading-[1.0] font-bold tracking-[-0.03em] uppercase text-foreground">
```

- **Weight:** `font-bold`
- **Case:** `uppercase`
- **Scale:** 3xl → 4xl → ~3.2rem → ~3.5rem
- **Usage:** Homepage hero, service page heroes

#### H2 — Section Title (one per section)

```tsx
<h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-tight">
```

- **Weight:** `font-semibold`
- **Scale:** 3xl → 4xl → 5xl (consistent across all sections)
- **Tracking:** `tracking-tight`
- **Leading:** `leading-tight`
- **On dark bg:** Replace `text-foreground` with `text-white`
- **Width constraint:** Add `max-w-3xl` or `max-w-4xl` if text wraps beyond 2 lines

#### H3 — Card/Component Title

```tsx
<h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground tracking-tight">
```

- **Weight:** `font-semibold`
- **Scale:** xl → 2xl
- **On dark bg:** Replace `text-foreground` with `text-white`

#### Eyebrow Label (above H2)

```tsx
<div className="flex items-center gap-2 mb-4">
  <div className="w-2 h-2 rounded-full bg-ignite-orange" />
  <span className="font-heading text-ignite-orange font-medium tracking-wider text-sm uppercase">
    Section Label
  </span>
</div>
```

- **Dot:** `w-2 h-2 rounded-full bg-ignite-orange` — always this exact size, no animation
- **Text:** `text-sm uppercase tracking-wider font-medium`
- **Color:** `text-ignite-orange` on light bg; `text-ignite-orange` or `text-white` on dark bg
- **Spacing:** `mb-4` below the eyebrow row (consistent everywhere)

#### Subtitle (below H2, optional)

```tsx
<p className="mt-4 text-lg text-grey-400 max-w-2xl">
  Supporting description text here.
</p>
```

- **Scale:** `text-lg`
- **Color:** `text-grey-400`
- **Spacing:** `mt-4` from the H2
- **Width:** `max-w-2xl` to keep lines readable

#### Body Text

```tsx
<p className="text-base md:text-lg text-grey-400 leading-relaxed">
```

- **Scale:** `text-base md:text-lg`
- **Color:** `text-grey-400` (light bg) or `text-white/60` (dark bg)
- **Leading:** `leading-relaxed`
- **Weight:** default (`font-normal`)

---

## 3. Section Layout

### Standard Section Wrapper

Every major section on any page should use this pattern:

```tsx
<section className="relative w-full py-16 md:py-20 bg-background overflow-hidden border-t border-grey-200">
  <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
    {/* Eyebrow + H2 + Content */}
  </div>
</section>
```

### Section Anatomy

```
┌─────────────────────────────────────────────┐
│  section  (py-16 md:py-20, bg-*, border-t)  │
│  ┌──────────────────────────────────────┐    │
│  │  container  (max-w-7xl, px-6 lg:px-8)│    │
│  │                                      │    │
│  │  ● EYEBROW LABEL         (mb-4)     │    │
│  │  H2 Section Title                    │    │
│  │  Subtitle (optional)      (mt-4)     │    │
│  │                                      │    │
│  │  ─── Content area ───  (mt-8/mt-12)  │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Section Padding

| Section type | Padding |
|-------------|---------|
| Standard | `py-16 md:py-20` |
| Hero | Custom per page (includes `pt-24` for header offset) |
| Compact (trust bar, etc.) | `py-10 lg:py-12` |

### Container

Always: `max-w-7xl mx-auto px-6 lg:px-8`

Never use:
- `container` (Tailwind default)
- `max-w-[1300px]` or `max-w-[1500px]` (arbitrary)
- `px-4` (too tight on desktop)

### Section Background Alternation

Alternate between light and dark for visual rhythm:

```
Hero             → bg-white (custom)
Trust Indicators → bg-grey-100
About            → bg-dark-surface (dark)
Testimonials     → bg-background (white)
Services         → bg-foreground (dark)
Projects         → bg-grey-100
Partners         → bg-background (white)
Metrics          → bg-foreground (dark)
Blog             → bg-grey-100
Clients          → bg-foreground (dark)
FAQ              → bg-background (white)
Footer           → bg-foreground (dark)
```

### Section Borders

- **Light sections:** `border-t border-grey-200` (subtle top border)
- **Dark sections:** `border-t border-white/10` or no border
- **Between same-bg sections:** Always add border for visual separation

---

## 4. Spacing Scale

Use consistent spacing tokens. These are the primary values used:

| Purpose | Classes |
|---------|---------|
| Eyebrow → H2 | `mb-4` on eyebrow wrapper |
| H2 → subtitle | `mt-4` on subtitle |
| H2/header → content | `mb-8 md:mb-10` or `mb-8 md:mb-12` |
| Between cards | `gap-6` or `gap-8` |
| Card internal padding | `p-6` or `p-8` |
| Section top border pad | Included in `py-16 md:py-20` |

---

## 5. Borders & Corners

| Element | Pattern |
|---------|---------|
| Cards / containers | `rounded-2xl` or `rounded-[1.5rem]` |
| Buttons / pills | `rounded-full` |
| Section borders | `border border-grey-200` (light) or `border-white/10` (dark) |
| Avatar borders | `border-[3px] border-white` |
| Input borders | `border border-grey-200 focus:border-ignite-orange` |

---

## 6. Buttons

### Primary CTA

```tsx
<button className="bg-ignite-orange text-white font-medium px-6 py-3 rounded-full hover:bg-ignite-orange/90 transition-colors">
  Start Automating
</button>
```

### Secondary / Outline

```tsx
<button className="border border-grey-200 text-foreground font-medium px-6 py-3 rounded-full hover:bg-grey-100 transition-colors">
  Learn More
</button>
```

### Ghost (on dark bg)

```tsx
<button className="border border-white/20 text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
  View All
</button>
```

---

## 7. Utility Classes (from globals.css)

| Class | What it does |
|-------|-------------|
| `.gradient-mesh` | Subtle orange/green radial gradient overlay |
| `.grid-pattern` | 50px white grid on dark backgrounds |
| `.scrollbar-hide` | Hides scrollbar for horizontal carousels |

### Grid overlay (inline alternative)

For subtle grid textures on dark sections:

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  }}
/>
```

---

## 8. Animation Patterns (Framer Motion)

### Standard entrance

```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
transition={{ duration: 0.6 }}
```

### Stagger children

```tsx
// Parent
variants={{ visible: { transition: { staggerChildren: 0.1 } } }}

// Child
variants={{
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}}
```

### Performance rules

- Always use `viewport={{ once: true }}` to prevent re-triggering
- Use `margin: "-100px"` to start animation slightly before element enters view
- Keep `"use client"` to the component level, not the page level
- Avoid animating `layout` properties; prefer `opacity` and `transform`

---

## 9. Image Rules

- **Always** use Next.js `<Image>` component — never `<img>`
- Provide explicit `width` and `height`, or use `fill` with `className="object-cover"`
- Write meaningful, keyword-rich `alt` text for SEO
- Use `loading="lazy"` by default (Next.js does this automatically)
- Store images in `/public/` with descriptive filenames

---

## 10. Component Checklist

Before merging any new section or page, verify:

- [ ] H1 exists only once per page (in the hero)
- [ ] H2 uses the standard scale: `text-3xl md:text-4xl lg:text-5xl font-semibold`
- [ ] Eyebrow uses `w-2 h-2` orange dot + `text-sm uppercase tracking-wider` label
- [ ] Eyebrow has `mb-4` spacing
- [ ] Section uses `py-16 md:py-20` padding
- [ ] Container uses `max-w-7xl mx-auto px-6 lg:px-8`
- [ ] No hardcoded hex colors (use tokens)
- [ ] No Tailwind `gray-*` classes (use `grey-*`)
- [ ] Dark sections use `text-white` for headings, `text-grey-400` for body
- [ ] Borders use `border-grey-200` (light) or `border-white/10` (dark)
- [ ] Images use `<Image>` with proper alt text
- [ ] Animations use `viewport={{ once: true }}`
- [ ] Client directive (`"use client"`) only where needed
