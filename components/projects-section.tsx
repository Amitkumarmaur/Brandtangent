import ProjectsSectionClient from "@/components/projects-section-client"
import { fetchHomepageProjectsData } from "@/lib/projects-section-data"

/** Homepage “Our work” carousel — `case_studies` + `service_categories` (via linked `services`). */
export default async function ProjectsSection() {
  const { cards, categories, error } = await fetchHomepageProjectsData()
  return <ProjectsSectionClient cards={cards} categories={categories} loadError={error} />
}
