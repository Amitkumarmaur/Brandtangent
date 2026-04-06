# Nano Banana 2 API Reference

Complete API reference, prompt templates, and configuration details for
image generation with Google Nano Banana 2 (Gemini 3.1 Flash Image).

## JavaScript/TypeScript API Examples

### Basic text-to-image

```typescript
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "Your prompt here",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      aspectRatio: "16:9",
      imageSize: "2K",
    },
  },
});

for (const part of response.candidates[0].content.parts) {
  if (part.text) {
    console.log(part.text);
  } else if (part.inlineData) {
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync("output.png", buffer);
  }
}
```

### Image editing (text + image input)

```typescript
import * as fs from "node:fs";

const imageData = fs.readFileSync("input.png");
const base64Image = imageData.toString("base64");

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: [
    { text: "Change the background to a sunset gradient. Keep everything else the same." },
    { inlineData: { mimeType: "image/png", data: base64Image } },
  ],
  config: { responseModalities: ["TEXT", "IMAGE"] },
});
```

### Multi-turn chat editing

```typescript
const chat = ai.chats.create({
  model: "gemini-3.1-flash-image-preview",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    tools: [{ googleSearch: {} }],
  },
});

// Turn 1: Generate base image
let response = await chat.sendMessage({
  message: "Create a vibrant infographic explaining Digimark's 5-step SEO process.",
});

// Turn 2: Edit in same conversation
response = await chat.sendMessage({
  message: "Update this infographic to Spanish. Do not change layout, icons, or colors.",
  config: {
    imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
  },
});
```

### Multiple reference images

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: [
    { text: "Create a marketing banner combining the logo from Image A with the photography style from Image B." },
    { inlineData: { mimeType: "image/png", data: logoBase64 } },
    { inlineData: { mimeType: "image/jpeg", data: styleRefBase64 } },
  ],
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
  },
});
```

### Google Search grounding

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "Create an infographic of top 5 SEO trends for 2026 based on current data",
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    tools: [{ googleSearch: {} }],
    imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
  },
});
```

### Image Search grounding (Nano Banana 2 only)

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "A detailed illustration of the Digimark office building inspired by modern tech company headquarters",
  config: {
    responseModalities: ["IMAGE"],
    tools: [{
      googleSearch: {
        searchTypes: {
          webSearch: {},
          imageSearch: {},
        },
      },
    }],
  },
});
```

### Thinking mode (high quality)

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-image-preview",
  contents: "A complex isometric city scene with labeled buildings",
  config: {
    responseModalities: ["IMAGE"],
    thinkingConfig: {
      thinkingLevel: "High",
      includeThoughts: false,
    },
  },
});
```

### REST API (cURL)

```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "Your prompt here"}]}],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "imageConfig": {
        "aspectRatio": "16:9",
        "imageSize": "2K"
      }
    }
  }'
```

---

## Complete Aspect Ratio Table (Nano Banana 2)

| Ratio | 512 | 1K | 2K | 4K |
|-------|-----|-----|-----|-----|
| 1:1 | 512x512 | 1024x1024 | 2048x2048 | 4096x4096 |
| 1:4 | 256x1024 | 512x2048 | 1024x4096 | 2048x8192 |
| 1:8 | 192x1536 | 384x3072 | 768x6144 | 1536x12288 |
| 2:3 | 424x632 | 848x1264 | 1696x2528 | 3392x5056 |
| 3:2 | 632x424 | 1264x848 | 2528x1696 | 5056x3392 |
| 3:4 | 448x600 | 896x1200 | 1792x2400 | 3584x4800 |
| 4:1 | 1024x256 | 2048x512 | 4096x1024 | 8192x2048 |
| 4:3 | 600x448 | 1200x896 | 2400x1792 | 4800x3584 |
| 4:5 | 464x576 | 928x1152 | 1856x2304 | 3712x4608 |
| 5:4 | 576x464 | 1152x928 | 2304x1856 | 4608x3712 |
| 8:1 | 1536x192 | 3072x384 | 6144x768 | 12288x1536 |
| 9:16 | 384x688 | 768x1376 | 1536x2752 | 3072x5504 |
| 16:9 | 688x384 | 1376x768 | 2752x1536 | 5504x3072 |
| 21:9 | 792x168 | 1584x672 | 3168x1344 | 6336x2688 |

