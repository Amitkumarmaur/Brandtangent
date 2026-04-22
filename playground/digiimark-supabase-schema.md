# DigiiMark — Supabase Backend Schema

> Complete database architecture for the DigiiMark website.
> Platform: Supabase (PostgreSQL) · Frontend: Next.js

---

## Overview

The backend consists of **10 tables** organized into three tiers:

- **Category & Content Hub** — Service Categories, Services, Case Studies, Blogs
- **Linked Reference Tables** — FAQ, Platforms/Tech Stack
- **Standalone Tables** — Leads, Testimonials, Careers (including Applications), Clients

**Service Categories** and **Services** act as the central hubs that link context together.

---

## Table Definitions

### 1. Service Categories

Groups related services together (e.g., "AI & Automation", "Development", "SEO").

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `name` | text | yes | Name of the category |
| `slug` | text | yes | URL slug |
| `seo_title` | text | no | Title tag for search engines |
| `meta_description` | text | no | Meta description for search engines |
| `icon` | text | no | Category icon |
| `display_order` | integer | no | Display ordering |
| `hero_display_title` | text | no | Hero headline |
| `hero_description` | text | no | Hero description |
| `hero_animated_words` | text[] | no | Words to animate in the hero |
| `hero_stat_value` | text | no | Standout stat value |
| `hero_stat_label` | text | no | Standout stat label |
| `featured_projects` | jsonb | no | Array of featured projects |
| `expertise_badge` | text | no | Badge label |
| `expertise_title` | text | no | Expertise section heading |
| `expertise_subtitle` | text | no | Expertise section description |
| `process_heading` | text | no | Process section heading |
| `process_description` | text | no | Process section description |
| `process_steps` | jsonb | no | Array of process steps |
| `tech_stack_ids` | uuid[] | no | Array of tech stack platform IDs |
| `target_industries` | jsonb | no | Array of targeted industries |
| `created_at` | timestamptz | yes | Auto-set |

**Relationships:**
- Services → Service Categories (Many-to-one via `category_id`)

---

### 2. Services

Represents a single service page on the site (e.g., "Marketing Automation"). Connects to a parent Category.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `category_id` | uuid (FK) | no | References `service_categories.id` |
| `slug` | text | yes | URL slug for the service page |
| `hero_h1` | text | yes | Main headline |
| `hero_description` | text | yes | Brief description in the hero |
| `hero_image` | text (URL) | yes | Hero banner image URL |
| `service_details` | jsonb | yes | Content blocks: `[{ "h3_title": "...", "description": "..." }]` |
| `methodology` | jsonb | yes | Process blocks: `[{ "serial_no": 1, "h3_title": "...", "description": "..." }]` |
| `what_we_provide` | jsonb | no | Defines the 'Our Web Services' grid: `[{ "title": "...", "description": "..." }]` |
| `seo_title` | text | no | Custom SEO title |
| `meta_description` | text | no | Page-level meta description |
| `name` | text | yes | Internal name of the service |
| `description` | text | no | Legacy short explanation |
| `short_description` | text | no | Legacy brief snippet |
| `icon` | text | no | Icon for the service |
| `display_order` | integer | no | Display ordering |
| `case_study_ids` | uuid[] | no | Array of case study IDs (Legacy manual linkage) |
| `platform_ids` | uuid[] | no | Array of platform IDs (Legacy manual linkage) |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

**Relationships:**
- `category_id` → **Service Categories** (many-to-one)
- Blogs → Services (each blog links to a service)
- FAQ → Services (each FAQ links to a service)

---

### 3. Blogs

Each row is a blog post. Supports pillar-cluster SEO architecture.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `slug` | text | yes | URL slug |
| `seo_title` | text | yes | Title tag for search engines |
| `meta_description` | text | yes | Meta description for search engines |
| `hero_image` | text (URL) | yes | Featured image URL |
| `body_content` | text | yes | Full blog content |
| `linked_service_id` | uuid (FK) | yes | References `services.id` |
| `linked_faq_ids` | uuid[] | no | Array of FAQ IDs |
| `published` | boolean | yes | Draft vs. published toggle |
| `published_at` | timestamptz | no | Publication date |
| `display_order` | integer | no | Display ranking |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

