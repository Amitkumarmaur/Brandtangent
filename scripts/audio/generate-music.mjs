// Generates the brand-reel music bed with Lyria 3 Pro.
// Tries OpenRouter first (per requested billing path); falls back to native
// Gemini API if OpenRouter doesn't return inline audio for this model.
//
// Output: public/audio/music.wav  (44.1kHz stereo WAV from Lyria-3 Pro)
//
// Run with:  pnpm audio:music

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");
const outDir = resolve(projectRoot, "public/audio");
// Lyria defaults to MP3; we sniff the first bytes and pick the right extension.
const outBase = "music";

const PROMPT = [
  "Short punchy upbeat electronic pop sting for a brand reel hero loop.",
  "Length: about 12 seconds. Tempo: 128 BPM. Bright and fun, modern startup energy.",
  "Structure: tiny pickup hit at 0s, immediate uplifting chord stab.",
  "Beat 1 (around 1s): bright stinger, claps in, big drop into syncopated synth bass groove.",
  "Beat 2 (around 4s): filter sweep, riser, second stab — slightly higher chord — keeps energy high.",
  "Beat 3 (around 7s): drum fill, third stab, layered synth lead enters, peak energy.",
  "Beat 4 (around 10s): final triumphant chord with cymbal crash, quick reverb tail to end clean.",
  "Style: upbeat poppy electronic, plucky synth lead, bouncy bass, claps, tasteful percussion. Think modern explainer-video sting.",
  "No vocals. No lyrics. Instrumental only.",
  "Confident, exciting, optimistic — but tight and snappy, never sluggish.",
].join("\n");

async function tryOpenRouter() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { ok: false, reason: "OPENROUTER_API_KEY missing" };

  console.log("→ Attempting OpenRouter (google/lyria-3-pro-preview, stream=true)…");
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://digiimark.com",
      "X-Title": "Digiimark Brand Reel",
    },
    body: JSON.stringify({
      model: "google/lyria-3-pro-preview",
      messages: [{ role: "user", content: PROMPT }],
      modalities: ["audio", "text"],
      stream: true,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    return { ok: false, reason: `HTTP ${res.status}: ${t.slice(0, 400)}` };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  const audioChunks = [];
  let audioUrl = null;
  let firstShape = null;

  function harvest(delta) {
    if (!delta) return;
    if (typeof delta.audio?.data === "string") audioChunks.push(delta.audio.data);
    if (typeof delta.audio?.url === "string") audioUrl = delta.audio.url;
    if (Array.isArray(delta.content)) {
      for (const p of delta.content) {
        if (p?.type === "audio" || p?.type === "output_audio") {
          if (typeof p.audio?.data === "string") audioChunks.push(p.audio.data);
          if (typeof p.audio?.url === "string") audioUrl = p.audio.url;
          if (typeof p.data === "string") audioChunks.push(p.data);
        }
      }
    }
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    pending += decoder.decode(value, { stream: true });
    const lines = pending.split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        if (!firstShape) firstShape = json;
        const choice = json.choices?.[0];
        harvest(choice?.delta);
        harvest(choice?.message);
      } catch {
        /* skip malformed line */
      }
    }
  }

  if (audioChunks.length) {
    return { ok: true, buf: Buffer.from(audioChunks.join(""), "base64") };
  }
  if (audioUrl) {
    const r = await fetch(audioUrl);
    return { ok: true, buf: Buffer.from(await r.arrayBuffer()) };
  }
  return {
    ok: false,
    reason: `no audio in stream. Sample chunk: ${JSON.stringify(firstShape).slice(0, 600)}`,
  };
}

async function tryGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, reason: "GEMINI_API_KEY missing" };

  console.log("→ Falling back to native Gemini (lyria-3-pro-preview)…");
  const ai = new GoogleGenAI({ apiKey: key });
  const response = await ai.models.generateContent({
    model: "lyria-3-pro-preview",
    contents: PROMPT,
    config: {
      responseModalities: ["AUDIO", "TEXT"],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData?.data) {
    return {
      ok: false,
      reason: `no inlineData: ${JSON.stringify(response).slice(0, 500)}`,
    };
  }
  return { ok: true, buf: Buffer.from(part.inlineData.data, "base64") };
}

async function main() {
  let result = await tryOpenRouter();
  if (!result.ok) {
    console.warn(`  OpenRouter path failed: ${result.reason}`);
    result = await tryGemini();
  }
  if (!result.ok) {
    console.error(`  Gemini path failed: ${result.reason}`);
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const ext = sniffExtension(result.buf);
  const outPath = resolve(outDir, `${outBase}.${ext}`);
  await writeFile(outPath, result.buf);
  console.log(`✓ Saved ${outPath}  (${(result.buf.length / 1024).toFixed(1)} KB)`);
}

function sniffExtension(buf) {
  if (buf.length < 4) return "bin";
  const head = buf.subarray(0, 4).toString("ascii");
  if (head === "RIFF") return "wav";
  if (buf.subarray(0, 3).toString("ascii") === "ID3") return "mp3";
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return "mp3";
  if (head.startsWith("OggS")) return "ogg";
  return "mp3";
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
