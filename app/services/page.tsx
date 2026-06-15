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
  title: "Services | Brandtangent",
  description:
    "Explore Brandtangent services — brand strategy, identity systems, web design, digital marketing, and creative campaigns. Open any capability for methodology and proof.",
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
      .select("id, name, slug, display_order, hero_description")
      .order("display_order", { ascending: true }),
  ])

  const services = (servicesRes.data ?? []) as ServiceListRow[]
  const categories = (categoriesRes.data ?? []) as ServiceCategoryRow[]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ServicesDirectoryHero />
      <ServicesDirectory categories={categories} services={services} />
      <Footer />
    </main>
  )
}