---

### 4. Case Studies

Rich, detailed records for portfolio pieces.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `slug` | text | yes | URL slug |
| `h1_title` | text | yes | Main headline |
| `brief_description` | text | yes | Short summary |
| `hero_image` | text (URL) | yes | Hero banner image |
| `industry` | text | yes | Client's industry |
| `tech_stack_used` | jsonb | yes | Tech stack array |
| `about_client_heading` | text | yes | Heading |
| `about_client_description` | text | yes | Description |
| `problems_heading` | text | yes | Heading |
| `problems_description` | text | yes | Description |
| `challenges` | jsonb | yes | List of challenges |
| `results` | jsonb | yes | List of quantitative results |
| `client_testimonial` | text | no | Dedicated text quote |
| `testimonial_id` | uuid (FK) | no | References `testimonials.id` |
| `linked_service_id` | uuid (FK) | yes | References `services.id` |
| `published` | boolean | yes | Draft vs. published |
| `display_order` | integer | no | Sorting order |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

---

### 5. FAQ

Reusable FAQ entries linked to services and case studies.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `question` | text | yes | FAQ question |
| `answer` | text | yes | FAQ answer |
| `linked_service_id` | uuid (FK) | yes | References `services.id` |
| `linked_case_study_id` | uuid (FK) | no | References `case_studies.id` |
| `sort_order` | integer | no | Display order |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

---

### 6. Platforms / Tech Stack

Catalog of tools and platforms DigiiMark works with.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `platform_name` | text | yes | Name (e.g. "n8n") |
| `url` | text | yes | Official URL |
| `logo` | text | no | Logo image URL |
| `linked_service_ids` | uuid[] | no | Array of services |
| `display_order` | integer | no | Display ranking |
| `created_at` | timestamptz | yes | Auto-set |

---

### 7. Leads

Form submissions.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `name` | text | yes | Full name |
| `email` | text | yes | Email |
| `phone` | text | no | Phone |
| `message` | text | no | Message |
| `source` | text | yes | Origin (e.g. "contact-form") |
| `created_at` | timestamptz | yes | Auto-set |

---

### 8. Testimonials

Client quotes.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `client_name` | text | yes | Person name |
| `role` | text | no | Job title / company |
| `quote` | text | yes | The testimonial text |
| `rating` | integer | no | Star rating (1-5) |
| `image` | text | no | Headshot |
| `linked_client_id` | uuid (FK) | no | References `clients.id` |
| `linked_case_study_id` | uuid (FK) | no | References `case_studies.id` |
| `sort_order` | integer | no | Display ordering |
| `created_at` | timestamptz | yes | Auto-set |

---

### 9. Careers & Applications

Job listings and applications.

**Careers:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `job_title` | text | yes | Position title |
| `description` | text | yes | Job description |
| `location` | text | no | Location string |
| `type` | text | no | e.g. "Full-time" |
| `status` | text | yes | 'open' or 'closed' |
| `created_at` | timestamptz | yes | Auto-set |
| `updated_at` | timestamptz | yes | Auto-updated |

**Applications:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `career_id` | uuid (FK) | yes | References `careers.id` |
| `full_name` | text | yes | Applicant name |
| `email` | text | yes | Applicant email |
| `phone` | text | no | Applicant phone |
| `resume_url` | text | no | File URL |
| `cover_letter` | text | no | Text or file URL |
| `created_at` | timestamptz | yes | Auto-set |

---

### 10. Clients

Client logos / company info.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | uuid | yes | Primary key |
| `client_name` | text | yes | Company name |
| `logo` | text | no | Logo image URL |
| `website_url` | text | no | Client website |
| `is_visible` | boolean | yes | Display toggle |
| `case_study_id` | uuid (FK) | no | References `case_studies.id` |
| `sort_order` | integer | no | Display order |
| `created_at` | timestamptz | yes | Auto-set |
