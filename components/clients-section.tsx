import ClientsSectionClient from "@/components/clients-section-client"
import { fetchClientsForMarquee, splitClientsIntoTwoRows } from "@/lib/clients-marquee"

/** “Our clients” — `public.clients` (`is_visible`, `sort_order`) with optional `website_url` on each mark. */
export default async function ClientsSection() {
  const { clients, error } = await fetchClientsForMarquee()
  if (!clients.length) {
    if (error) {
      return (
        <section className="relative w-full bg-foreground py-16 lg:py-20 overflow-hidden border-t border-white/10 font-sans">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-sm text-red-300/90" role="alert">
              Clients could not be loaded ({error}).
            </p>
          </div>
        </section>
      )
    }
    return null
  }
  const { row1, row2 } = splitClientsIntoTwoRows(clients)
  return <ClientsSectionClient row1={row1} row2={row2} loadError={error} />
}
