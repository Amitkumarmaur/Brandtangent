// Brand tokens for the Remotion compositions.
// Inlined from STYLE_GUIDE.md / globals.css since Remotion has its own bundle
// and doesn't share the project's Tailwind config.

import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

const { fontFamily: poppins } = loadPoppins("normal", {
  weights: ["400", "500", "600", "700", "800"],
});
const { fontFamily: inter } = loadInter("normal", {
  weights: ["400", "500", "600"],
});
const { fontFamily: mono } = loadGeistMono("normal", {
  weights: ["400", "500", "600"],
});

export const FONT = {
  heading: poppins,
  sans: inter,
  mono,
};

export const COLORS = {
  igniteOrange: "#FF5722",
  success: "#10B981",
  foreground: "#0A0A0A",
  background: "#FFFFFF",
  peachLight: "#FFF5F0",
  peach: "#FFD2B8",
  grey100: "#F8F8F8",
  grey200: "#E5E5E5",
  grey400: "#7D7D7D",
  grey600: "#4A4A4A",
};

// Hero reel: 12s @ 30fps, 4:3 landscape to match the homepage hero right-panel proportions.
export const FPS = 30;
export const WIDTH = 1440;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 360;
