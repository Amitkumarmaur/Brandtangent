#!/usr/bin/env python3
"""
sync_voice_kb.py — Populate Supabase knowledge_base tables from site content.

Sources synced:
  * Manual markdown docs in voice_agent/knowledge_base/  (category: company / pricing)
  * service_categories                                    (category: service_category)
  * services                                              (category: service)
  * faq (is_active = true)                                (category: faq)
  * case_studies (published = true)                       (category: case_study)
  * blogs (published = true, top 20 by published_at)      (category: blog)

Algorithm per document:
  1. Render canonical markdown.
  2. sha256(markdown) → content_hash.
  3. Upsert knowledge_base_documents by (source_table, source_id).
  4. If content_hash changed OR no chunks exist: delete old chunks,
     chunk (500 words / 50 overlap), embed, insert new chunks.

Usage:
  python scripts/sync_voice_kb.py
  python scripts/sync_voice_kb.py --only services,faq
  python scripts/sync_voice_kb.py --force
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional, Tuple

# Ensure voice_agent/ is importable regardless of CWD.
_HERE = Path(__file__).resolve().parent
_VOICE_AGENT_DIR = _HERE.parent
sys.path.insert(0, str(_VOICE_AGENT_DIR))

import config  # noqa: E402
from rag.embedder import embed_texts  # noqa: E402
from supabase_client import get_client  # noqa: E402

logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL, logging.INFO),
    format="[%(asctime)s] %(levelname)-8s %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("digiimark.sync_kb")


# ─── Source document (pre-embedding) ─────────────────────────────────────────

@dataclass
class SourceDoc:
    """A document ready to be upserted into knowledge_base_documents."""
    title: str
    category: str
    content: str
    source_type: str  # 'manual' | 'synced'
    source_table: Optional[str] = None
    source_id: Optional[str] = None
    metadata: Dict[str, Any] = None

    def content_hash(self) -> str:
        return hashlib.sha256(self.content.encode("utf-8")).hexdigest()


# ─── Utilities ────────────────────────────────────────────────────────────────

def _chunk_text(text: str, chunk_size: int = None, overlap: int = None) -> List[str]:
    """Word-based overlapping chunker."""
    chunk_size = chunk_size or config.CHUNK_SIZE
    overlap = overlap or config.CHUNK_OVERLAP
    words = text.split()
    out: List[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        out.append(" ".join(words[start:end]))
        start += max(chunk_size - overlap, 1)
    return [c for c in out if c.strip()]


def _slugify(value: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (value or "").lower()).strip("-")
    return s or "untitled"


def _render_json_blocks(data: Any, *, depth: int = 0) -> str:
    """Flatten nested JSON service content into readable markdown bullets."""
    if data is None:
        return ""
    if isinstance(data, str):
        return data.strip()
    if isinstance(data, (int, float, bool)):
        return str(data)
    if isinstance(data, list):
        lines: List[str] = []
        for item in data:
            rendered = _render_json_blocks(item, depth=depth + 1).strip()
            if not rendered:
                continue
            if isinstance(item, dict):
                lines.append(rendered)
            else:
                lines.append(f"- {rendered}")
        return "\n".join(lines)
    if isinstance(data, dict):
        lines: List[str] = []
        title = data.get("title") or data.get("h3_title") or data.get("heading")
        description = data.get("description") or data.get("fullDescription")
        items = (
            data.get("items")
            or data.get("bullet_points")
            or data.get("points")
        )
        if title:
            prefix = "###" if depth <= 1 else "####"
            lines.append(f"{prefix} {title}")
        if description:
            rendered = _render_json_blocks(description, depth=depth + 1)
            lines.append(rendered)
        if items:
            rendered = _render_json_blocks(items, depth=depth + 1)
            lines.append(rendered)
        # Include other text-ish keys we might have missed.
        skip = {"title", "h3_title", "heading", "description", "fullDescription",
                "items", "bullet_points", "points"}
        for k, v in data.items():
            if k in skip or v in (None, "", [], {}):
                continue
            if isinstance(v, (dict, list)):
                continue
            lines.append(f"- **{k}**: {v}")
        return "\n".join(lines)
    return str(data)


def _service_url(category_slug: str, service_slug: str) -> str:
    return f"{config.SITE_BASE_URL}/services/{category_slug}/{service_slug}"


def _case_study_url(slug: str) -> str:
    return f"{config.SITE_BASE_URL}/case-studies/{slug}"


def _blog_url(slug: str) -> str:
    return f"{config.SITE_BASE_URL}/blog/{slug}"


# ─── Collectors ──────────────────────────────────────────────────────────────

def collect_manual_markdown() -> List[SourceDoc]:
    """Sync the manual markdown files in voice_agent/knowledge_base/."""
    kb_dir = config.KNOWLEDGE_BASE_DIR
    if not kb_dir.exists():
        return []

    docs: List[SourceDoc] = []
    for path in sorted(kb_dir.glob("*.md")):
        content = path.read_text(encoding="utf-8").strip()
        if not content:
            continue

        # Heuristic: filename → category.
        stem = path.stem.lower()
        if "pricing" in stem:
            category = "pricing"
        elif "overview" in stem or "company" in stem:
            category = "company"
        else:
            category = "manual"

        # First H1 → title; fallback to slugified filename.
        title_match = re.search(r"^#\s+(.+)$", content, flags=re.MULTILINE)
        title = title_match.group(1).strip() if title_match else path.stem.replace("_", " ").title()

        # Manual docs use the filename as a deterministic synthetic id so they
        # flow through the same (source_table, source_id) unique index.
        synthetic_id = str(_deterministic_uuid("manual:" + path.name))

        docs.append(SourceDoc(
            title=title,
            category=category,
            content=content,
            source_type="synced",            # so the unique index applies
            source_table="voice_agent_kb",   # namespace for manual docs
            source_id=synthetic_id,
            metadata={"file_name": path.name},
        ))
    return docs


def _deterministic_uuid(seed: str) -> str:
    """Generate a deterministic uuid-v5 from a seed string (for manual docs)."""
    import uuid
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f"digiimark.voice_agent:{seed}"))


def collect_service_categories() -> List[SourceDoc]:
    client = get_client()
    res = (
        client.table("service_categories")
        .select(
            "id, name, slug, hero_display_title, hero_description, hero_animated_words, "
            "expertise_title, expertise_subtitle, process_heading, process_description, "
            "process_steps, target_industries"
        )
        .order("display_order")
        .execute()
    )
    out: List[SourceDoc] = []
    for row in res.data or []:
        parts: List[str] = [f"# {row.get('name') or 'Service Category'}"]

        if row.get("hero_display_title"):
            parts.append(f"## {row['hero_display_title']}")
        if row.get("hero_description"):
            parts.append(row["hero_description"])

        words = row.get("hero_animated_words")
        if words:
            parts.append("**Specialisations:** " + ", ".join(words))

        if row.get("expertise_title"):
            parts.append(f"\n### {row['expertise_title']}")
        if row.get("expertise_subtitle"):
            parts.append(row["expertise_subtitle"])

        if row.get("process_heading"):
            parts.append(f"\n### {row['process_heading']}")
        if row.get("process_description"):
            parts.append(row["process_description"])

        steps = row.get("process_steps")
        if steps:
            rendered = _render_json_blocks(steps)
            if rendered:
                parts.append(rendered)

        industries = row.get("target_industries")
        if industries:
            rendered = _render_json_blocks(industries)
            if rendered:
                parts.append("\n### Target Industries\n" + rendered)

        parts.append(
            f"\n**URL:** {config.SITE_BASE_URL}/services/{row.get('slug', '')}"
        )

        out.append(SourceDoc(
            title=row.get("name") or "Service Category",
            category="service_category",
            content="\n\n".join(p for p in parts if p),
            source_type="synced",
            source_table="service_categories",
            source_id=row["id"],
            metadata={"slug": row.get("slug")},
        ))
    return out


def collect_services() -> List[SourceDoc]:
    client = get_client()

    # Build category slug lookup so service URLs resolve correctly.
    cat_res = (
        client.table("service_categories")
        .select("id, slug, name")
        .execute()
    )
    cat_lookup: Dict[str, Dict[str, str]] = {
        row["id"]: {"slug": row.get("slug", ""), "name": row.get("name", "")}
        for row in (cat_res.data or [])
    }

    res = (
        client.table("services")
        .select(
            "id, category_id, slug, name, hero_h1, hero_description, short_description, "
            "description, service_details, methodology, what_we_provide, seo_title, meta_description"
        )
        .order("display_order")
        .execute()
    )
    out: List[SourceDoc] = []
    for row in res.data or []:
        cat = cat_lookup.get(row.get("category_id"), {})
        cat_slug = cat.get("slug", "")
        cat_name = cat.get("name", "")

        parts: List[str] = [f"# {row.get('name') or row.get('hero_h1') or 'Service'}"]
        if cat_name:
            parts.append(f"*Category: {cat_name}*")

        if row.get("hero_h1") and row.get("hero_h1") != row.get("name"):
            parts.append(f"## {row['hero_h1']}")
        if row.get("hero_description"):
            parts.append(row["hero_description"])

        if row.get("short_description"):
            parts.append(f"**In short:** {row['short_description']}")

        if row.get("description") and row.get("description") != row.get("short_description"):
            parts.append(row["description"])

        for block_key, heading in (
            ("service_details", "What's included"),
            ("methodology", "Our methodology"),
            ("what_we_provide", "What we provide"),
        ):
            block = row.get(block_key)
            if not block:
                continue
            rendered = _render_json_blocks(block)
            if rendered:
                parts.append(f"\n### {heading}\n{rendered}")

        if cat_slug and row.get("slug"):
            parts.append(
                f"\n**URL:** {_service_url(cat_slug, row['slug'])}"
            )

        out.append(SourceDoc(
            title=row.get("name") or row.get("hero_h1") or "Service",
            category="service",
            content="\n\n".join(p for p in parts if p),
            source_type="synced",
            source_table="services",
            source_id=row["id"],
            metadata={
                "slug": row.get("slug"),
                "category_id": row.get("category_id"),
                "category_slug": cat_slug,
            },
        ))
    return out


def collect_faqs() -> List[SourceDoc]:
    client = get_client()
    try:
        res = (
            client.table("faq")
            .select("id, question, answer")
            .eq("is_active", True)
            .order("sort_order")
            .execute()
        )
    except Exception as exc:
        logger.warning("FAQ table missing or inaccessible: %s", exc)
        return []

    out: List[SourceDoc] = []
    for row in res.data or []:
        q = row.get("question", "").strip()
        a = row.get("answer", "").strip()
        if not q or not a:
            continue
        content = f"**Q:** {q}\n\n**A:** {a}"
        out.append(SourceDoc(
            title=f"FAQ: {q[:80]}",
            category="faq",
            content=content,
            source_type="synced",
            source_table="faq",
            source_id=row["id"],
            metadata={},
        ))
    return out


def collect_case_studies() -> List[SourceDoc]:
    client = get_client()
    try:
        res = (
            client.table("case_studies")
            .select(
                "id, slug, h1_title, brief_description, challenges, results, "
                "industries:industry_id ( id, name, slug ), linked_service_id"
            )
            .eq("published", True)
            .order("display_order")
            .limit(50)
            .execute()
        )
    except Exception:
        # Schema drift — fall back to the simpler shape.
        res = (
            client.table("case_studies")
            .select("*")
            .eq("published", True)
            .limit(50)
            .execute()
        )

    out: List[SourceDoc] = []
    for row in res.data or []:
        title = row.get("h1_title") or row.get("title") or "Case Study"
        slug = row.get("slug") or _slugify(title)
        industry = row.get("industries") or {}
        industry_name = (
            industry.get("name") if isinstance(industry, dict) else row.get("industry")
        )

        parts = [f"# {title}"]
        if industry_name:
            parts.append(f"*Industry: {industry_name}*")
        if row.get("brief_description"):
            parts.append(row["brief_description"])

        challenges = row.get("challenges")
        if challenges:
            rendered = _render_json_blocks(challenges)
            if rendered:
                parts.append(f"\n### Challenges\n{rendered}")

        results = row.get("results")
        if results:
            rendered = _render_json_blocks(results)
            if rendered:
                parts.append(f"\n### Results\n{rendered}")

        parts.append(f"\n**URL:** {_case_study_url(slug)}")

        out.append(SourceDoc(
            title=title,
            category="case_study",
            content="\n\n".join(p for p in parts if p),
            source_type="synced",
            source_table="case_studies",
            source_id=row["id"],
            metadata={
                "slug": slug,
                "industry": industry_name,
                "linked_service_id": row.get("linked_service_id"),
            },
        ))
    return out


def collect_blogs() -> List[SourceDoc]:
    client = get_client()
    try:
        res = (
            client.table("blogs")
            .select(
                "id, slug, seo_title, meta_description, body_content, published_at, "
                "blog_content_categories ( content_categories ( name, slug ) )"
            )
            .eq("published", True)
            .order("published_at", desc=True)
            .limit(20)
            .execute()
        )
    except Exception as exc:
        logger.info("blogs table: skipped (%s)", exc)
        return []

    out: List[SourceDoc] = []
    for row in res.data or []:
        title = row.get("seo_title") or "Blog post"
        slug = row.get("slug") or _slugify(title)

        # Flatten the nested content_categories join.
        cats: List[str] = []
        for bcc in row.get("blog_content_categories") or []:
            cc = (bcc or {}).get("content_categories") or {}
            if cc.get("name"):
                cats.append(cc["name"])

        parts = [f"# {title}"]
        if cats:
            parts.append(f"*Categories: {', '.join(cats)}*")
        if row.get("meta_description"):
            parts.append(row["meta_description"])
        body = row.get("body_content") or ""
        if body:
            # Keep first ~500 words so a single KB doc is reasonable.
            trimmed = " ".join(body.split()[:500])
            parts.append(trimmed)
        parts.append(f"\n**URL:** {_blog_url(slug)}")

        out.append(SourceDoc(
            title=title,
            category="blog",
            content="\n\n".join(p for p in parts if p),
            source_type="synced",
            source_table="blogs",
            source_id=row["id"],
            metadata={"slug": slug, "categories": cats},
        ))
    return out


# ─── Sync orchestration ──────────────────────────────────────────────────────

# Registry of (key, human name, collector function).
COLLECTORS: List[Tuple[str, str, Callable[[], List[SourceDoc]]]] = [
    ("manual", "Manual markdown docs", collect_manual_markdown),
    ("service_categories", "Service categories", collect_service_categories),
    ("services", "Services", collect_services),
    ("faq", "FAQs", collect_faqs),
    ("case_studies", "Case studies", collect_case_studies),
    ("blogs", "Blog posts (top 20)", collect_blogs),
]


def _upsert_document(client, doc: SourceDoc) -> Tuple[str, bool]:
    """
    Upsert a document row. Returns (document_id, content_changed).
    """
    content_hash = doc.content_hash()

    if doc.source_table and doc.source_id:
        # Use the unique (source_table, source_id) index.
        existing = (
            client.table("knowledge_base_documents")
            .select("id, content_hash")
            .eq("source_table", doc.source_table)
            .eq("source_id", doc.source_id)
            .limit(1)
            .execute()
        )
        rows = existing.data or []

        payload = {
            "title": doc.title,
            "category": doc.category,
            "content": doc.content,
            "source_type": doc.source_type,
            "source_table": doc.source_table,
            "source_id": doc.source_id,
            "metadata": doc.metadata or {},
            "is_active": True,
            "content_hash": content_hash,
        }

        if rows:
            row_id = rows[0]["id"]
            prev_hash = rows[0].get("content_hash")
            client.table("knowledge_base_documents").update(payload).eq(
                "id", row_id
            ).execute()
            return row_id, (prev_hash != content_hash)

        inserted = (
            client.table("knowledge_base_documents").insert(payload).execute()
        )
        return inserted.data[0]["id"], True

    # Truly manual row with no stable identity — insert every time (rare).
    payload = {
        "title": doc.title,
        "category": doc.category,
        "content": doc.content,
        "source_type": "manual",
        "metadata": doc.metadata or {},
        "is_active": True,
        "content_hash": content_hash,
    }
    inserted = client.table("knowledge_base_documents").insert(payload).execute()
    return inserted.data[0]["id"], True


def _has_chunks(client, document_id: str) -> bool:
    res = (
        client.table("knowledge_base_chunks")
        .select("id", count="exact")
        .eq("document_id", document_id)
        .limit(1)
        .execute()
    )
    return (res.count or 0) > 0


def _rebuild_chunks(client, document_id: str, content: str) -> int:
    """Replace all chunks for a document. Returns new chunk count."""
    chunks = _chunk_text(content)
    if not chunks:
        return 0

    try:
        vectors = embed_texts(chunks)
    except Exception as exc:
        logger.error("Embedding failed for document %s: %s", document_id, exc)
        return 0

    # Delete old chunks, then bulk insert the new ones.
    client.table("knowledge_base_chunks").delete().eq(
        "document_id", document_id
    ).execute()

    rows = [
        {
            "document_id": document_id,
            "chunk_index": i,
            "content": chunks[i],
            "embedding": vectors[i],
        }
        for i in range(len(chunks))
    ]
    client.table("knowledge_base_chunks").insert(rows).execute()
    return len(rows)


def run_sync(only: Optional[Iterable[str]] = None, force: bool = False) -> None:
    client = get_client()
    only_set = set(only) if only else None

    total_docs = 0
    total_reembedded = 0
    total_skipped = 0

    for key, label, collector in COLLECTORS:
        if only_set and key not in only_set:
            continue
        logger.info("Collecting: %s ...", label)
        try:
            docs = collector()
        except Exception as exc:
            logger.error("Collector %s failed: %s", key, exc, exc_info=True)
            continue
        logger.info("  → %d document(s)", len(docs))

        for doc in docs:
            total_docs += 1
            try:
                document_id, content_changed = _upsert_document(client, doc)
            except Exception as exc:
                logger.error("Upsert failed for '%s': %s", doc.title, exc)
                continue

            needs_embed = force or content_changed or not _has_chunks(client, document_id)
            if not needs_embed:
                total_skipped += 1
                continue

            n = _rebuild_chunks(client, document_id, doc.content)
            if n > 0:
                total_reembedded += 1
                logger.info("  Re-embedded '%s' → %d chunks", doc.title[:60], n)

    # Deactivate synced docs whose source row no longer exists? Out of scope v1;
    # rely on hard deletes propagating via soft flags if needed later.

    logger.info(
        "Sync complete: %d docs processed, %d re-embedded, %d unchanged.",
        total_docs, total_reembedded, total_skipped,
    )


# ─── CLI ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--only",
        help="Comma-separated list of collectors to run "
             f"({', '.join(k for k, *_ in COLLECTORS)})",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-embed all documents even if content_hash is unchanged.",
    )
    args = parser.parse_args()

    only = None
    if args.only:
        only = [s.strip() for s in args.only.split(",") if s.strip()]

    run_sync(only=only, force=args.force)


if __name__ == "__main__":
    main()
