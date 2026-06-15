# Brandtangent — Design System (Webflow-inspired)

> Visual web development platform aesthetic — confident professional product on a generous white canvas.

---

## Overview

Webflow positions itself as the visual web development platform — the marketing surface reads as a confident professional product, not a tech startup. The default page is a generous white canvas (`{colors.canvas}`) with a deep near-black `{colors.primary}` (`#080808`) for the brand's primary CTA, typography, and ink. Around this restrained primary, the brand layers a five-stop chromatic accent system — `{colors.accent-purple}` `#7a3dff`, `{colors.accent-pink}` `#ed52cb`, `{colors.accent-blue}` `#3b89ff`, `{colors.accent-orange}` `#ff6b00`, `{colors.accent-green}` `#00d722` — each mapped to one of the platform's product categories (design, CMS, hosting, ecommerce, etc.). These accents appear as full-card fills inside the product-category grid, not as button colours; the brand's primary CTA stays near-black.

Type carries the second decisive voice. The proprietary `WF Visual Sans Variable` family carries every display, body, and label role at weight 500 / 600 — the brand never goes heavier than semibold, never lighter than regular. Hero display sits at 80 px / weight 600 / `-0.8 px` tracking — confident but not shouting. Uppercase eyebrows in 15 px weight 500 with `1.5 px` positive tracking mark every section header.

The shape system is restrained. Buttons take a tight `{rounded.sm}` 4 px radius — neither pill nor square; the brand reads as engineered. Cards step up to `{rounded.md}` 8 px. Pill (`{rounded.full}` 9999 px) is reserved for circular icon containers. Layered drop-shadows on featured cards add modest elevation but never feel material-heavy.

**Key Characteristics:**
- A two-colour conversion hierarchy — `{colors.primary}` near-black for every primary CTA, white-on-hairline for every secondary. Chromatic accents are used as full surface fills on category cards, never as button backgrounds.
- The brand's signature is its **five-stop chromatic category palette**: purple / pink / blue / orange / green, each tied to a product surface. Used at full saturation as card fills.
- Hero typography at 80 px weight 600 with `-0.8 px` tracking — restrained, confident, never billboard-loud.
- WF Visual Sans Variable is the single family; the brand uses no separate sans for body / display. WFVisualSans-Mono / Inconsolata appears only for technical captions.
- Tight `{rounded.sm}` 4 px button geometry; cards at `{rounded.md}` 8 px. The brand never uses pill CTAs.
- Layered multi-offset drop-shadows on featured cards — the brand's only elevation cue.

## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#080808`): The brand's primary conversion colour. Every primary CTA, every heading, every wordmark. Deeper than pure black to read as branded.
- **Accent Purple** (`{colors.accent-purple}` — `#7a3dff`): One of the five chromatic category accents — used for design / build product surfaces.
- **Accent Pink** (`{colors.accent-pink}` — `#ed52cb`): Magenta accent — used for animation / interaction product surfaces.
- **Accent Blue** (`{colors.accent-blue}` — `#3b89ff`): Bright cyan-blue — used for SEO / analytics product surfaces.
- **Accent Blue Deep** (`{colors.accent-blue-deep}` — `#006acc`): The deeper blue used for emphasis links.
- **Accent Blue Info** (`{colors.accent-blue-info}` — `#146ef5`): The badge-info blue.
- **Accent Orange** (`{colors.accent-orange}` — `#ff6b00`): Used for hosting / infrastructure product surfaces.
- **Accent Green** (`{colors.accent-green}` — `#00d722`): Used for ecommerce / status-success surfaces.
- **Accent Yellow** (`{colors.accent-yellow}` — `#ffae13`): Used for warning / collaboration product surfaces.
- **Accent Red** (`{colors.accent-red}` — `#ee1d36`): Used for error / destructive states.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page background.
- **Hairline** (`{colors.hairline}` — `#d8d8d8`): 1 px solid borders — input borders, card chrome, divider lines.

