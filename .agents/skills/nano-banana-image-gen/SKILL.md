---
name: nano-banana-image-gen
description: >-
  Generate and edit images using Google Nano Banana 2 (Gemini 3.1 Flash Image)
  API for the Digimark website. Handles hero banners, infographics, icons,
  illustrations, product mockups, charts, stickers, and text-heavy graphics.
  Use when the user asks to create, generate, edit, or produce any image,
  illustration, icon, infographic, chart, banner, or visual asset for the
  website or marketing materials.
---

# Nano Banana Image Generation for DigiiMark

Generate production-quality images for the DigiiMark website using Google's
Nano Banana 2 API (model: `gemini-3.1-flash-image-preview`).

**Before using this skill**, read the project skill at
`.agents/skills/digiimark-project/SKILL.md` to understand DigiiMark's brand,
colors, and design system. Use the brand colors from `STYLE_GUIDE.md` in prompts
(Ignite Orange #FF5722, navy #0A0A0A, etc.).

## Setup

### Environment

The API key must be set as `GEMINI_API_KEY` in the project `.env.local` file.
The utility script at `scripts/generate-image.ts` in this skill folder handles
all API calls.

### Install SDK

```bash
pnpm add @google/genai
```

### Quick test

```typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "A minimal icon of a rocket in flat vector style. White background.",
  config: { responseModalities: ["IMAGE"] },
});
```

## Core Prompt Formula

Every prompt should follow this six-part structure. Treat it as a creative
brief, not an adjective pile.

```
[Subject] — who or what the image is about
[Composition] — shot distance, angle, crop, aspect ratio
[Action or change] — what should happen in the scene
[Context] — environment, real-world logic, setting
[Style] — lighting, materials, color palette, mood
[Constraints + output intent] — locked details, exact text, things to avoid, purpose
```

**Key rules:**
- Describe the scene narratively; do not list disconnected keywords.
- Use positive framing: "empty street" not "no cars."
- One prompt = one main job. Split complex work into turns.
- For text in images: generate the copy first, then quote it exactly in the image prompt.
- Use photographic terms (lens, angle, f-stop) for realistic shots.

## Digimark Workflow Map

Pick the workflow that matches the job. Each links to a full template in
[reference.md](reference.md).

| Job | Workflow | Aspect Ratio | Resolution |
|-----|----------|-------------|------------|
| Website hero banner | Photorealistic scene or product hero | 16:9 | 2K |
| Service page illustration | Stylized illustration, white bg | 4:3 or 1:1 | 1K |
| Blog featured image | Editorial / photorealistic scene | 16:9 | 1K |
| Infographic | Factual layout prompt | 9:16 or 16:9 | 2K |
| Icon / sticker / logo | Stylized illustration, white bg | 1:1 | 1K |
| Social media post | Text-heavy poster workflow | 1:1 or 4:5 | 1K |
| Ad banner (wide) | Product hero + text | 21:9 or 16:9 | 2K |
| Ad banner (tall) | Product hero + text | 9:16 or 1:4 | 2K |
| Chart / diagram | Infographic workflow | 16:9 | 2K |
| Client project mockup | Product mockup + references | 4:3 | 2K |

## Transparent Background (Icons, Illustrations, Stickers)

Nano Banana 2 **cannot output true PNG alpha transparency**. Use this
two-step workaround:

### Step 1: Generate with solid white background

Add these constraints to your prompt:
- "The background must be pure white."
- "Sharp, clean edges with high contrast against the white background."
- "No shadows on the background. No gradients behind the subject."
- Style: "bold, clean outlines" for vector-style assets.

### Step 2: Remove background programmatically

After saving the PNG, use a background removal tool:

```typescript
// Option A: Use sharp + remove.bg API
// Option B: Use @imgly/background-removal (runs client-side)
// Option C: Post-process with Canvas API threshold on white pixels
```

For best results, generate at 2K resolution so edges stay crisp after removal.

## API Configuration Reference

### Model IDs

| Model | ID | Best for |
|-------|----|----------|
| Nano Banana 2 (default) | `gemini-3.1-flash-image-preview` | Most jobs, fast + cheap |
| Nano Banana Pro | `gemini-3-pro-image-preview` | Premium typography, 4K, complex |
| Nano Banana (legacy) | `gemini-2.5-flash-image` | High-volume, lowest latency |

### Aspect Ratios (Nano Banana 2)

`1:1`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`,
`8:1`, `9:16`, `16:9`, `21:9`

### Resolutions

`"512"` (0.5K), `"1K"` (default), `"2K"`, `"4K"` — use uppercase K.

### Response Modalities

- `['TEXT', 'IMAGE']` — default, returns text + image
- `['IMAGE']` — image only, no text

### Thinking Levels

- `"minimal"` — default, lowest latency
- `"High"` — better quality for complex prompts, slower

### Config Template (JavaScript)

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: prompt,
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      aspectRatio: "16:9",
      imageSize: "2K",
    },
    thinkingConfig: {
      thinkingLevel: "minimal",
    },
  },
});
```

## Workflow: Text-Heavy Graphics (Posters, Banners, Ads)

Text rendering is Nano Banana 2's strength (~91% OCR accuracy). Always use
the **two-step text-first workflow**:

**Turn 1** — Generate copy:
```
Write a 6-word headline and a 14-word subhead for a Digimark
digital marketing services launch poster.
```

**Turn 2** — Render the image with exact quoted text:
```
Create a 16:9 premium launch banner for Digimark, a digital marketing agency.
Clean modern studio look, dark navy background, soft gradient lighting.
Render the exact headline "GROW YOUR DIGITAL PRESENCE" in bold uppercase
white sans-serif near the top.
Render the exact subhead "Strategic SEO, web development, and brand design
that drives real results." below in smaller light gray text.
Leave breathing room on the right for a CTA button overlay.
Output intent: website hero banner.
```

## Workflow: Infographics and Charts

```
Create a 16:9 infographic explaining Digimark's SEO audit process.
Show these labeled steps from left to right: Technical Audit, Content
Analysis, Keyword Research, Competitor Benchmarking, Strategy Report.
Use a clean flat editorial style with wide margins, short labels,
thin connector lines, and the Digimark brand color (deep navy #1a1a2e).
Keep the diagram factual, readable, and scannable in 3 seconds.
Output intent: blog article graphic.
```

## Workflow: Icons and Stickers (White Background)

```
A flat vector icon representing "web development". Show a minimal browser
window with clean code brackets inside. Bold, clean outlines, simple
cel-shading. Color palette: navy (#1a1a2e) and electric blue (#4361ee).
The background must be pure white. No shadows. No gradients behind the icon.
Output intent: website service icon.
```

## Workflow: Product Mockups

```
A high-resolution, studio-lit product photograph of a laptop showing the
Digimark dashboard interface, presented on a clean white desk.
Three-point softbox lighting, soft diffused highlights, no harsh shadows.
Slightly elevated 45-degree camera angle. Ultra-realistic with sharp focus
on the screen content. 16:9 format.
Output intent: client portfolio showcase.
```

## Workflow: Editorial / Blog Images

```
A photorealistic wide shot of a modern co-working space where a diverse
team collaborates around a large screen showing analytics dashboards.
Warm natural light from floor-to-ceiling windows. Shot with a 35mm wide
lens, shallow depth of field on the foreground laptop.
Mood: energetic, professional, innovative.
Output intent: blog hero image for digital marketing article.
```

## Multi-Turn Editing

Use the chat API for iterative refinement. The model retains context.

```typescript
const chat = ai.chats.create({
  model: "gemini-3.1-flash-image-preview",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    tools: [{ googleSearch: {} }],
  },
});

let response = await chat.sendMessage({ message: "Create a ..." });
// Refine:
response = await chat.sendMessage({
  message: "Make the background darker. Keep everything else the same.",
  config: {
    imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
  },
});
```

## Google Search Grounding

For images that need real-world accuracy (weather, locations, current events):

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "Create an infographic showing current SEO trends for 2026",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    tools: [{ googleSearch: {} }],
  },
});
```

## Common Pitfalls

| Problem | Fix |
|---------|-----|
| Generic "AI look" | Add shot language, scene logic, material detail. Drop quality tags like "4K, ultra HD." |
| Broken text | Use text-first workflow. Quote exact strings. Keep hierarchy simple. |
| Edit changes too much | Name the single change, then list every locked element explicitly. |
| Reference images conflict | Give each image one role (subject / style / environment). Max 2-4 active references. |
| Scene too complex | Split into multi-turn: background first, then subject, then text layer. |
| Aspect ratio ignored | Known issue with edits. Re-specify aspect ratio in each turn's config. |

## Rate Limits

| Tier | Requests/min | Requests/day |
|------|-------------|-------------|
| Free | 15 | 1,500 |
| Paid | 2,000 | — |

## Utility Script

Run the generation script directly:

```bash
npx tsx .agents/skills/nano-banana-image-gen/scripts/generate-image.ts \
  --prompt "Your prompt here" \
  --output public/images/generated/my-image.png \
  --aspect-ratio "16:9" \
  --resolution "2K"
```

See [scripts/generate-image.ts](scripts/generate-image.ts) for the full
implementation and all available options.

## Additional Resources

- Full API examples and prompt templates: [reference.md](reference.md)
- Official docs: https://ai.google.dev/gemini-api/docs/image-generation
- Google Cloud prompting guide: https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana
- Cookbook: https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/Get_Started_Nano_Banana.ipynb
