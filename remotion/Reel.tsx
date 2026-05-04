import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Mail,
  FileSpreadsheet,
  Bell,
  Calendar,
  Lightbulb,
  Sparkles,
  Rocket,
  TrendingUp,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { COLORS, FONT } from "./brand";

// ─────────────────────────────────────────────────────────────────────────────
// Phase content
// ─────────────────────────────────────────────────────────────────────────────

type Phase = {
  index: string;
  word: string;
  caption: string;
  codeLines: string[];        // typed sequentially
  accentColor: string;
  accentIcons: ComponentType<SVGProps<SVGSVGElement>>[];
};

const PHASES: Phase[] = [
  {
    index: "01",
    word: "AUTOMATE.",
    caption: "Repetitive work runs itself.",
    codeLines: [
      "$ digiimark.automate({",
      '    tasks: ["email", "crm", "ads"],',
      "    agents: 3,",
      "  })",
      "✓ workflow live · 28 hrs/wk saved",
    ],
    accentColor: COLORS.igniteOrange,
    accentIcons: [Mail, FileSpreadsheet, Bell, Calendar],
  },
  {
    index: "02",
    word: "INNOVATE.",
    caption: "Time to think. Time to build.",
    codeLines: [
      "$ digiimark.innovate({",
      '    idea: "new product line",',
      "    timeline: 6,",
      "  })",
      "✓ shipped · v1 live",
    ],
    accentColor: COLORS.igniteOrange,
    accentIcons: [Lightbulb, Sparkles],
  },
  {
    index: "03",
    word: "ACCELERATE.",
    caption: "Growth that compounds.",
    codeLines: [
      "$ digiimark.accelerate({",
      '    channels: ["seo", "aeo", "paid"],',
      "  })",
      "↗ traffic +312%",
      "↗ leads +236% · compounding",
    ],
    accentColor: COLORS.igniteOrange,
    accentIcons: [TrendingUp, Rocket],
  },
];

const PHASE_FRAMES = 90; // 3s per phase
const OPEN_FRAMES = 30;  // 1s cold-open
const LOCKUP_FRAMES = 60; // 2s closing lockup

// ─────────────────────────────────────────────────────────────────────────────
// Reel composition
// ─────────────────────────────────────────────────────────────────────────────

export const Reel = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background, fontFamily: FONT.sans }}>
      <BrandWatermark />

      <Sequence from={0} durationInFrames={OPEN_FRAMES} name="Open">
        <Open />
      </Sequence>

      {PHASES.map((phase, i) => (
        <Sequence
          key={phase.index}
          from={OPEN_FRAMES + i * PHASE_FRAMES}
          durationInFrames={PHASE_FRAMES}
          name={`Phase ${phase.index}`}
        >
          <PhaseSlide phase={phase} />
        </Sequence>
      ))}

      <Sequence
        from={OPEN_FRAMES + PHASES.length * PHASE_FRAMES}
        durationInFrames={LOCKUP_FRAMES}
        name="Lockup"
      >
        <Lockup />
      </Sequence>

      <Audio src={staticFile("audio/music.mp3")} volume={musicVolume} />
    </AbsoluteFill>
  );
};