### Text
- **Ink** (`{colors.ink}` — `#080808`): Default text and headings.
- **Ink Strong** (`{colors.ink-strong}` — `#222222`): Near-black emphasis.
- **Body** (`{colors.body}` — `#363636`): Default body paragraph color.
- **Body Mid** (`{colors.body-mid}` — `#5a5a5a`): Mid-emphasis secondary text — footer lines, captions.
- **Mute** (`{colors.mute}` — `#898989`): Lower-priority text.
- **Mute Soft** (`{colors.mute-soft}` — `#ababab`): The lightest text role — placeholder text, fine print.

### Semantic
- **Info Blue** (`{colors.accent-blue-info}` — `#146ef5`): Info badge / notification.
- **Success Green** (`{colors.accent-green}` — `#00d722`): Success indicators.
- **Warning Yellow** (`{colors.accent-yellow}` — `#ffae13`): Warning states.
- **Error Red** (`{colors.accent-red}` — `#ee1d36`): Validation / destructive.

## Typography

### Font Family
A single proprietary family carries every typographic role: **WF Visual Sans Variable** (with `Arial` system fallback). Weights 400 / 500 / 550 / 600 are present; the brand never uses 700 / 800 / 900. A monospace variant — **WFVisualSans-Mono** with `Inconsolata` fallback — handles rare technical caption moments and code-style labels. OpenType features `"ss02"`, `"ss10"`, `"zero"` are enabled in the mono variant for the styled zero glyph.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xxl}` | 80px | 600 | 83.2px | -0.8px | Hero headline. |
| `{typography.display-xl}` | 56px | 600 | 58.24px | 0 | Sub-hero displays. |
| `{typography.display-lg}` | 44.8px | 600 | 46.6px | 0 | Section headlines. |
| `{typography.display-md}` | 32px | 500 | 41.6px | 0 | Card-cluster headlines. |
| `{typography.display-sm}` | 24px | 500 | 31.2px | 0 | Sub-section displays. |
| `{typography.display-xs}` | 20px | 500 | 28px | 0 | Inline display micro-headings. |
| `{typography.eyebrow-uppercase}` | 15px | 500 | 19.5px | 1.5px | UPPERCASE eyebrow tags above sections. |
| `{typography.eyebrow-uppercase-sm}` | 12px | 500 | 12px | 0.6px | Small uppercase metadata. |
| `{typography.body-lg}` | 28.8px | 400 | 46.08px | -0.288px | Lead paragraphs. |
| `{typography.body-md}` | 16px | 400 | 25.6px | -0.16px | Default body. |
| `{typography.body-md-strong}` | 16px | 500 | 25.6px | -0.16px | Bolded inline body. |
| `{typography.body-sm}` | 14px | 400 | 22.4px | 0 | Secondary body. |
| `{typography.body-sm-strong}` | 14px | 500 | 22.4px | 0 | Bold caption / nav-link. |
| `{typography.caption}` | 12.8px | 550 | 15.36px | 0 | Badge labels (the brand's signature 550 weight). |
| `{typography.caption-mono}` | 12px | 400 | 18px | 0 | Mono code captions. |
| `{typography.button-md}` | 16px | 500 | 25.6px | -0.16px | Button labels. |

### Principles
- **Weight ceiling at 600.** The brand never uses 700+. Confident, not loud.
- **Negative tracking at display sizes.** `-0.8 px` at 80 px, scaling through. Tight kerning is part of the voice.
- **Uppercase eyebrows mark every section.** 15 px / weight 500 / `1.5 px` positive tracking is the brand's signature label style.
- **Single family across the system.** No separate display vs body face. The variable axes do the work.

### Note on Font Substitutes
WF Visual Sans Variable is proprietary. Open-source substitutes:
- **Display + body** — *Inter* weights 400 / 500 / 600 with `font-feature-settings: "ss01"` enabled is the closest stylistic match.
- **Mono** — *Inconsolata* (the documented fallback) or *DM Mono*.

## Layout

### Spacing System
- **Base unit**: 4 px (with frequent 0.4 / 0.8 sub-multiples for fine padding).
- **Tokens**: `{spacing.xxs}` 2 px · `{spacing.xs}` 4 px · `{spacing.sm}` 8 px · `{spacing.md}` 12 px · `{spacing.lg}` 16 px · `{spacing.xl}` 20 px · `{spacing.2xl}` 24 px · `{spacing.3xl}` 32 px.
- **Section padding**: hero / content bands use `{spacing.3xl}` 32 px gutters with generous vertical spacing.
- **Card interior padding**: feature and pricing cards sit at `{spacing.3xl}` 32 px.

### Grid & Container
- Marketing container is wide (effectively edge-to-edge with `{spacing.3xl}` gutters).
- Category card grid: 2 / 3-up at desktop with mixed sizing (some larger feature cards span 2 columns).
- Pricing tier grid: 3-up at desktop, 1-up at mobile.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 479px | Hero stacks; all grids 1-up. |
| Mobile-Large | 479–767px | Same as Mobile. |
| Tablet | 768–991px | 2-up grids. |
| Desktop | ≥ 992px | Full multi-up grids. |

#### Touch Targets
Buttons render at ~44 px (12 px vertical padding + 25.6 px line-height). WCAG AAA met.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default bands. |
| Level 1 — Hairline | 1 px solid `{colors.hairline}` border on `{colors.canvas}`. | Default card chrome and input borders. |
| Level 2 — Layered Drop | Multi-stop layered shadow with subtle warm offsets. | Featured cards needing visible lift. |
| Level 3 — Layered Drop Strong | Deeper version of Level 2. | Pricing / modal-level emphasis. |
| Level 4 — Heavy Modal | Extremely heavy multi-stop. | Modal / dialog surfaces. |

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands. |
| `{rounded.xs}` | 2px | Tight inline pills. |
| `{rounded.sm}` | 4px | The brand's canonical button + badge + small-element radius. |
| `{rounded.md}` | 8px | Card chrome and feature / category cards. |
| `{rounded.full}` | 9999px | Circular icon containers only. |

## Components

### Buttons

**`button-primary`** — the canonical near-black CTA.
- Background `{colors.primary}` (`#080808`), text `{colors.on-primary}` white, label `{typography.button-md}` (16 px weight 500), padding `{spacing.md} {spacing.xl}`, shape `{rounded.sm}` 4 px.

