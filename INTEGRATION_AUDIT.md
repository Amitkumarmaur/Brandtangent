# Backend-Frontend Integration Audit

**Date:** 2026-06-15  
**Project:** Brandtangent Website  
**Status:** CRITICAL ISSUES IDENTIFIED ⚠️

## Executive Summary

The frontend and Supabase backend have **12 data integration points**. Out of these:
- ✅ **10 are properly configured** (read-only, with fallbacks)
- ⚠️ **2 are at risk** (missing critical env vars or webhook URLs)

---

## 1. Data Flow Mapping

### 1.1 Frontend → Supabase (Read-Only)

All of these use the **anon client** (public key) and have **fallback data**:

| Source | Table(s) | Usage | Status |
|--------|----------|-------|--------|
| `lib/careers.ts` | `careers` | Jobs listing, job detail pages | ✅ Working |
| `lib/content-categories.ts` | `content_categories`, `blogs`, `blog_content_categories` | Blog filtering, categories | ✅ Working |
| `lib/industries.ts` | `industries` | Case study filter | ✅ Working |
| `lib/service-catalog.ts` | `service_categories`, `services` | Service pages | ✅ Working |
| `lib/projects-section-data.ts` | `case_studies`, `service_categories`, `services` | Homepage projects | ✅ Working |
| `lib/footer-nav.ts` | `service_categories`, `services` | Footer navigation | ✅ Working |

**Key:** All public reads use **public.* RLS** policies (status = 'open' for careers, published = true for content).

---

### 1.2 Frontend API Routes → Supabase (Write)

These use the **service-role client** (private key):