**Token costs per resolution:** 512 = 747 tokens, 1K = 1120, 2K = 1680, 4K = 2520.

---

## Recommended Aspect Ratios by Use Case

| Use case | Ratio | Resolution | Why |
|----------|-------|-----------|-----|
| Website hero banner | 16:9 | 2K | Standard widescreen, high quality |
| Blog featured image | 16:9 | 1K | Widescreen, fast generation |
| Social media square | 1:1 | 1K | Instagram, Facebook feed |
| Social media story | 9:16 | 1K | Instagram/TikTok stories |
| Service page icon | 1:1 | 1K | Square icons, consistent sizing |
| Tall infographic | 9:16 or 2:3 | 2K | Vertical scrolling content |
| Wide infographic | 16:9 or 21:9 | 2K | Horizontal data layout |
| Ad banner (leaderboard) | 8:1 or 4:1 | 1K | Wide thin banners |
| Ad banner (skyscraper) | 1:4 or 1:8 | 1K | Tall thin banners |
| Print / large format | 3:2 or 4:3 | 4K | High-res for print |
| Client portfolio mockup | 4:3 or 16:9 | 2K | Landscape showcase |
| Email header | 21:9 | 1K | Wide email banners |

---

## Complete Prompt Templates

### 1. Website Hero Banner

```
Create a 16:9 premium website hero banner for Digimark, a digital
marketing agency. The scene shows a dynamic abstract visualization of
data flowing between connected digital devices — laptops, phones, and
dashboards — floating in a sleek dark navy (#1a1a2e) environment.
Soft blue (#4361ee) and white accent lighting creates depth.
Clean modern aesthetic with generous negative space on the left third
for headline text overlay.
No text in the image. No lorem ipsum. No UI chrome.
Output intent: website homepage hero background.
```

### 2. Service Page Illustration (with white background)

```
A flat vector illustration representing "Search Engine Optimization."
Show a stylized magnifying glass examining a web browser window with
upward-trending graph lines and keyword tags floating around it.
Bold, clean outlines with simple flat fills. Color palette: deep navy
(#1a1a2e), electric blue (#4361ee), and soft gray (#e8e8e8).
The background must be pure white. No shadows on the background.
No gradients behind the subject. Sharp clean edges.
1:1 format.
Output intent: website service page icon illustration.
```

### 3. Infographic (Vertical)

```
Create a 9:16 infographic explaining "The 7 Pillars of Digital
Marketing Success" for Digimark.
Show these labeled sections from top to bottom, each with a small
icon: SEO, Content Marketing, Social Media, PPC Advertising, Email
Marketing, Web Design, Analytics & Reporting.
Use a clean editorial style with wide margins, bold section headers
in navy (#1a1a2e), thin separator lines, and small descriptive
captions under each section.
Include the Digimark brand at the top.
Keep the layout scannable and readable at phone resolution.
Output intent: social media educational post.
```

### 4. Infographic (Horizontal / Chart)

```
Create a 16:9 infographic showing "SEO ROI Over 12 Months" as a
comparison chart. Show two lines: organic traffic growth (blue
#4361ee) and revenue growth (green #00c853) on a clean white
grid background.
Label the X-axis with months (Jan-Dec) and Y-axis with percentage.
Add a callout box highlighting "3.2x ROI at month 9."
Clean editorial style, thin gridlines, readable labels.
Output intent: blog article data visualization.
```

### 5. Icon / Sticker (Transparent-ready)

