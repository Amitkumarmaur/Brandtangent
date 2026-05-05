"""
tools/content_lookup_tool.py — Live Supabase lookups exposed to Gemini.

Three tools:
  * find_service        — semantic search over services (uses match_kb_chunks)
  * find_case_study     — filter published case studies by industry / service
  * find_faq            — semantic search restricted to the FAQ category

Each tool returns a compact dict with a `url` field so Maya can say
"I'll send you a link". The front-end widget can render these as clickable
cards if desired.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Any, Dict, List, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from rag.embedder import embed_query
from supabase_client import get_client
from tools.base import BaseTool

logger = logging.getLogger(__name__)


def _service_url(category_slug: str, service_slug: str) -> str:
    return f"{config.SITE_BASE_URL}/services/{category_slug}/{service_slug}"


def _case_study_url(slug: str) -> str:
    return f"{config.SITE_BASE_URL}/case-studies/{slug}"


# ──────────────────────────────────────────────────────────────────────────────
# find_service
# ──────────────────────────────────────────────────────────────────────────────

class FindServiceTool(BaseTool):
    """Semantic search over DigiiMark services."""

    name = "find_service"
    description = (
        "Find DigiiMark services that match a natural-language query. Use "
        "BEFORE describing a service so you're quoting real site content. "
        "Returns up to 3 services with name, short description, category, "
        "and a shareable URL. Example queries: 'SEO for B2B SaaS', "
        "'marketing automation', 'WordPress development'."
    )
    parameters = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The caller's request in natural language.",
            },
            "category_slug": {
                "type": "string",
                "description": (
                    "Optional service-category slug to restrict results "
                    "(e.g. 'ai-marketing-automation')."
                ),
            },
        },
        "required": ["query"],
    }

    def execute(
        self,
        query: str,
        category_slug: Optional[str] = None,
        **_ignored: Any,
    ) -> Dict[str, Any]:
        query = (query or "").strip()
        if not query:
            return {"result": "error", "message": "Empty query.", "services": []}

        try:
            vec = embed_query(query)
        except Exception as exc:
            logger.error("find_service embedding failed: %s", exc)
            return {
                "result": "error",
                "message": "I couldn't search right now.",
                "services": [],
            }

        client = get_client()

        try:
            res = client.rpc(
                "match_kb_chunks",
                {
                    "query_embedding": vec,
                    "match_count": 6,
                    "filter_category": "service",
                },
            ).execute()
        except Exception as exc:
            logger.error("find_service RPC failed: %s", exc)
            return {
                "result": "error",
                "message": "I couldn't search right now.",
                "services": [],
            }

        rows = res.data or []

        # Deduplicate by document_id (multiple chunks of the same service).
        seen: set[str] = set()
        candidate_doc_ids: List[str] = []
        for r in rows:
            doc_id = r.get("document_id")
            if doc_id and doc_id not in seen:
                seen.add(doc_id)
                candidate_doc_ids.append(doc_id)

        if not candidate_doc_ids:
            return {
                "result": "no_matches",
                "message": "No matching services found.",
                "services": [],
            }

        # Pull the source service rows for URL + short description.
        doc_res = (
            client.table("knowledge_base_documents")
            .select("id, source_id, title, metadata")
            .in_("id", candidate_doc_ids)
            .execute()
        )
        source_ids = [
            d.get("source_id") for d in (doc_res.data or []) if d.get("source_id")
        ]
        if not source_ids:
            return {
                "result": "no_matches",
                "message": "No matching services found.",
                "services": [],
            }

        svc_res = (
            client.table("services")
            .select(
                "id, name, slug, short_description, hero_description, category_id"
            )
            .in_("id", source_ids)
            .execute()
        )

        # Look up category slugs for URL building.
        cat_ids = sorted({
            s["category_id"] for s in (svc_res.data or []) if s.get("category_id")
        })
        cat_map: Dict[str, Dict[str, str]] = {}
        if cat_ids:
            cat_res = (
                client.table("service_categories")
                .select("id, name, slug")
                .in_("id", cat_ids)
                .execute()
            )
            cat_map = {
                c["id"]: {"slug": c.get("slug", ""), "name": c.get("name", "")}
                for c in (cat_res.data or [])
            }

        # Keep Supabase rows in the order the RPC returned them.
        ordered_ids = [
            d.get("source_id")
            for d in sorted(
                doc_res.data or [],
                key=lambda d: candidate_doc_ids.index(d["id"]),
            )
        ]
        services_by_id = {s["id"]: s for s in (svc_res.data or [])}

        results: List[Dict[str, Any]] = []
        for sid in ordered_ids:
            if not sid or sid not in services_by_id:
                continue
            s = services_by_id[sid]
            cat = cat_map.get(s.get("category_id", ""), {})
            cat_slug = cat.get("slug", "")

            if category_slug and cat_slug != category_slug:
                continue

            results.append({
                "name": s.get("name"),
                "slug": s.get("slug"),
                "category": cat.get("name"),
                "category_slug": cat_slug,
                "short_description": (
                    s.get("short_description") or s.get("hero_description") or ""
                ),
                "url": _service_url(cat_slug, s.get("slug") or "")
                       if cat_slug and s.get("slug") else None,
            })
            if len(results) >= 3:
                break

        return {
            "result": "success" if results else "no_matches",
            "message": (
                f"Found {len(results)} service(s) matching '{query}'."
                if results
                else "No matching services found."
            ),
            "services": results,
        }


# ──────────────────────────────────────────────────────────────────────────────
# find_case_study
# ──────────────────────────────────────────────────────────────────────────────

class FindCaseStudyTool(BaseTool):
    """Find relevant published case studies."""

    name = "find_case_study"
    description = (
        "Find up to 3 published DigiiMark case studies, filtered by industry "
        "or service slug. Use when the caller wants proof or examples — e.g. "
        "'any fintech case studies?' or 'show me something in manufacturing'. "
        "Returns titles, brief descriptions, and URLs."
    )
    parameters = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Natural-language description of what to match.",
            },
            "industry_slug": {
                "type": "string",
                "description": (
                    "Industry slug, e.g. 'fintech', 'saas', 'healthcare'."
                ),
            },
            "service_slug": {
                "type": "string",
                "description": "Service slug to narrow by (optional).",
            },
        },
        "required": [],
    }

    def execute(
        self,
        query: Optional[str] = None,
        industry_slug: Optional[str] = None,
        service_slug: Optional[str] = None,
        **_ignored: Any,
    ) -> Dict[str, Any]:
        client = get_client()

        industry_id: Optional[str] = None
        if industry_slug:
            try:
                ind_res = (
                    client.table("industries")
                    .select("id, name, slug")
                    .eq("slug", industry_slug)
                    .limit(1)
                    .execute()
                )
                if ind_res.data:
                    industry_id = ind_res.data[0]["id"]
            except Exception as exc:
                logger.debug("industries lookup failed: %s", exc)

        service_id: Optional[str] = None
        if service_slug:
            try:
                svc_res = (
                    client.table("services")
                    .select("id, name, slug")
                    .eq("slug", service_slug)
                    .limit(1)
                    .execute()
                )
                if svc_res.data:
                    service_id = svc_res.data[0]["id"]
            except Exception as exc:
                logger.debug("services lookup failed: %s", exc)

        # Base query — published case studies, newest first.
        q = (
            client.table("case_studies")
            .select(
                "id, slug, h1_title, brief_description, industry_id, linked_service_id, display_order"
            )
            .eq("published", True)
        )
        if industry_id:
            q = q.eq("industry_id", industry_id)
        if service_id:
            q = q.eq("linked_service_id", service_id)

        try:
            res = q.order("display_order").limit(10).execute()
        except Exception as exc:
            logger.error("find_case_study failed: %s", exc)
            return {
                "result": "error",
                "message": "I couldn't search case studies just now.",
                "case_studies": [],
            }

        rows = res.data or []

        # Optional semantic re-rank when a freeform query is provided.
        if query and rows and len(rows) > 3:
            try:
                vec = embed_query(query)
                rpc = client.rpc(
                    "match_kb_chunks",
                    {
                        "query_embedding": vec,
                        "match_count": 8,
                        "filter_category": "case_study",
                    },
                ).execute()
                # Map RPC ranking onto our filtered rows when possible.
                rank: Dict[str, int] = {}
                for i, r in enumerate(rpc.data or []):
                    doc_res = (
                        client.table("knowledge_base_documents")
                        .select("source_id")
                        .eq("id", r.get("document_id"))
                        .limit(1)
                        .execute()
                    )
                    if doc_res.data and doc_res.data[0].get("source_id"):
                        rank[doc_res.data[0]["source_id"]] = i
                rows.sort(key=lambda cs: rank.get(cs["id"], 999))
            except Exception as exc:
                logger.debug("Semantic rerank skipped: %s", exc)

        results: List[Dict[str, Any]] = []
        for cs in rows[:3]:
            slug = cs.get("slug") or ""
            results.append({
                "title": cs.get("h1_title"),
                "slug": slug,
                "brief_description": cs.get("brief_description", ""),
                "url": _case_study_url(slug) if slug else None,
            })

        return {
            "result": "success" if results else "no_matches",
            "message": (
                f"Found {len(results)} case study / studies."
                if results
                else "No matching case studies found."
            ),
            "case_studies": results,
        }


# ──────────────────────────────────────────────────────────────────────────────
# find_faq
# ──────────────────────────────────────────────────────────────────────────────

class FindFaqTool(BaseTool):
    """Semantic search over the FAQ table."""

    name = "find_faq"
    description = (
        "Semantic search over DigiiMark's public FAQ. Use when the caller "
        "asks a process, policy, or practical question and you want to "
        "quote an official answer instead of guessing. Returns up to 2 "
        "question/answer pairs."
    )
    parameters = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The caller's question in natural language.",
            },
        },
        "required": ["query"],
    }

    def execute(self, query: str, **_ignored: Any) -> Dict[str, Any]:
        query = (query or "").strip()
        if not query:
            return {"result": "error", "message": "Empty query.", "faqs": []}

        try:
            vec = embed_query(query)
        except Exception as exc:
            logger.error("find_faq embedding failed: %s", exc)
            return {"result": "error", "message": "Search failed.", "faqs": []}

        client = get_client()

        try:
            res = client.rpc(
                "match_kb_chunks",
                {
                    "query_embedding": vec,
                    "match_count": 4,
                    "filter_category": "faq",
                },
            ).execute()
        except Exception as exc:
            logger.error("find_faq RPC failed: %s", exc)
            return {"result": "error", "message": "Search failed.", "faqs": []}

        rows = res.data or []
        if not rows:
            return {
                "result": "no_matches",
                "message": "No matching FAQ found.",
                "faqs": [],
            }

        # Resolve back to the original FAQ rows via kb docs.
        doc_ids = list({r.get("document_id") for r in rows if r.get("document_id")})
        doc_res = (
            client.table("knowledge_base_documents")
            .select("id, source_id")
            .in_("id", doc_ids)
            .execute()
        )
        faq_ids = [d.get("source_id") for d in (doc_res.data or []) if d.get("source_id")]
        if not faq_ids:
            return {"result": "no_matches", "message": "No matching FAQ found.", "faqs": []}

        faq_res = (
            client.table("faq")
            .select("id, question, answer")
            .in_("id", faq_ids)
            .execute()
        )

        by_id = {f["id"]: f for f in (faq_res.data or [])}
        # Preserve RPC ranking.
        ordered_ids = [
            d.get("source_id")
            for d in sorted(
                doc_res.data or [],
                key=lambda d: doc_ids.index(d["id"]),
            )
            if d.get("source_id")
        ]

        results = []
        for fid in ordered_ids:
            f = by_id.get(fid)
            if not f:
                continue
            results.append({
                "question": f.get("question"),
                "answer": f.get("answer"),
            })
            if len(results) >= 2:
                break

        return {
            "result": "success" if results else "no_matches",
            "message": (
                f"Found {len(results)} matching FAQ(s)."
                if results
                else "No matching FAQ found."
            ),
            "faqs": results,
        }
