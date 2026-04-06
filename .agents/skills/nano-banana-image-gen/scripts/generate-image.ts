#!/usr/bin/env npx tsx
/**
 * Nano Banana 2 Image Generation Utility
 *
 * Usage:
 *   npx tsx generate-image.ts --prompt "Your prompt" --output output.png
 *   npx tsx generate-image.ts --prompt "Your prompt" --aspect-ratio 16:9 --resolution 2K
 *   npx tsx generate-image.ts --prompt "Edit this" --input source.png --output edited.png
 *   npx tsx generate-image.ts --prompt "Create infographic" --chat --grounding
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

type AspectRatio =
  | "1:1" | "1:4" | "1:8" | "2:3" | "3:2" | "3:4"
  | "4:1" | "4:3" | "4:5" | "5:4" | "8:1" | "9:16"
  | "16:9" | "21:9";

type Resolution = "512" | "1K" | "2K" | "4K";
type ThinkingLevel = "minimal" | "High";
type ResponseModality = "TEXT" | "IMAGE";

interface GenerateOptions {
  prompt: string;
  outputPath?: string;
  inputImagePath?: string;
  aspectRatio?: AspectRatio;
  resolution?: Resolution;
  thinkingLevel?: ThinkingLevel;
  responseModalities?: ResponseModality[];
  useGrounding?: boolean;
  useImageSearch?: boolean;
  model?: string;
}

interface GenerateResult {
  imagePath: string | null;
  text: string | null;
  mimeType: string;
}

const DEFAULT_MODEL = "gemini-3.1-flash-image-preview";
const DEFAULT_OUTPUT_DIR = "public/images/generated";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY not set. Add it to .env.local or export it."
    );
  }
  return new GoogleGenAI({ apiKey });
}

function ensureOutputDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".heic": "image/heic",
    ".heif": "image/heif",
  };
  return mimeTypes[ext] || "image/png";
}

export async function generateImage(
  options: GenerateOptions
): Promise<GenerateResult> {
  const ai = getClient();
  const model = options.model || DEFAULT_MODEL;

  const contents: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  contents.push({ text: options.prompt });

  if (options.inputImagePath) {
    const imageData = fs.readFileSync(options.inputImagePath);
    contents.push({
      inlineData: {
        mimeType: getMimeType(options.inputImagePath),
        data: imageData.toString("base64"),
      },
    });
  }

  const config: Record<string, unknown> = {
    responseModalities: options.responseModalities || ["TEXT", "IMAGE"],
  };

  if (options.aspectRatio || options.resolution) {
    const imageConfig: Record<string, string> = {};
    if (options.aspectRatio) imageConfig.aspectRatio = options.aspectRatio;
    if (options.resolution) imageConfig.imageSize = options.resolution;
    config.imageConfig = imageConfig;
  }

  if (options.thinkingLevel) {
    config.thinkingConfig = {
      thinkingLevel: options.thinkingLevel,
      includeThoughts: false,
    };
  }

  if (options.useGrounding || options.useImageSearch) {
    const searchConfig: Record<string, unknown> = {};
    if (options.useImageSearch) {
      searchConfig.searchTypes = {
        webSearch: {},
        imageSearch: {},
      };
    }
    config.tools = [{ googleSearch: searchConfig }];
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  });

  let resultText: string | null = null;
  let resultImagePath: string | null = null;
  let resultMimeType = "image/png";

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if ((part as { thought?: boolean }).thought) continue;

    if ((part as { text?: string }).text) {
      resultText = (part as { text: string }).text;
    } else if ((part as { inlineData?: { data: string; mimeType: string } }).inlineData) {
      const inlineData = (part as { inlineData: { data: string; mimeType: string } }).inlineData;
      const buffer = Buffer.from(inlineData.data, "base64");
      resultMimeType = inlineData.mimeType || "image/png";

      const ext = resultMimeType.includes("jpeg") ? ".jpg"
        : resultMimeType.includes("webp") ? ".webp"
        : ".png";

      const outputPath =
        options.outputPath ||
        path.join(DEFAULT_OUTPUT_DIR, `nano-banana-${Date.now()}${ext}`);

      ensureOutputDir(outputPath);
      fs.writeFileSync(outputPath, buffer);
      resultImagePath = outputPath;
    }
  }

  return {
    imagePath: resultImagePath,
    text: resultText,
    mimeType: resultMimeType,
  };
}

export async function generateWithChat(
  messages: string[],
  options: Omit<GenerateOptions, "prompt"> = {}
): Promise<GenerateResult[]> {
  const ai = getClient();
  const model = options.model || DEFAULT_MODEL;

  const chatConfig: Record<string, unknown> = {
    responseModalities: options.responseModalities || ["TEXT", "IMAGE"],
  };

  if (options.useGrounding) {
    chatConfig.tools = [{ googleSearch: {} }];
  }

  const chat = ai.chats.create({ model, config: chatConfig });
  const results: GenerateResult[] = [];

  for (let i = 0; i < messages.length; i++) {
    const sendConfig: Record<string, unknown> = {};
    if (options.aspectRatio || options.resolution) {
      const imageConfig: Record<string, string> = {};
      if (options.aspectRatio) imageConfig.aspectRatio = options.aspectRatio;
      if (options.resolution) imageConfig.imageSize = options.resolution;
      sendConfig.imageConfig = imageConfig;
      sendConfig.responseModalities = ["TEXT", "IMAGE"];
    }

    const response = await chat.sendMessage({
      message: messages[i],
      ...(Object.keys(sendConfig).length > 0 ? { config: sendConfig } : {}),
    });

    let resultText: string | null = null;
    let resultImagePath: string | null = null;
    let resultMimeType = "image/png";

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if ((part as { thought?: boolean }).thought) continue;

      if ((part as { text?: string }).text) {
        resultText = (part as { text: string }).text;
      } else if ((part as { inlineData?: { data: string; mimeType: string } }).inlineData) {
        const inlineData = (part as { inlineData: { data: string; mimeType: string } }).inlineData;
        const buffer = Buffer.from(inlineData.data, "base64");
        resultMimeType = inlineData.mimeType || "image/png";

        const ext = resultMimeType.includes("jpeg") ? ".jpg"
          : resultMimeType.includes("webp") ? ".webp"
          : ".png";

        const suffix = messages.length > 1 ? `-turn${i + 1}` : "";
        const outputPath =
          options.outputPath && i === messages.length - 1
            ? options.outputPath
            : path.join(DEFAULT_OUTPUT_DIR, `nano-banana-${Date.now()}${suffix}${ext}`);

        ensureOutputDir(outputPath);
        fs.writeFileSync(outputPath, buffer);
        resultImagePath = outputPath;
      }
    }

    results.push({
      imagePath: resultImagePath,
      text: resultText,
      mimeType: resultMimeType,
    });
  }

  return results;
}

// --- CLI ---

function parseArgs(args: string[]): Record<string, string | boolean> {
  const parsed: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        parsed[key] = next;
        i++;
      } else {
        parsed[key] = true;
      }
    }
  }
  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt) {
    console.error("Usage: npx tsx generate-image.ts --prompt \"Your prompt\"");
    console.error("");
    console.error("Options:");
    console.error("  --prompt          Required. The image generation prompt.");
    console.error("  --output          Output file path (default: public/images/generated/...)");
    console.error("  --input           Input image for editing workflows.");
    console.error("  --aspect-ratio    Aspect ratio: 1:1, 16:9, 9:16, 4:3, etc.");
    console.error("  --resolution      Resolution: 512, 1K, 2K, 4K (default: 1K)");
    console.error("  --thinking        Thinking level: minimal or High");
    console.error("  --grounding       Enable Google Search grounding.");
    console.error("  --image-search    Enable Image Search grounding (implies --grounding).");
    console.error("  --image-only      Return only image, no text.");
    console.error("  --model           Model ID (default: gemini-3.1-flash-image-preview)");
    process.exit(1);
  }

  const result = await generateImage({
    prompt: args.prompt as string,
    outputPath: args.output as string | undefined,
    inputImagePath: args.input as string | undefined,
    aspectRatio: (args["aspect-ratio"] as AspectRatio) || undefined,
    resolution: (args.resolution as Resolution) || undefined,
    thinkingLevel: (args.thinking as ThinkingLevel) || undefined,
    responseModalities: args["image-only"]
      ? ["IMAGE"]
      : ["TEXT", "IMAGE"],
    useGrounding: !!args.grounding || !!args["image-search"],
    useImageSearch: !!args["image-search"],
    model: args.model as string | undefined,
  });

  if (result.text) {
    console.log("Model response:", result.text);
  }
  if (result.imagePath) {
    console.log("Image saved:", result.imagePath);
  } else {
    console.error("No image was generated.");
    process.exit(1);
  }
}

const isDirectRun = process.argv[1]?.includes("generate-image");
if (isDirectRun) {
  main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
}