```
A [STYLE] icon representing "[CONCEPT]". [DESCRIBE THE VISUAL
METAPHOR]. Bold, clean outlines, simple cel-shading.
Color palette: [PRIMARY COLOR] and [ACCENT COLOR].
The background must be pure white. No shadows on the background.
No gradients. Sharp, high-contrast edges.
1:1 format.
Output intent: website UI icon.
```

**Style options for icons:**
- Flat vector: minimal, clean, modern
- 3D tactile: rounded, soft shadows, playful
- Line art: thin strokes, minimal fills
- Isometric: 3D perspective, geometric

### 6. Blog Featured Image (Photorealistic)

```
A photorealistic wide shot of [SCENE DESCRIPTION].
[SUBJECT AND ACTION]. Set in [ENVIRONMENT].
Illuminated by [LIGHTING — e.g., soft natural window light, golden
hour, studio softbox]. Captured with a [LENS — e.g., 35mm wide,
85mm portrait] lens, [DEPTH OF FIELD].
Mood: [MOOD — e.g., professional, innovative, warm].
16:9 format.
Output intent: blog article hero image.
```

### 7. Social Media Ad with Text

**Turn 1 (generate copy):**
```
Write a punchy 4-word headline and a 12-word supporting line for a
Digimark social media ad promoting SEO audit services.
```

**Turn 2 (render image):**
```
Create a 1:1 social media ad for Digimark's SEO audit service.
Bold dark navy (#1a1a2e) background with subtle geometric pattern.
A glowing magnifying glass icon in electric blue (#4361ee) centered
in the upper third.
Render the exact headline "[HEADLINE FROM TURN 1]" in bold white
uppercase sans-serif in the center.
Render the exact subline "[SUBLINE FROM TURN 1]" in smaller light
gray text below.
Leave space at bottom for a CTA button.
Output intent: paid social ad creative.
```

### 8. Product Mockup

```
A high-resolution, studio-lit product photograph of [DEVICE/PRODUCT]
displaying [SCREEN CONTENT DESCRIPTION], presented on [SURFACE].
Lighting: [SETUP — e.g., three-point softbox, natural window light].
Camera: slightly elevated [ANGLE]-degree shot.
Ultra-realistic, sharp focus on [KEY DETAIL].
[ASPECT RATIO] format.
Output intent: client portfolio showcase.
```

### 9. Client Case Study Graphic

```
Create a 16:9 split-screen comparison graphic for a Digimark case
study. Left side labeled "BEFORE" shows a cluttered, outdated
website mockup with poor typography and dark colors. Right side
labeled "AFTER" shows a clean, modern, well-structured website
mockup with clear hierarchy and the client's brand colors.
A thin vertical divider separates the two halves.
Clean, professional presentation style.
Output intent: case study portfolio image.
```

### 10. Character Consistency (Brand Mascot / Team)

```
Use the provided character image as the canonical reference.
Create a [ASPECT RATIO] scene of the same character [NEW SCENARIO].
Keep the same face, hair, body proportions, clothing style, and
overall appearance.
Only change the pose, camera angle, and environment.
Visual style: [STYLE DESCRIPTION].
Output intent: brand storytelling image.
```

### 11. Storyboard (Multi-Panel)

```
Create a 3-panel storyboard in a clean flat illustration style.
Panel 1: [WIDE SHOT — establishing scene description].
Panel 2: [MEDIUM SHOT — action description].
Panel 3: [CLOSE-UP — detail/conclusion description].
Keep the same character design, color palette, and visual style
across all panels. Use the Digimark brand colors.
Output intent: service explainer storyboard.
```

### 12. Email Header Banner

```
Create a 21:9 email header banner for Digimark's monthly newsletter.
Abstract flowing gradient from deep navy (#1a1a2e) on the left to
electric blue (#4361ee) on the right. Subtle geometric shapes and
data visualization elements float in the background.
Render the exact text "DIGIMARK INSIGHTS" in bold white uppercase
sans-serif, centered.
Render "March 2026" in smaller light text below.
Clean, premium, minimal. No busy elements.
Output intent: email marketing header.
```

---

## Editing Prompt Templates

### Change-Only Edit

