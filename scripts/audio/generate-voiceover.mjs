// Generates the brand-reel voiceover with Gemini 2.5 Pro TTS (voice: Charon).
// Output: public/audio/voiceover.wav  (24kHz / mono / 16-bit PCM)
//
// Run with:  pnpm audio:voice
//            (which expands to: node --env-file=.env.local scripts/audio/generate-voiceover.mjs)

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { pcm16ToWav } from "./wav.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..");
const outPath = resolve(projectRoot, "public/audio/voiceover.wav");

const VOICE = "Charon";
// Flash TTS for cost/quota; Pro TTS requires paid billing on the project.
const MODEL = "gemini-2.5-flash-preview-tts";

// Style cue is part of the prompt — Gemini TTS reads styling from natural language.
// Pauses get an extra space; em-dashes pace nicely.
const SCRIPT = `Read this in a confident, cinematic, agency-brand-reel tone. Slightly deeper than conversational. Crisp pacing, brief pauses between sentences, warmer on the closing line:

Most businesses spend their week just keeping the lights on. Sending the email. Updating the sheet. Chasing the lead. Day after day.

That's where we start. We connect your tools, deploy AI agents, and put the repetitive work on autopilot — so your team stops doing what software should be doing.

With time back, you finally get to think. To build new products. New experiences. New revenue. We turn your ideas into shipped systems.

And growth compounds. Better SEO, smarter content, sharper funnels — discoverable everywhere your customers ask. Including ChatGPT and Perplexity.

Six years. Five markets. One mission. Digiimark — Automate. Innovate. Accelerate.`;

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY missing. Run with: node --env-file=.env.local …");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  console.log(`→ Requesting Gemini TTS (${MODEL}, voice=${VOICE})…`);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ parts: [{ text: SCRIPT }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
      },
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData?.data) {
    console.error("No inlineData in response:", JSON.stringify(response, null, 2).slice(0, 1500));
    process.exit(1);
  }

  const pcm = Buffer.from(part.inlineData.data, "base64");
  const wav = pcm16ToWav(pcm, { sampleRate: 24000, channels: 1 });

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, wav);

  const seconds = pcm.length / 2 / 24000;
  console.log(`✓ Saved ${outPath}`);
  console.log(`  size: ${(wav.length / 1024).toFixed(1)} KB · duration: ${seconds.toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
