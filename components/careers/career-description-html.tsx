type Props = {
  html: string
}

/** Renders trusted HTML from our own `careers` table (admin-authored). */
export default function CareerDescriptionHtml({ html }: Props) {
  return (
    <div
      className="prose prose-neutral max-w-none text-muted-foreground prose-p:leading-relaxed prose-p:text-[1.05rem] prose-li:my-1.5 prose-li:marker:text-foreground prose-headings:text-foreground prose-headings:tracking-tight prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-h3:mt-8 prose-h3:mb-3 prose-strong:text-foreground prose-a:text-foreground prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-l-border prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:text-muted-foreground prose-ol:my-4 prose-ul:my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