**`button-secondary`** — the white outline CTA.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}` border, same typography + padding + shape.

**`button-text-arrow`** — the underlined text-link CTA with arrow used in long-form sections.

**`button-icon-circular`** — the circular icon button for carousel controls.

### Cards & Containers

**`card-feature`** — the canonical feature card on canvas.
- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.hairline}`, padding `{spacing.3xl}`, shape `{rounded.md}`. Often elevated to Level 2 shadow when featured.

**`card-feature-dark`** — the polarity-flipped feature card on near-black.

**`category-card-purple`** / **`category-card-pink`** / **`category-card-blue`** / **`category-card-orange`** / **`category-card-green`** — full-fill chromatic category cards at `{rounded.md}`.

### Signature Bands

**`hero-band`** — white hero band with `{typography.display-xxl}` headline.

**`content-band`** — standard content band on canvas with `{typography.display-lg}` section headline.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (`#080808`) for every primary CTA, every heading, and every wordmark.
- Use the five chromatic accents as full-fill category cards, NOT as button backgrounds.
- Set hero headlines in `{typography.display-xxl}` weight 600 with `-0.8 px` tracking.
- Use `{rounded.sm}` 4 px for buttons, `{rounded.md}` 8 px for cards.

### Don't
- Don't promote button-medium weight to 700+. The brand's weight ceiling is 600.
- Don't use chromatic accents as button backgrounds.
- Don't render CTAs as pills.
- Don't introduce a sixth accent colour.
