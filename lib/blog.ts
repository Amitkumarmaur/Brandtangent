/** Rough reading speed for markdown body (words per minute). */
const WORDS_PER_MINUTE = 200

export function estimateReadTimeFromMarkdown(markdown: string): string {
  const words = markdown
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  return `${minutes} min read`
}