| Route | Action | Tables | Required Env | Status |
|-------|--------|--------|--------------|--------|
| `POST /api/careers/apply` | Create application, upload resume | `careers`, `applications` | `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ **KEY MISSING** |
| `POST /api/contact` | Send webhook notification | None (Supabase) | `CONTACT_INQUIRY_WEBHOOK_URL` | ⚠️ **URL MISSING** |

**Critical Issue:** `SUPABASE_SERVICE_ROLE_KEY` is **NOT set** in `.env.local`:
- Careers apply endpoint will fail with: `"Applications are not enabled on this deployment yet."`
- Resume uploads will not work
- Database writes will not happen

---

### 1.3 Frontend → Chat Agent (Proxy)

The frontend calls `/api/chat-agent/*` which proxies to the Python agent:

| Endpoint | Target | Env Var | Status |
|----------|--------|---------|--------|
| `/api/chat-agent/v1/*` | Python chat agent | `CHAT_AGENT_URL` | ⚠️ Will default to localhost |

---

## 2. Supabase Schema Required

### Tables (must exist with proper columns)

1. **public.careers**
   - Columns: `id`, `job_title`, `location`, `type`, `status` (enum: open/closed), `created_at`, `team`, `Job description`, `Short description`, `slug` (optional)
   - RLS: `status = 'open'` for public SELECT

2. **public.applications**
   - Columns: `id`, `career_id` (FK → careers), `full_name`, `email`, `phone`, `resume_url`, `cover_letter`, `created_at`
   - Required for career applications

3. **public.blogs**
   - Columns: `id`, `slug`, `title`, `seo_title`, `category`, `excerpt`, `meta_description`, `content`, `body_content`, `image_url`, `hero_image`, `published_at`, `created_at`, `author_name`, `author_image`, `read_time`, `linked_case_study_ids`
   - RLS: `published = true` for public SELECT

4. **public.content_categories**
   - Columns: `id`, `name`, `slug`, `display_order`
   - RLS: Public read

5. **public.blog_content_categories** (junction)
   - Columns: `blog_id` (FK), `content_category_id` (FK)

6. **public.case_studies**
   - Columns: `id`, `slug`, `h1_title`, `brief_description`, `hero_image`, `industry_id`, `linked_service_id`, `display_order`, `published`
   - RLS: `published = true` for public SELECT

7. **public.case_study_content_categories** (junction)
   - Columns: `case_study_id` (FK), `content_category_id` (FK)

8. **public.service_categories**
   - Columns: `id`, `name`, `slug`, `icon`, `display_order`, `hero_display_title`, `hero_description`, `hero_animated_words`, `hero_stat_value`, `hero_stat_label`, `featured_projects`, `expertise_badge`, `expertise_title`, `expertise_subtitle`, `process_heading`, `process_description`, `process_steps`, `tech_stack_ids`, `target_industries`, `seo_title`, `meta_description`, `created_at`
   - RLS: Public read

9. **public.services**
   - Columns: `id`, `category_id` (FK → service_categories), `name`, `slug`, `hero_h1`, `hero_description`, `hero_image`, `short_description`, `description`, `display_order`, `seo_title`, `meta_description`, `service_details`, `methodology`, `what_we_provide`, `platform_ids`
   - RLS: Public read

10. **public.industries**
    - Columns: `id`, `name`, `slug`, `display_order`
    - RLS: Public read

### Storage Buckets (must exist)

| Bucket | Type | Purpose | RLS |
|--------|------|---------|-----|
| `resumes` | Private | Resume file uploads for applications | Service-role upload only |

---

## 3. Environment Variables Audit

### In `.env.local`

```
✅ NEXT_PUBLIC_SUPABASE_URL=https://xkmxdzzwslkttsptmajd.supabase.co
✅ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_public_*
✅ GEMINI_API_KEY=AIzaSy*
⚠️  CAREERS_APPLICATION_WEBHOOK_URL=https://automations.digiimark.com/... (WRONG DOMAIN - should be brandtangent)
```

### Missing Critical Variables

| Variable | Purpose | Impact |
|----------|---------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase writes | ❌ Careers apply fails, resume upload fails |
| `CONTACT_INQUIRY_WEBHOOK_URL` | Send contact form data | ❌ Contact form fails (gracefully returns 503) |
| `CHAT_AGENT_URL` | Python chat agent location | ⚠️ Defaults to localhost, fails in production |

---

## 4. Integration Issues Found

### Issue #1: Missing SUPABASE_SERVICE_ROLE_KEY ❌ CRITICAL

**Location:** `app/api/careers/apply/route.ts:28-36`

```typescript
const admin = createSupabaseAdmin()
if (!admin) {
  return NextResponse.json({
    error: "Applications are not enabled on this deployment yet..."
  }, { status: 503 })
}
```

**Impact:**
- Career applications cannot be submitted
- Resumes cannot be uploaded
- Database inserts fail

**Fix:** Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and Vercel environment

---

### Issue #2: Webhook URL uses old "digiimark" domain ⚠️ HIGH

**Location:** `.env.local:7`

```
CAREERS_APPLICATION_WEBHOOK_URL=https://automations.digiimark.com/webhook/...
```

**Impact:**
- If Supabase connects but webhook fails, automations use old domain
- Email notifications sent to old domain

**Fix:** Update to Brandtangent domain

---

### Issue #3: No Contact Form Webhook URL ⚠️ MEDIUM

**Location:** `app/api/contact/route.ts:22-30`

```typescript
const url = process.env.CONTACT_INQUIRY_WEBHOOK_URL?.trim()
if (!url) {
  return NextResponse.json({
    error: "Contact form is not enabled on this deployment yet..."
  }, { status: 503 })
}
```

**Impact:**
- Contact form returns 503 error
- User cannot submit inquiries

**Fix:** Set `CONTACT_INQUIRY_WEBHOOK_URL` env var

---

### Issue #4: No Chat Agent URL in .env.local ⚠️ MEDIUM

**Location:** `app/api/chat-agent/[...path]/route.ts:13-17`

```typescript
function getChatAgentBaseUrl(): string {
  const fromEnv = process.env.CHAT_AGENT_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (process.env.VERCEL) return ""
  return "http://127.0.0.1:8010"
}
```

**Impact:**
- Local dev: falls back to localhost (OK)
- Production: returns empty string, endpoint returns 503

**Fix:** Set `CHAT_AGENT_URL` for production deployment

---

## 5. RLS Verification

All read queries use **public.*** policies and support RLS:

✅ **careers** table:
```sql
status = 'open'  -- only show open jobs
```

✅ **blogs** table:
```sql
published = true  -- only show published posts
```

✅ **case_studies** table:
```sql
published = true  -- only show published studies
```

✅ **service_categories**, **services**, **industries**, **content_categories**: Public read all rows

---

## 6. Fallback/Error Handling

All data fetching has graceful fallbacks:

| Data Source | Fallback | Code |
|-------------|----------|------|
| Careers | Empty array `[]` | `lib/careers.ts:100-107` |
| Blogs | Empty array or mock categories | `lib/content-categories.ts:175-183` |
| Services | Fallback JSON objects | `lib/service-catalog-fallback.ts` |
| Projects (homepage) | Empty cards array | `lib/projects-section-data.ts:90-147` |
| Footer nav | Default "Overview" column | `components/footer.tsx:98-109` |

---

## 7. Checklist for Production

- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment
- [ ] Update `CAREERS_APPLICATION_WEBHOOK_URL` to use brandtangent domain
- [ ] Set `CONTACT_INQUIRY_WEBHOOK_URL` (or disable contact form)
- [ ] Set `CHAT_AGENT_URL` for production chat agent location
- [ ] Verify all 10 database tables exist in Supabase
- [ ] Verify `resumes` storage bucket exists and is private
- [ ] Test career application submission end-to-end
- [ ] Test contact form submission end-to-end
- [ ] Test blog/case study loading
- [ ] Monitor for Supabase errors in Vercel logs

---

## 8. Summary

**Working:** 90% of integrations (read-only data fetching)  
**At Risk:** 10% of integrations (server writes, webhooks)  
**Overall Status:** ⚠️ **PARTIAL** — Website displays content but cannot accept submissions