```
Using the provided image, change only [SPECIFIC ELEMENT] to
[NEW DESCRIPTION].
Keep the same [LIST EVERY LOCKED ELEMENT: face, pose, lighting,
background, camera angle, color grading, other objects].
Do not change anything else.
Output intent: controlled single edit.
```

### Semantic Masking (Inpainting)

```
Using the provided image of [SUBJECT], change only the [TARGET AREA]
to [NEW DESCRIPTION]. Keep everything else in the image exactly the
same, preserving the original style, lighting, and composition.
```

### Style Transfer

```
Using the provided photograph, recreate its exact content and
composition in a [TARGET STYLE — e.g., watercolor, oil painting,
flat vector, pixel art] style. Maintain all spatial relationships,
subject positions, and proportions. Only change the rendering style.
```

### Background Replacement

```
Using the provided image, replace only the background with
[NEW BACKGROUND DESCRIPTION]. Keep the foreground subject exactly
the same — same pose, lighting on subject, edges, and details.
Match the new background's lighting direction to the subject.
```

### Localization

```
Update this image to [TARGET LANGUAGE].
Do not change the layout, icon positions, color system, chart
proportions, or visual hierarchy.
Replace all [SOURCE LANGUAGE] text with natural [TARGET LANGUAGE]
text that fits the same design style.
Keep headings short and labels readable.
```

---

## ImageConfig Parameters

| Parameter | Type | Values | Notes |
|-----------|------|--------|-------|
| `aspectRatio` | string | See ratio table above | Defaults to input image ratio or 1:1 |
| `imageSize` | string | `"512"`, `"1K"`, `"2K"`, `"4K"` | Must use uppercase K. Default: 1K |
| `outputMimeType` | string | `"image/png"`, `"image/jpeg"`, `"image/webp"` | Vertex AI only |
| `personGeneration` | string | `"ALLOW_ALL"`, `"ALLOW_ADULT"`, `"ALLOW_NONE"` | Controls person generation |

## ThinkingConfig Parameters

| Parameter | Type | Values | Notes |
|-----------|------|--------|-------|
| `thinkingLevel` | string | `"minimal"`, `"High"` | Minimal = fastest, High = best quality |
| `includeThoughts` | boolean | `true` / `false` | Whether to return thought process |

Thinking tokens are billed regardless of `includeThoughts` setting.

## Reference Image Limits

| Feature | Nano Banana 2 | Nano Banana Pro |
|---------|--------------|----------------|
| Object fidelity images | Up to 10 | Up to 6 |
| Character consistency images | Up to 4 | Up to 5 |
| Total reference images | Up to 14 | Up to 14 |

---

## Limitations

- No true transparent background (PNG alpha channel) output.
- No audio or video inputs.
- Model may not always match the exact number of requested output images.
- Text-first workflow recommended for any text in images.
- Google Search grounding does not support real-world images of people.
- All generated images include SynthID watermark and C2PA Content Credentials.
- Best language support: EN, ar-EG, de-DE, es-MX, fr-FR, hi-IN, id-ID,
  it-IT, ja-JP, ko-KR, pt-BR, ru-RU, ua-UA, vi-VN, zh-CN.
- Aspect ratio may be ignored during edit operations (known issue).
  Re-specify in each turn's config.
- No explicit seed control for reproducible outputs.

## Pricing (as of March 2026)

| Model | Standard res (~$) | High res (~$) | Free tier |
|-------|-------------------|---------------|-----------|
| Nano Banana 2 | ~$0.003/image | ~$0.006 (2K) | 1,500/day |
| Nano Banana Pro | Higher | Higher | Limited |
| DALL-E 3 (comparison) | $0.040 | $0.080 | None |

## Thought Signatures

In multi-turn conversations, responses include `thought_signature` fields
on image parts and the first non-thought text part. When using the official
`@google/genai` SDK with the chat feature, signatures are handled
automatically. If using raw REST, pass thought signatures back exactly as
received in subsequent turns.