// Snappy fade-in/out so the loop sits cleanly in autoplay-muted hero contexts.
function musicVolume(frame: number): number {
  const fps = 30;
  const t = frame / fps;
  if (t < 0.3) return t / 0.3;
  if (t > 11.5) return Math.max(0, 1 - (t - 11.5) / 0.5);
  return 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cold-open: orange dot pulse
// ─────────────────────────────────────────────────────────────────────────────

const Open = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotScale = spring({ frame, fps, config: { damping: 10, mass: 0.6 } });
  const ringExpand = interpolate(frame, [10, 30], [0, 220], { extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [10, 30], [0.7, 0], { extrapolateRight: "clamp" });
  const exitFade = interpolate(frame, [22, 30], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", opacity: exitFade }}>
        <div
          style={{
            width: ringExpand,
            height: ringExpand,
            borderRadius: 999,
            border: `3px solid ${COLORS.igniteOrange}`,
            opacity: ringOpacity,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: COLORS.igniteOrange,
            transform: `scale(${dotScale})`,
            boxShadow: `0 0 60px ${COLORS.igniteOrange}88`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Per-phase slide
// ─────────────────────────────────────────────────────────────────────────────

const PhaseSlide = ({ phase }: { phase: Phase }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Word: spring slam in, hold, exit slide-left.
  const wordEnter = spring({ frame, fps, config: { damping: 11, mass: 0.7, stiffness: 160 } });
  const exitStart = PHASE_FRAMES - 14;
  const wordExitX = interpolate(frame, [exitStart, PHASE_FRAMES], [0, -120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordExitOpacity = interpolate(frame, [exitStart, PHASE_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase pill (top)
  const pillOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const pillExit = interpolate(frame, [exitStart, PHASE_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Caption
  const captionOpacity = interpolate(frame, [22, 36], [0, 1], { extrapolateRight: "clamp" });
  const captionY = interpolate(frame, [22, 36], [12, 0], { extrapolateRight: "clamp" });
  const captionExit = interpolate(frame, [exitStart, PHASE_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Code block typewriter
  const codeStart = 18;
  const totalChars = phase.codeLines.reduce((a, l) => a + l.length + 1, 0);
  const charsRevealed = Math.floor(
    interpolate(frame, [codeStart, exitStart - 6], [0, totalChars], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const codeBlockEnter = spring({ frame: frame - 14, fps, config: { damping: 14, mass: 0.8 } });
  const codeExit = interpolate(frame, [exitStart, PHASE_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* phase pill — top center */}
      <div
        style={{
          position: "absolute",
          top: 84,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: pillOpacity * pillExit,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 18px",
            border: `1.5px solid ${COLORS.igniteOrange}40`,
            background: `${COLORS.igniteOrange}10`,
            borderRadius: 999,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 999, background: COLORS.igniteOrange }} />
          <span
            style={{
              fontFamily: FONT.heading,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: COLORS.igniteOrange,
            }}
          >
            Phase {phase.index} / 03
          </span>
        </div>
      </div>

      {/* Side accent icons drifting in */}
      <AccentIcons phase={phase} />

      {/* Headline word */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translate(${wordExitX}px, 0) scale(${wordEnter})`,
          opacity: wordExitOpacity * wordEnter,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: FONT.heading,
            fontWeight: 800,
            fontSize: 196,
            letterSpacing: "-0.045em",
            color: COLORS.foreground,
            lineHeight: 1,
          }}
        >
          {phase.word.slice(0, -1)}
          <span style={{ color: COLORS.igniteOrange }}>.</span>
        </h1>
      </div>

      {/* Caption under word */}
      <div
        style={{
          position: "absolute",
          top: 460,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: captionOpacity * captionExit,
          transform: `translateY(${captionY}px)`,
          fontFamily: FONT.sans,
          fontSize: 28,
          color: COLORS.grey400,
          fontWeight: 500,
          letterSpacing: "-0.005em",
        }}
      >
        {phase.caption}
      </div>

      {/* Code terminal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 560,
          transform: `translate(-50%, 0) scale(${codeBlockEnter})`,
          opacity: codeBlockEnter * codeExit,
          width: 920,
          background: COLORS.foreground,
          borderRadius: 24,
          padding: "26px 32px 30px",
          boxShadow: "0 24px 60px rgba(10,10,10,0.18), 0 4px 12px rgba(10,10,10,0.08)",
          border: "1px solid rgba(10,10,10,0.04)",
        }}
      >
        {/* terminal chrome */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#FEBC2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#28C840" }} />
          <div
            style={{
              marginLeft: 14,
              fontFamily: FONT.mono,
              fontSize: 14,
              color: "rgba(255,255,255,0.42)",
              letterSpacing: "0.04em",
            }}
          >
            ~/digiimark
          </div>
        </div>

        {/* code lines */}
        <CodeBlock lines={phase.codeLines} charsRevealed={charsRevealed} accent={phase.accentColor} />
      </div>
    </AbsoluteFill>
  );
};

// Renders typed code with cursor on the line currently being typed.
const CodeBlock = ({
  lines,
  charsRevealed,
  accent,
}: {
  lines: string[];
  charsRevealed: number;
  accent: string;
}) => {
  let consumed = 0;
  const rendered: { text: string; isActive: boolean }[] = [];
  let activeLineIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLen = line.length + 1; // +1 for newline
    if (consumed + lineLen <= charsRevealed) {
      rendered.push({ text: line, isActive: false });
      consumed += lineLen;
    } else {
      const remaining = Math.max(0, charsRevealed - consumed);
      rendered.push({ text: line.slice(0, remaining), isActive: true });
      activeLineIndex = i;
      break;
    }
  }

  return (
    <div style={{ fontFamily: FONT.mono, fontSize: 26, lineHeight: 1.55 }}>
      {rendered.map((r, i) => (
        <div key={i} style={{ color: lineColor(lines[i], accent), whiteSpace: "pre", minHeight: 36 }}>
          {r.text}
          {r.isActive ? <BlinkCursor accent={accent} /> : null}
        </div>
      ))}
      {/* keep block height stable while still typing */}
      {activeLineIndex >= 0
        ? lines.slice(activeLineIndex + 1).map((_, i) => <div key={`p${i}`} style={{ minHeight: 36 }} />)
        : null}
    </div>
  );
};

const BlinkCursor = ({ accent }: { accent: string }) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={{ display: "inline-block", width: 12, marginLeft: 2, color: accent, opacity: on ? 1 : 0 }}>▍</span>
  );
};

function lineColor(line: string, accent: string): string {
  if (line.startsWith("$")) return "rgba(255,255,255,0.92)";
  if (line.startsWith("✓") || line.startsWith("↗")) return accent;
  if (line.trim().startsWith("//")) return "rgba(255,255,255,0.4)";
  return "rgba(255,255,255,0.78)";
}

// ─────────────────────────────────────────────────────────────────────────────
// Accent icons drifting in from the sides per phase
// ─────────────────────────────────────────────────────────────────────────────

const AccentIcons = ({ phase }: { phase: Phase }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  return (
    <>
      {phase.accentIcons.map((Icon, i) => {
        const startFrame = 8 + i * 6;
        const enter = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const fromLeft = i % 2 === 0;
        const startX = fromLeft ? -160 : width + 160;
        const targetX = fromLeft ? 110 + (i * 30) : width - 110 - (i * 30);
        const x = startX + (targetX - startX) * enter;

        const y = 320 + (i % 2 === 0 ? 0 : 90) + i * 30;

        const exitOpacity = interpolate(frame, [PHASE_FRAMES - 14, PHASE_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 32,
              top: y - 32,
              width: 64,
              height: 64,
              borderRadius: 18,
              background: COLORS.background,
              border: `1.5px solid ${phase.accentColor}40`,
              boxShadow: `0 12px 28px rgba(255,87,34,0.18)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: phase.accentColor,
              opacity: enter * exitOpacity,
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 6}deg)`,
            }}
          >
            <Icon width={28} height={28} stroke="currentColor" strokeWidth={2} />
          </div>
        );
      })}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Lockup
// ─────────────────────────────────────────────────────────────────────────────

const Lockup = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordmarkScale = spring({ frame: frame - 4, fps, config: { damping: 12, mass: 0.7 } });

  const trio = ["AUTOMATE", "INNOVATE", "ACCELERATE"];
  const trioOpacity = (i: number) => interpolate(frame, [16 + i * 8, 28 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trioY = (i: number) => interpolate(frame, [16 + i * 8, 28 + i * 8], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Final dot pulse
  const dotPulse = 1 + Math.sin(frame / 5) * 0.08;
  const finalFade = interpolate(frame, [LOCKUP_FRAMES - 12, LOCKUP_FRAMES], [1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 32, opacity: finalFade }}>
      <div style={{ transform: `scale(${wordmarkScale})`, display: "flex", alignItems: "baseline" }}>
        <span style={wordmarkStyle("white-bg-dark")}>Digii</span>
        <span style={wordmarkStyle("white-bg-orange")}>mark</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
        {trio.map((w, i) => (
          <span key={w} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span
              style={{
                fontFamily: FONT.heading,
                fontWeight: 700,
                fontSize: 32,
                letterSpacing: "0.16em",
                color: COLORS.foreground,
                opacity: trioOpacity(i),
                transform: `translateY(${trioY(i)}px)`,
              }}
            >
              {w}
            </span>
            {i < 2 ? (
              <span
                style={{
                  width: 8 * dotPulse,
                  height: 8 * dotPulse,
                  borderRadius: 999,
                  background: COLORS.igniteOrange,
                  opacity: trioOpacity(i + 1),
                  boxShadow: `0 0 ${10 * dotPulse}px ${COLORS.igniteOrange}80`,
                }}
              />
            ) : null}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

function wordmarkStyle(variant: "white-bg-dark" | "white-bg-orange"): React.CSSProperties {
  return {
    fontFamily: FONT.heading,
    fontWeight: 800,
    fontSize: 144,
    letterSpacing: "-0.04em",
    color: variant === "white-bg-dark" ? COLORS.foreground : COLORS.igniteOrange,
    lineHeight: 1,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Static brand watermark (top-left)
// ─────────────────────────────────────────────────────────────────────────────

const BrandWatermark = () => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 48,
      display: "flex",
      alignItems: "center",
      gap: 8,
      zIndex: 10,
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: COLORS.igniteOrange,
      }}
    />
    <span
      style={{
        fontFamily: FONT.mono,
        fontSize: 13,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: COLORS.grey600,
        fontWeight: 500,
      }}
    >
      Digiimark
    </span>
  </div>
);
