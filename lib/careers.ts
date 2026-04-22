import { supabase } from "@/lib/supabase"

export type CareerRow = {
  id: string
  job_title: string
  location: string | null
  type: string | null
  status: string
}

/** Public read of open roles for the careers page (respects RLS on `careers`). */
export async function fetchOpenCareers(): Promise<{
  careers: CareerRow[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from("careers")
    .select("id, job_title, location, type, status")
    .eq("status", "open")
    .order("created_at", { ascending: true })

  if (error) {
    return { careers: [], error: error.message }
  }

  return { careers: (data as CareerRow[]) ?? [], error: null }
}
