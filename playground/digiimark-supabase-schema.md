# DigiiMark — Supabase Backend Schema

> Complete database architecture for the DigiiMark website.
> Platform: Supabase (PostgreSQL) · Frontend: Next.js

---

## Overview

The backend consists of **9 tables** organized into three tiers:

- **Content Tables** — Blogs, Services, Case Studies (rich, structured content powering the main site pages)
- **Linked Reference Tables** — FAQ, Platforms/Tech Stack (exist to be referenced by content tables)
- **Standalone Tables** — Leads, Testimonials, Careers, Clients (independent data, no cross-references)

Services is the **central hub** — almost every other table connects to it directly or indirectly.

---

## Table Definitions

### 1. Services

The most connected table. Each row represents a single service page on the site (e.g., "Marketing Automation," "SEO & AEO," "Web Development").

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key, auto-generated |
| `slug` | text | yes | URL slug for the service page (e.g., `marketing-automation`) |
| `hero_h1` | text | yes | Main headline for the service page |
| `hero_description` | text | yes | Brief description shown in the hero section |
| `hero_image` | text (URL) | yes | Hero banner image URL (Supabase Storage) |
| `service_details` | jsonb | yes | Array of objects: `[{ "h3_title": "...", "description": "..." }, ...]` |
| `methodology` | jsonb | yes | Array of objects: `[{ "serial_no": 1, "h3_title": "...", "description": "..." }, ...]` |
| `seo_title` | text | no | Custom SEO title (falls back to `hero_h1` if empty) |
| `meta_description` | text | no | Page-level meta description |
| `created_at` | timestamptz | yes | Auto-set on insert |
| `updated_at` | timestamptz | yes | Auto-updated on change |

**JSON field structures:**

```json
// service_details example
[
  {
    "h3_title": "Email Campaign Automation",
    "description": "End-to-end automated email sequences..."
  },
  {
    "h3_title": "CRM Integration",
    "description": "Seamless connections to HubSpot, Salesforce..."
  }
]

// methodology example
[
  {
    "serial_no": 1,
    "h3_title": "Discovery & Audit",
    "description": "We start by mapping your current workflows..."
  },
  {
    "serial_no": 2,
    "h3_title": "Strategy & Architecture",
    "description": "Custom automation blueprint designed around..."
  }
]
```

