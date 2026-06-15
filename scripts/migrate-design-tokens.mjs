/**
 * One-shot migration: hardcoded Stripe hex → Webflow design tokens + accent-orange.
 * Run: node scripts/migrate-design-tokens.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

const REPLACEMENTS = [
  // Borders & surfaces
  [/border-\[#e3e8ee\]/gi, "border-border"],
  [/border-\[#E3E8EE\]/gi, "border-border"],
  [/border-\[#E5E5E5\]/gi, "border-border"],
  [/border-l-\[#eceae4\]/gi, "border-l-border"],
  [/bg-\[#f6f9fc\]/gi, "bg-secondary"],
  [/bg-\[#F6F9FC\]/gi, "bg-secondary"],
  [/bg-\[#fcfbf8\]/gi, "bg-background"],
  [/bg-\[#eceae4\]/gi, "bg-muted"],
  [/from-\[#f6f9fc\]/gi, "from-secondary"],
  [/to-\[#e3e8ee\]/gi, "to-border"],
  [/from-\[#F6F9FC\]/gi, "from-secondary"],
  [/to-\[#E3E8EE\]/gi, "to-border"],

  // Text
  [/text-\[#64748d\]/gi, "text-muted-foreground"],
  [/text-\[#0d253d\]/gi, "text-foreground"],
  [/text-\[#1c1e54\]/gi, "text-foreground"],
  [/text-\[#61718a\]/gi, "text-muted-foreground"],
  [/text-\[#7D7D7D\]/gi, "text-muted-foreground"],
  [/text-\[#4A4A4A\]/gi, "text-body"],
  [/text-\[#363636\]/gi, "text-body"],
  [/text-\[#FF5722\]/gi, "text-accent-orange"],
  [/placeholder:text-\[#64748d\]/gi, "placeholder:text-muted-foreground"],
  [/prose-p:text-\[#64748d\]/gi, "prose-p:text-muted-foreground"],
  [/prose-li:marker:text-\[#0d253d\]/gi, "prose-li:marker:text-foreground"],
  [/prose-headings:text-\[#0d253d\]/gi, "prose-headings:text-foreground"],
  [/prose-strong:text-\[#0d253d\]/gi, "prose-strong:text-foreground"],
  [/prose-a:text-\[#0d253d\]/gi, "prose-a:text-foreground"],
  [/prose-blockquote:text-\[#64748d\]/gi, "prose-blockquote:text-muted-foreground"],
  [/prose-h2:border-\[#e3e8ee\]/gi, "prose-h2:border-border"],

  // Accent purple → accent orange (highlights, links, badges)
  [/text-\[#533afd\]/gi, "text-accent-orange"],
  [/text-\[#4434d4\]/gi, "text-accent-orange"],
  [/group-hover:text-\[#533afd\]/gi, "group-hover:text-accent-orange"],
  [/hover:text-\[#533afd\]/gi, "hover:text-accent-orange"],
  [/hover:text-\[#4434d4\]/gi, "hover:text-accent-orange/90"],
  [/group-hover:text-\[#4434d4\]/gi, "group-hover:text-accent-orange/90"],
  [/bg-\[#533afd\]/gi, "bg-accent-orange"],
  [/border-\[#533afd\]/gi, "border-accent-orange"],
  [/border-t-\[#533afd\]/gi, "border-t-accent-orange"],
  [/hover:border-\[#533afd\]\/30/gi, "hover:border-accent-orange/30"],
  [/group-hover:border-\[#533afd\]\/30/gi, "group-hover:border-accent-orange/30"],
  [/hover:border-\[#533afd\]\/40/gi, "hover:border-accent-orange/40"],
  [/group-hover:border-\[#b9b9f9\]/gi, "group-hover:border-accent-orange/40"],
  [/group-hover:bg-\[#b9b9f9\]\/20/gi, "group-hover:bg-accent-orange/10"],
  [/focus-visible:ring-\[#533afd\]/gi, "focus-visible:ring-accent-orange"],
  [/ring-\[#533afd\]/gi, "ring-accent-orange"],

  // Dark fills → primary ink
  [/bg-\[#1c1e54\]/gi, "bg-primary"],
  [/bg-\[#0d253d\]/gi, "bg-primary"],
  [/bg-\[#0F0F0F\]/gi, "bg-primary"],
  [/bg-\[#0A0A0A\]/gi, "bg-primary"],
  [/bg-navy/g, "bg-primary"],
  [/text-navy/g, "text-foreground"],
  [/from-\[#533afd\] to-\[#7c5cff\]/gi, "from-primary to-ink-strong"],
  [/from-\[#533afd\]/gi, "from-accent-orange"],
  [/to-\[#7c5cff\]/gi, "to-accent-orange/80"],

  // Hover backgrounds
  [/hover:bg-\[#f6f9fc\]/gi, "hover:bg-secondary"],
  [/hover:bg-\[#4434d4\]/gi, "hover:bg-accent-orange/90"],
  [/active:bg-\[#2e2b8c\]/gi, "active:opacity-90"],
  [/hover:bg-\[#eef0fe\]/gi, "hover:bg-secondary"],

  // Shadows
  [/shadow-\[rgba\(83,58,253,0\.3\)_0_8px_24px\]/gi, "shadow-[var(--shadow-accent-orange)]"],
  [/shadow-\[rgba\(83,58,253,0\.4\)_0_12px_32px\]/gi, "shadow-[var(--shadow-accent-orange)]"],
  [/shadow-\[rgba\(83,58,253,0\.2\)_0px_8px_24px\]/gi, "shadow-[var(--shadow-accent-orange-soft)]"],
  [/shadow-\[rgba\(83,58,253,0\.1\)_0_12px_32px\]/gi, "shadow-[var(--shadow-accent-orange-soft)]"],
  [/shadow-\[rgba\(83,58,253,0\.1\)_0_16px_48px\]/gi, "shadow-[var(--shadow-accent-orange-soft)]"],
  [/shadow-\[rgba\(0,55,112,0\.12\)_0_16px_48px,rgba\(0,55,112,0\.06\)_0_2px_8px\]/gi, "shadow-[var(--shadow-layered-strong)]"],
  [/shadow-\[rgba\(0,55,112,0\.04\)_0_1px_3px\]/gi, "shadow-[var(--shadow-layered)]"],
  [/shadow-\[rgba\(0,55,112,0\.08\)_0_8px_24px,rgba\(0,55,112,0\.04\)_0_2px_6px\]/gi, "shadow-[var(--shadow-layered)]"],
  [/shadow-\[rgba\(0,55,112,0\.1\)_0_4px_12px\]/gi, "shadow-[var(--shadow-layered)]"],
  [/shadow-\[rgba\(0,55,112,0\.15\)_0_8px_20px\]/gi, "shadow-[var(--shadow-layered-strong)]"],

  // Radius (Webflow sm/md)
  [/rounded-\[6px\]/g, "rounded-sm"],
  [/rounded-\[8px\]/g, "rounded-md"],
  [/rounded-\[12px\]/g, "rounded-md"],
  [/rounded-\[16px\]/g, "rounded-md"],
  [/rounded-\[20px\]/g, "rounded-md"],

  // Font weights (ceiling 600)
  [/font-\[800\]/g, "font-semibold"],
  [/font-\[700\]/g, "font-semibold"],
  [/font-\[600\]/g, "font-semibold"],
  [/font-\[300\]/g, "font-normal"],
  [/font-\[400\]/g, "font-normal"],

  // Misc hex in styles/gradients
  [/border-\[#FF5722\]/gi, "border-accent-orange"],
  [/hover:border-\[#FF5722\]/gi, "hover:border-accent-orange"],
  [/from-\[#FF5722\]/gi, "from-accent-orange"],
  [/to-\[#FF5722\]/gi, "to-accent-orange"],
  [/text-\[#FF5722\]/gi, "text-accent-orange"],
  [/bg-\[#FF5722\]/gi, "bg-accent-orange"],
  [/hover:bg-\[#ignite-orange\]/gi, "hover:bg-accent-orange/10"],
  [/border-3 border-\[#e3e8ee\]/gi, "border-2 border-border"],

  // Pass 2 — remaining stragglers
  [/hover:bg-\[#e3e8ee\]/gi, "hover:bg-muted"],
  [/text-\[#fcfbf8\]/gi, "text-primary-foreground"],
  [/group-hover:text-\[#fcfbf8\]/gi, "group-hover:text-primary-foreground"],
  [/to-\[#f6f9fc\]/gi, "to-secondary"],
  [/via-\[#f6f9fc\]/gi, "via-secondary"],
  [/from-\[#f6f9fc\]/gi, "from-secondary"],
  [/bg-\[#f8fafc\]/gi, "bg-secondary"],
  [/to-\[#f8fafc\]/gi, "to-secondary"],
  [/from-\[#eceae4\]/gi, "from-border"],
  [/via-\[#eceae4\]/gi, "via-border"],
  [/to-\[#eceae4\]/gi, "to-border"],
  [/bg-\[#e3e8ee\]/gi, "bg-border"],
  [/bg-\[#64748d\]/gi, "bg-muted-foreground"],
  [/border-\[#0d253d\]/gi, "border-primary"],
  [/border-4 border-\[#0d253d\]/gi, "border-4 border-primary"],
  [/from-\[#0d253d\]/gi, "from-primary"],
  [/to-\[#0d253d\]/gi, "to-primary"],
  [/to-\[#64748d\]/gi, "to-muted-foreground"],
  [/from-\[#64748d\]/gi, "from-muted-foreground"],
  [/via-\[#64748d\]/gi, "via-muted-foreground"],
  [/hover:border-\[#0d253d\]\/20/gi, "hover:border-primary/20"],
  [/hover:border-\[#a8c3de\]/gi, "hover:border-accent-orange/30"],
  [/group-hover:bg-\[#b9b9f9\]/gi, "group-hover:bg-accent-orange/20"],
  [/bg-\[#F8F8F8\]/gi, "bg-secondary"],
  [/text-\[#0A0A0A\]/gi, "text-foreground"],
  [/border-\[#0A0A0A\]/gi, "border-foreground"],
  [/text-\[#5f5f5d\]/gi, "text-body-mid"],
  [/text-\[#b9b9f9\]/gi, "text-accent-orange/60"],
  [/ignite-orange/g, "accent-orange"],
  [/grey-100/g, "secondary"],
  [/grey-200/g, "border"],
  [/grey-400/g, "body-mid"],
  [/rounded-2xl/g, "rounded-md"],
  [/rounded-xl/g, "rounded-md"],
  [/divide-\[#eceae4\]/gi, "divide-border"],
  [/from-\[#f7f4ed\]/gi, "from-secondary"],
  [/via-\[#f7f4ed\]/gi, "via-secondary"],
  [/to-\[#f7f4ed\]/gi, "to-secondary"],
  [/ring-offset-\[#f7f4ed\]/gi, "ring-offset-secondary"],
  [/hover:decoration-\[#1c1c1c\]/gi, "hover:decoration-primary"],
  [/decoration-\[#1c1c1c\]/gi, "decoration-primary"],
  [/border-\[#1c1c1c\]/gi, "border-primary"],
  [/ring-\[#1c1c1c\]/gi, "ring-primary"],
  [/ring-\[#eceae4\]/gi, "ring-border"],
  [/from-\[#06b6d4\]/gi, "from-accent-blue/10"],
  [/to-\[#06b6d4\]/gi, "to-accent-blue/10"],
  [/from-\[#f59e0b\]/gi, "from-accent-orange"],
  [/to-\[#fbbf24\]/gi, "to-accent-yellow"],
  [/bg-\[#f5e9d4\]/gi, "bg-accent-orange/10"],
  [/rounded-\[24px\]/g, "rounded-md"],
  [/rounded-\[100%\]/g, "rounded-full"],
  [/ min-h-screen text-foreground/g, " min-h-screen text-foreground bg-background"],
]

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue
      walk(full, out)
    } else if (/\.tsx$/.test(name)) {
      out.push(full)
    }
  }
  return out
}

let changed = 0
for (const file of walk(path.join(root, "components")).concat(walk(path.join(root, "app")))) {
  if (file.includes("migrate-design-tokens")) continue
  let src = fs.readFileSync(file, "utf8")
  const before = src
  for (const [re, rep] of REPLACEMENTS) {
    src = src.replace(re, rep)
  }
  if (src !== before) {
    fs.writeFileSync(file, src)
    changed++
    console.log("updated:", path.relative(root, file))
  }
}
console.log(`Done. ${changed} files updated.`)
