/**
 * Normalizes blog Markdown from Supabase (CMS paste, exports, Windows newlines)
 * so react-markdown + Tailwind prose render predictably.
 */

/** Strip site suffix from SEO titles for duplicate-heading checks. */
export function normalizeTitleForCompare(title: string): string {
  return title
    .replace(/\s*\|\s*DigiiMark\b.*$/i, "")
    .replace(/[#*_`]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

export function normalizeMarkdownBody(raw: string): string {
  let s = raw ?? ""
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1)
  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  s = s.replace(/[ \t]+\n/g, "\n")
  return s.trim()
}

/**
 * Removes the first Markdown heading when it duplicates the page title
 * (hero already shows H1; body often pastes `# Same title` from docs).
 */
export function stripLeadingHeadingMatchingTitle(markdown: string, displayTitle: string): string {
  const titleNorm = normalizeTitleForCompare(displayTitle)
  if (!titleNorm) return markdown

  const lines = markdown.split("\n")
  let i = 0
  while (i < lines.length && lines[i].trim() === "") i++
  if (i >= lines.length) return markdown

  const line = lines[i].trim()
  const m = line.match(/^(#{1,6})\s+(.+)$/)
  if (!m) return markdown

  const headingText = normalizeTitleForCompare(m[2])
  if (!headingText) return markdown

  if (
    headingText === titleNorm ||
    titleNorm.startsWith(headingText + " ") ||
    headingText.startsWith(titleNorm + " ")
  ) {
    lines.splice(i, 1)
    while (i < lines.length && lines[i].trim() === "") lines.splice(i, 1)
    return lines.join("\n").trimStart()
  }

  return markdown
}

export function prepareBlogMarkdownBody(raw: string, displayTitle: string): string {
  const normalized = normalizeMarkdownBody(raw)
  return stripLeadingHeadingMatchingTitle(normalized, displayTitle)
}
