# Brandtangent — Visual Style Guide

> Webflow-inspired design system. Source of truth: `design.md` + `app/globals.css`.
> Every new page, section, and component **must** follow these patterns.

---

## 1. Color Palette

All colors are CSS custom properties in `app/globals.css`. **Never hardcode hex values.**

### Brand & Conversion

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Primary (Ink Black) | `#080808` | `bg-primary` `text-primary` | Primary CTAs, headings, wordmark |
| On Primary | `#FFFFFF` | `text-primary-foreground` | Text on primary buttons |

### Chromatic Category Accents (card fills only — never button backgrounds)

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Accent Purple | `#7A3DFF` | `bg-accent-purple` | Design / build surfaces |
| Accent Pink | `#ED52CB` | `bg-accent-pink` | Animation / interaction |
| Accent Blue | `#3B89FF` | `bg-accent-blue` | SEO / analytics |
| Accent Orange | `#FF6B00` | `bg-accent-orange` | Hosting / infrastructure |
| Accent Green | `#00D722` | `bg-accent-green` | Ecommerce / success |

### Surface & Text

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Canvas | `#FFFFFF` | `bg-background` `bg-canvas` | Page background |
| Hairline | `#D8D8D8` | `border-border` | Card chrome, inputs, dividers |
| Ink | `#080808` | `text-foreground` `text-ink` | Headings, default text |
| Body | `#363636` | `text-body` | Paragraphs |
| Body Mid | `#5A5A5A` | `text-body-mid` | Footer, captions |
| Mute | `#898989` | `text-muted-foreground` | Secondary text |

### Color Rules

- **Primary CTAs** are always near-black (`bg-primary`), never chromatic accents.
- **Accent Orange** (`#FF6B00`, `accent-orange`) — interactive highlights: link hovers, filter pills, featured badges, eyebrow dots, contact widget FAB, explore links. Not primary form CTAs.
- **Chromatic accents** (purple / pink / blue / orange / green) are full-fill category cards (`.category-card-*`), not button backgrounds.
- **Light sections:** `bg-background`. Text: `text-foreground` for headings, `text-body` / `text-muted-foreground` for body.

---

## 2. Typography

### Scale (CSS variables in `globals.css`)

| Class | Desktop max | Use |
|-------|-------------|-----|
| `.display-xxl` | 56px | Homepage & page heroes only |
| `.display-xl` | 42px | Page titles (blog, about, services) |
| `.display-lg` | 32px | Section H2 headings |
| `.display-md` | 20px | Card titles, pull quotes |
| `.display-sm` | 18px | Sub-section headings, stat labels |
| `.text-subtitle` | 16px | Hero / section descriptions |
| `.body-md` | 16px | Default body copy |
| `.body-sm` | 14px | Secondary text, nav links |

**Do not use** raw Tailwind `text-4xl`–`text-8xl`. Use the utility classes above.

Weight ceiling: **600** (`font-semibold`). Never `font-bold` / 700+.

---

## 3. Layout & Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-3xl` | 32px | Section gutters, card padding |
| `--space-xl` | 20px | Button horizontal padding |
| `--space-md` | 12px | Button vertical padding |

**Container:** `max-w-7xl mx-auto px-6 lg:px-8` (maps to 32px gutters at lg).

**Section padding:** `py-16 md:py-20`.

**Breakpoints:** Mobile `<479px`, Tablet `768–991px`, Desktop `≥992px`.

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Buttons, inputs, badges |
| `rounded-md` | 8px | Cards |
| `rounded-full` | 9999px | Circular icon containers only |

**Never use pill CTAs.**

---

## 5. Elevation

| Level | CSS variable | Usage |
|-------|--------------|-------|
| Hairline | `border border-border` | Default cards |
| Layered | `var(--shadow-layered)` | Featured cards |
| Strong | `var(--shadow-layered-strong)` | Pricing / emphasis |
| Modal | `var(--shadow-modal)` | Dialogs |

Utility classes: `.card-feature`, `.card-feature-elevated`, `.card-feature-dark`.

---

## 6. Buttons

Use `@/components/ui/button` or primitive classes:

| Variant | Style |
|---------|-------|
| `default` | Near-black fill, white text, `rounded-sm` |
| `outline` | White fill, hairline border, ink text |
| `ghost` | Transparent, muted text |

Primary: `bg-primary text-primary-foreground rounded-sm font-medium`.

---

## 7. Signature Components

| Class | Purpose |
|-------|---------|
| `.hero-band` | White hero section |
| `.content-band` | Standard content section |
| `.category-card-purple` … `.category-card-green` | Full-fill chromatic cards |
| `.text-input` | Form inputs |
| `.pill-tag` | Uppercase eyebrow label (not a pill shape) |

---

## 8. Component Checklist

- [ ] Colors use tokens (`bg-primary`, `text-body`, not hex)
- [ ] Primary CTA is near-black, not accent-colored
- [ ] Buttons use `rounded-sm`, not `rounded-full`
- [ ] Headings use display utilities; weight ≤ 600
- [ ] Eyebrows use `.eyebrow-uppercase` or `.text-eyebrow`
- [ ] Cards use `rounded-md` + hairline border
- [ ] Images use Next.js `<Image>`
- [ ] Motion uses `motion/react` with `viewport={{ once: true }}`

---

## 9. Keeping References in Sync

When you modify `app/globals.css`, also update:

1. `design.md` — design spec reference
2. `STYLE_GUIDE.md` — this file
3. `public/style-guide.html` — visual style guide
