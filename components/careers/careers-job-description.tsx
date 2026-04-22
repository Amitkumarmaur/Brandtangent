type Props = {
  html: string
}

/** Renders trusted HTML job descriptions from Supabase with typography aligned to blog posts. */
export default function CareersJobDescription({ html }: Props) {
  return (
    <div
      className="prose prose-lg prose-neutral max-w-none
       prose-headings:font-heading prose-headings:font-semibold prose-headings:text-foreground
       prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3
       prose-p:text-body prose-p:leading-relaxed prose-p:mb-4 prose-p:text-grey-600
       prose-strong:text-foreground prose-strong:font-bold
       prose-ul:text-grey-600 prose-ol:text-grey-600 prose-li:mb-2
       prose-li:marker:text-ignite-orange"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
