import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ServicesDirectoryHero from "@/components/services/services-directory-hero"
import ServicesDirectory, {
  type ServiceCategoryRow,
  type ServiceListRow,
} from "@/components/services/services-directory"
import { supabase } from "@/lib/supabase"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Services | DigiiMark",
  description:
    "Explore DigiiMark services — AI, automation, web, SEO, paid media, and full-funnel B2B marketing systems. Open any capability for methodology, stack, and proof.",
}

export default async function ServicesIndexPage() {
  const [servicesRes, categoriesRes] = await Promise.all([
    supabase
      .from("services")
      .select(
        "id, slug, name, hero_h1, hero_description, hero_image, short_description, description, category_id, display_order"
      )
      .order("display_order", { ascending: true }),
    supabase
      .from("service_categories")
      .select("id, name, slug, display_order")
      .order("display_order", { ascending: true }),
  ])

  const services = (servicesRes.data ?? []) as ServiceListRow[]
  const categories = (categoriesRes.data ?? []) as ServiceCategoryRow[]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ServicesDirectoryHero />
      <ServicesDirectory categories={categories} services={services} />
      <Footer />
    </main>
  )
}
