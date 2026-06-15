import { NextResponse, type NextRequest } from "next/server"
import { supabase } from "@/lib/supabase"
import { createSupabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

type VerificationResult = {
  timestamp: string
  supabaseUrl: string
  anonKeyConfigured: boolean
  serviceRoleKeyConfigured: boolean
  tables: { [key: string]: { exists: boolean; columnCount?: number; error?: string } }
  storageBuckets: { [key: string]: { exists: boolean; error?: string } }
  rls: { [key: string]: { enabled: boolean; error?: string } }
  issues: string[]
  warnings: string[]
  isHealthy: boolean
}

export async function GET(req: NextRequest) {
  // Verify this is being called from localhost or with an admin key
  const adminKey = req.nextUrl.searchParams.get("key")
  if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-8)) {
    // Simple security check: requires last 8 chars of service role key
    return NextResponse.json(
      { error: "Unauthorized. This endpoint is for local development/debugging only." },
      { status: 401 }
    )
  }

  const result: VerificationResult = {
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET",
    anonKeyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    serviceRoleKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    tables: {},
    storageBuckets: {},
    rls: {},
    issues: [],
    warnings: [],
    isHealthy: true,
  }

  // Check anon client (public reads)
  const requiredTables = [
    "careers",
    "blogs",
    "content_categories",
    "blog_content_categories",
    "case_studies",
    "case_study_content_categories",
    "service_categories",
    "services",
    "industries",
  ]

  for (const table of requiredTables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })

      if (error) {
        result.tables[table] = { exists: false, error: error.message }
        result.issues.push(`Table '${table}' error: ${error.message}`)
        result.isHealthy = false
      } else {
        result.tables[table] = { exists: true, columnCount: 0 }
        // Count rows for debugging
        if (count !== null) {
          result.tables[table].columnCount = count
        }
      }
    } catch (err) {
      result.tables[table] = { exists: false, error: String(err) }
      result.issues.push(`Table '${table}' connection failed: ${err}`)
      result.isHealthy = false
    }
  }

  // Check admin client (for writes)
  const admin = createSupabaseAdmin()
  if (!admin) {
    result.issues.push("SUPABASE_SERVICE_ROLE_KEY is not configured")
    result.isHealthy = false
  } else {
    // Check applications table (write-only for careers apply)
    try {
      const { error, count } = await admin
        .from("applications")
        .select("*", { count: "exact", head: true })

      if (error) {
        result.tables["applications"] = { exists: false, error: error.message }
        result.issues.push(`Table 'applications' error: ${error.message}`)
        result.isHealthy = false
      } else {
        result.tables["applications"] = { exists: true, columnCount: count || 0 }
      }
    } catch (err) {
      result.tables["applications"] = { exists: false, error: String(err) }
      result.issues.push(`Table 'applications' connection failed: ${err}`)
      result.isHealthy = false
    }

    // Check resumes storage bucket
    try {
      const { data: buckets, error } = await admin.storage.listBuckets()
      if (error) {
        result.storageBuckets["resumes"] = { exists: false, error: error.message }
        result.warnings.push(`Storage check failed: ${error.message}`)
      } else {
        const resumesBucket = buckets?.find((b) => b.name === "resumes")
        result.storageBuckets["resumes"] = { exists: !!resumesBucket }
        if (!resumesBucket) {
          result.warnings.push("Storage bucket 'resumes' not found")
        }
      }
    } catch (err) {
      result.storageBuckets["resumes"] = { exists: false, error: String(err) }
      result.warnings.push(`Storage bucket check failed: ${err}`)
    }
  }

  // Environment checks
  if (!result.anonKeyConfigured) {
    result.issues.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured")
    result.isHealthy = false
  }

  if (!process.env.CONTACT_INQUIRY_WEBHOOK_URL) {
    result.warnings.push("CONTACT_INQUIRY_WEBHOOK_URL is not configured (contact form will fail)")
  }

  if (!process.env.CAREERS_APPLICATION_WEBHOOK_URL) {
    result.warnings.push("CAREERS_APPLICATION_WEBHOOK_URL is not configured (career notifications disabled)")
  }

  if (!process.env.CHAT_AGENT_URL && process.env.VERCEL) {
    result.warnings.push("CHAT_AGENT_URL is not configured in production (chat agent will be unavailable)")
  }

  return NextResponse.json(result)
}