**Relationships (inbound):**
- Blogs → Services (each blog links to a service)
- FAQ → Services (each FAQ links to a service)
- Platforms/Tech Stack → Services (each platform links to services it's used in)

**Relationships (outbound):**
- Services pulls Case Studies via filtered query (not a direct FK — case studies are filtered by their `linked_service_id`)
- Services pulls Platforms/Tech Stack via the reference on the Platforms table

---

### 2. Blogs

Each row is a blog post. Blogs support the pillar-cluster SEO architecture — every blog links back to a parent service (pillar) and can reference related FAQs.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `slug` | text | yes | URL slug |
| `seo_title` | text | yes | Title tag for search engines |
| `meta_description` | text | yes | Meta description for search engines |
| `hero_image` | text (URL) | yes | Featured image URL |
| `body_content` | text (richtext/MDX) | yes | Full blog content — supports rich text or MDX |
| `linked_service_id` | uuid (FK) | yes | References `services.id` — the parent service pillar |
| `linked_faq_ids` | uuid[] | no | Array of FAQ IDs related to this blog post |
| `published` | boolean | yes | Draft vs. published toggle |
| `published_at` | timestamptz | no | Publication date |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

**Relationships:**
- `linked_service_id` → **Services** (many-to-one) — every blog belongs to one service pillar
- `linked_faq_ids` → **FAQ** (many-to-many via array) — blog can reference multiple FAQs shown at the bottom of the post

---

### 3. Case Studies

The single source of truth for all case study data. Rich, detailed records that get pulled into service pages via filtered queries and also have their own standalone pages.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `slug` | text | yes | URL slug for standalone case study page |
| `h1_title` | text | yes | Main headline |
| `brief_description` | text | yes | Short summary shown in cards and hero |
| `hero_image` | text (URL) | yes | Hero banner image |
| `industry` | text | yes | Client's industry (e.g., "InsureTech," "eCommerce") |
| `tech_stack_used` | jsonb | yes | Array of objects: `[{ "name": "n8n", "logo": "url", "link": "url" }, ...]` |
| `about_client_heading` | text | yes | Heading for the "About Client" section |
| `about_client_description` | text | yes | Description of the client |
| `problems_heading` | text | yes | Heading for the problems section |
| `problems_description` | text | yes | Description of problems the client faced |
| `challenges` | jsonb | yes | Array of objects: `[{ "title": "...", "description": "..." }, ...]` |
| `results` | jsonb | yes | Array of objects: `[{ "roi_heading": "...", "roi_number": "...", "image": "url" }, ...]` |
| `client_testimonial` | text | no | Pull quote from the client |
| `linked_service_id` | uuid (FK) | yes | References `services.id` — which service this case study belongs to |
| `published` | boolean | yes | Draft vs. published |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

**JSON field structures:**

```json
// tech_stack_used
[
  { "name": "n8n", "logo": "/logos/n8n.svg", "link": "https://n8n.io" },
  { "name": "Supabase", "logo": "/logos/supabase.svg", "link": "https://supabase.com" }
]

// challenges
[
  { "title": "Manual Lead Routing", "description": "Leads were manually assigned..." },
  { "title": "No Attribution Tracking", "description": "Zero visibility into..." }
]

// results
[
  { "roi_heading": "Lead Response Time", "roi_number": "85% faster", "image": null },
  { "roi_heading": "Revenue Impact", "roi_number": "+$240K ARR", "image": "/charts/revenue.png" }
]
```

**Relationships:**
- `linked_service_id` → **Services** (many-to-one) — each case study belongs to one service
- Referenced by **FAQ** via `linked_case_study_id`
- Pulled into service pages by querying: `SELECT * FROM case_studies WHERE linked_service_id = <service_id>`

---

### 4. FAQ

Reusable FAQ entries that can be linked to both services and case studies. Supports the pillar-cluster SEO strategy and also generates FAQ schema markup (JSON-LD) for search engines.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `question` | text | yes | The FAQ question |
| `answer` | text (richtext) | yes | The FAQ answer — supports rich text |
| `linked_service_id` | uuid (FK) | yes | References `services.id` |
| `linked_case_study_id` | uuid (FK) | no | References `case_studies.id` (optional) |
| `sort_order` | integer | no | Display ordering within a service page |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

**Relationships:**
- `linked_service_id` → **Services** (many-to-one) — every FAQ belongs to a service
- `linked_case_study_id` → **Case Studies** (many-to-one, optional) — FAQ can optionally relate to a specific case study
- Referenced by **Blogs** via `linked_faq_ids` array

---

### 5. Platforms / Tech Stack

A catalog of all tools, platforms, and technologies DigiiMark works with. Linked to services to show which tech stack is used for each service offering.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `platform_name` | text | yes | Name of the platform (e.g., "n8n," "Webflow," "Supabase") |
| `url` | text | yes | Official URL of the platform |
| `logo` | text (URL) | no | Logo image URL |
| `linked_service_ids` | uuid[] | yes | Array of service IDs this platform is used in |
| `created_at` | timestamptz | yes | Auto-set |

**Relationships:**
- `linked_service_ids` → **Services** (many-to-many via array) — each platform can be used across multiple services

---

### 6. Leads

Form submissions from the website. No cross-references to other tables — standalone data collected via n8n webhook.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `name` | text | yes | Full name |
| `email` | text | yes | Email address |
| `phone` | text | no | Phone number |
| `message` | text | no | Message from the contact form |
| `source` | text | yes | Where the lead came from (e.g., "contact-form," "the-lab," "blog-cta") |
| `created_at` | timestamptz | yes | Auto-set — effectively the submission timestamp |

---

### 7. Testimonials

Client testimonials displayed across the site. Standalone — not linked to other tables.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `client_name` | text | yes | Name of the person |
| `role` | text | yes | Job title / company (e.g., "CEO, Acme Corp") |
| `quote` | text | yes | The testimonial text |
| `rating` | integer | no | Star rating (1–5) |
| `image` | text (URL) | no | Headshot or company logo |
| `linked_client_id` | uuid (FK) | no | References `clients.id` — pull client logo alongside the quote |
| `linked_case_study_id` | uuid (FK) | no | References `case_studies.id` — surfaces this testimonial on the case study page |
| `sort_order` | integer | no | Display ordering |
| `created_at` | timestamptz | yes | Auto-set |

**Relationships:**
- `linked_client_id` → **Clients** (many-to-one, optional) — attribute the testimonial to a tracked client company
- `linked_case_study_id` → **Case Studies** (many-to-one, optional) — link the testimonial to the project it came from

---

### 8. Careers

Job listings for the careers page. Standalone table.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `job_title` | text | yes | Position title |
| `description` | text (richtext) | yes | Full job description — responsibilities, requirements, etc. |
| `location` | text | yes | e.g., "Vancouver, BC" or "Remote" |
| `type` | text | yes | e.g., "Full-time," "Contract," "Part-time" |
| `status` | text | yes | "open" or "closed" |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

---

### 9. Clients

Client logos and info for the "Trusted By" or client showcase sections. Standalone table.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `client_name` | text | yes | Company name |
| `logo` | text (URL) | yes | Client logo image |
| `industry` | text | no | Client's industry vertical |
| `sort_order` | integer | no | Display ordering |
| `created_at` | timestamptz | yes | Auto-set |

---

## Entity Relationship Map

```
┌──────────┐       linked_service_id       ┌──────────────┐     linked_service_id     ┌──────────────┐
│          │ ─────────────────────────────► │              │ ◄─────────────────────────  │              │
│  BLOGS   │                               │   SERVICES   │                            │ CASE STUDIES │
│          │                               │    (Hub)     │ ──── pulls via filter ───► │              │
└────┬─────┘                               └──────┬───────┘                            └──────┬───────┘
     │                                            │  ▲                                        ▲
     │ linked_faq_ids                              │  │                                        │
     │                                             │  │ linked_service_id          linked_case_study_id
     ▼                                             │  │                                        │
┌──────────┐   linked_service_id                   │  │          ┌─────────────────────────────┘
│          │ ──────────────────────────────────────►│  │          │
│   FAQ    │                                          │          │
│          │ ──── linked_case_study_id ───────────────┼──────────┘
└──────────┘                                          │
                                                      │
┌────────────────────┐  linked_service_ids            │
│ PLATFORMS /        │ ───────────────────────────────►│
│ TECH STACK         │
└────────────────────┘


┌──────────┐  ┌───────────────────────────────────────┐  ┌──────────┐
│  LEADS   │  │            TESTIMONIALS               │  │ CAREERS  │
│(standalone)│ │  linked_client_id ──────────────────►│  │(standalone)│
└──────────┘  │  linked_case_study_id ────────────►  │  └──────────┘
              └───────────────────────────────────────┘
                          │                  │
                          ▼                  ▼
                      CLIENTS          CASE STUDIES
```

---

## Relationship Summary

| From | To | Field | Type | Direction |
|---|---|---|---|---|
| Blogs | Services | `linked_service_id` | FK (uuid) | Many blogs → one service |
| Blogs | FAQ | `linked_faq_ids` | uuid[] array | Many blogs → many FAQs |
| Case Studies | Services | `linked_service_id` | FK (uuid) | Many case studies → one service |
| FAQ | Services | `linked_service_id` | FK (uuid) | Many FAQs → one service |
| FAQ | Case Studies | `linked_case_study_id` | FK (uuid, optional) | Many FAQs → one case study |
| Platforms | Services | `linked_service_ids` | uuid[] array | Many platforms → many services |
| Testimonials | Clients | `linked_client_id` | FK (uuid, optional) | Many testimonials → one client |
| Testimonials | Case Studies | `linked_case_study_id` | FK (uuid, optional) | Many testimonials → one case study |
| Services | Case Studies | filtered query | No FK on Services | Service page pulls matching case studies |
| Services | Platforms | reverse lookup | No FK on Services | Service page pulls platforms where service ID is in the array |

---

## How Data Flows on the Frontend

### Service Page (`/services/[slug]`)

1. Fetch the service row by `slug`
2. Query **Case Studies** where `linked_service_id` matches → display as case study cards (image, category, title, description, stats)
3. Query **FAQ** where `linked_service_id` matches → render FAQ accordion + JSON-LD schema
4. Query **Platforms/Tech Stack** where the service ID appears in `linked_service_ids` → render tech stack logos with links

### Blog Post (`/blog/[slug]`)

1. Fetch the blog row by `slug`
2. Resolve `linked_service_id` → show breadcrumb trail back to service pillar page
3. Resolve `linked_faq_ids` → render related FAQs at the bottom of the post

### Case Study Page (`/case-studies/[slug]`)

1. Fetch the case study row by `slug`
2. All data is self-contained in the row — hero, about client, problems, challenges, results, testimonial
3. `tech_stack_used` JSON renders inline (not from the Platforms table — this is case-study-specific tech)
4. Resolve `linked_service_id` → breadcrumb and "Back to Service" CTA

### Homepage

1. Query **Testimonials** ordered by `sort_order` → testimonial carousel
2. Query **Clients** ordered by `sort_order` → client logo strip
3. Query **Case Studies** (limit 3, most recent) → featured case study cards

---

## Supabase-Specific Notes

### Row Level Security (RLS)

- **Public read** on: Services, Blogs, Case Studies, FAQ, Platforms, Testimonials, Careers, Clients
- **Insert-only (no read)** on: Leads — public can submit, only authenticated admin can view
- **Full CRUD** (admin only) on: all tables via authenticated Supabase dashboard or admin panel

### Storage Buckets

- `hero-images` — service, blog, and case study hero images
- `logos` — client logos, tech stack logos
- `case-study-assets` — result charts, screenshots, supporting visuals

### Indexes

- `services.slug` — unique index
- `blogs.slug` — unique index
- `case_studies.slug` — unique index
- `case_studies.linked_service_id` — index for fast service page queries
- `faq.linked_service_id` — index for fast service page queries
- `blogs.linked_service_id` — index for pillar-cluster lookups
- `leads.created_at` — index for chronological lead review

### API Access

- Frontend fetches via Supabase JS client with `anon` key (public, read-only through RLS)
- Form submissions (Leads) route through n8n webhooks → Supabase insert via service role key
- Admin panel uses `service_role` key for full CRUD
