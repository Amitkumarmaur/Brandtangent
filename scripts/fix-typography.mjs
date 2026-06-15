/** Fix oversized raw Tailwind type classes → semantic utilities */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")

const REPLACEMENTS = [
  [/className="text-5xl lg:text-7xl xl:text-8xl font-semibold text-foreground leading-\[1\.05\] mb-8 text-balance"/g,
   'className="display-xxl text-foreground mb-6 text-balance"'],
  [/className="text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-\[1\.1\] mb-8 text-balance"/g,
   'className="display-xxl text-foreground mb-6 text-balance"'],
  [/className="text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-\[1\.1\] mb-8 text-balance max-w-4xl mx-auto"/g,
   'className="display-xxl text-foreground mb-6 text-balance max-w-4xl mx-auto"'],
  [/className="text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\] mb-6"/g,
   'className="display-lg text-foreground mb-4"'],
  [/className="text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\] mb-6 max-w-3xl mx-auto"/g,
   'className="display-lg text-foreground mb-4 max-w-3xl mx-auto"'],
  [/className="text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\]"/g,
   'className="display-lg text-foreground"'],
  [/className="text-4xl lg:text-5xl font-semibold leading-\[1\.2\] mb-6"/g,
   'className="display-lg mb-4"'],
  [/className="text-4xl lg:text-5xl font-semibold leading-\[1\.2\]"/g,
   'className="display-lg"'],
  [/className="text-3xl md:text-5xl font-semibold text-foreground text-balance"/g,
   'className="display-lg text-foreground text-balance"'],
  [/className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\] mb-4"/g,
   'className="display-xl text-foreground mb-3"'],
  [/className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-foreground mb-6 leading-\[1\.2\]"/g,
   'className="display-lg text-foreground mb-4"'],
  [/className="text-3xl lg:text-4xl font-semibold text-foreground mb-6 leading-\[1\.2\]"/g,
   'className="display-lg text-foreground mb-4"'],
  [/className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-\[1\.35\] tracking-tight mb-12"/g,
   'className="display-md text-foreground mb-8"'],
  [/className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-foreground mb-3"/g,
   'className="display-xl text-foreground mb-2"'],
  [/className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground md:text-4xl"/g,
   'className="display-lg text-foreground"'],
  [/className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"/g,
   'className="display-lg text-foreground"'],
  [/className="text-2xl md:text-3xl font-semibold text-foreground leading-snug group-hover:text-accent-orange transition-colors"/g,
   'className="display-sm text-foreground leading-snug group-hover:text-accent-orange transition-colors"'],
  [/className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-tight"/g,
   'className="display-sm text-foreground"'],
  [/className="text-\[2\.4rem\] md:text-5xl lg:text-\[3\.5rem\] font-semibold text-foreground leading-\[1\.05\] tracking-tight mb-8"/g,
   'className="display-xl text-foreground mb-6"'],
  [/className="text-3xl sm:text-4xl lg:text-\[3rem\] xl:text-\[3\.2rem\] leading-\[1\.05\] font-semibold tracking-\[-0\.03em\] uppercase text-primary-foreground"/g,
   'className="display-xl text-primary-foreground uppercase"'],
  [/className="text-4xl md:text-5xl font-semibold text-primary-foreground leading-none"/g,
   'className="display-lg text-primary-foreground"'],
  [/className="text-3xl lg:text-4xl font-semibold text-accent-orange"/g,
   'className="display-md text-accent-orange"'],
  [/className="text-3xl font-semibold text-accent-orange"/g,
   'className="display-md text-accent-orange"'],
  [/className="text-4xl font-semibold text-foreground group-hover:text-accent-orange transition-colors"/g,
   'className="display-md text-foreground group-hover:text-accent-orange transition-colors"'],
  [/className="text-4xl font-normal text-foreground tracking-tight"/g,
   'className="display-md text-foreground"'],
  [/className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight"/g,
   'className="display-lg text-foreground"'],
  [/className="text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\] mb-6">\s*\n\s*Join our team/g,
   'className="display-lg text-foreground mb-4">\n              Join our team'],
  [/className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight mb-6"/g,
   'className="display-lg text-foreground mb-4"'],
  [/className="font-mono text-5xl md:text-6xl lg:text-7xl tracking-tight text-accent-orange font-semibold \$\{className\}"/g,
   'className={`display-xl text-accent-orange tnum ${className}`}'],
  [/className="text-4xl md:text-5xl"/g, 'className="display-lg"'],
  [/className="text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\] mb-4"/g,
   'className="display-lg text-foreground mb-3"'],
  [/className="text-4xl lg:text-5xl font-semibold text-white mb-4 text-balance"/g,
   'className="display-lg text-white mb-3 text-balance"'],
  [/className="text-2xl md:text-3xl font-semibold text-foreground mb-12 md:mb-16"/g,
   'className="display-lg text-foreground mb-8 md:mb-10"'],
  [/className="text-primary\/20 text-5xl font-light leading-none mb-2 select-none"/g,
   'className="text-primary/20 text-4xl font-normal leading-none mb-2 select-none"'],
  [/className="text-7xl opacity-60"/g, 'className="text-5xl opacity-60"'],
  [/className="text-2xl md:text-3xl font-semibold select-none"/g, 'className="display-sm font-semibold select-none"'],
  [/className="text-2xl md:text-3xl \$\{trackingClass\} text-foreground \$\{weightClass\}"/g,
   'className={`display-sm text-foreground ${weightClass}`}'],
  [/className=\`\$\{weightClass\} text-2xl md:text-3xl text-foreground tracking-tight\`/g,
   'className={`${weightClass} display-sm text-foreground`}'],
  [/className="text-4xl lg:text-5xl font-semibold text-foreground leading-\[1\.2\] mb-6">\s*\{/g,
   'className="display-lg text-foreground mb-4">'],
]

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue
      walk(full, out)
    } else if (full.endsWith(".tsx")) out.push(full)
  }
  return out
}

let changed = 0
for (const file of walk(path.join(root, "components")).concat(walk(path.join(root, "app")))) {
  let src = fs.readFileSync(file, "utf8")
  const before = src
  for (const [re, rep] of REPLACEMENTS) src = src.replace(re, rep)
  if (src !== before) {
    fs.writeFileSync(file, src)
    changed++
    console.log("updated:", path.relative(root, file))
  }
}
console.log(`Done. ${changed} files.`)
