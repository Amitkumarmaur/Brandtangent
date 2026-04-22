"""
rag/indexer.py — Watches knowledge_base/ and auto-indexes new/changed documents.

Workflow:
  1. On startup, index all existing documents.
  2. watchdog monitors knowledge_base/ for file events.
  3. On create/modify: parse → chunk → embed → upsert into FAISS.
  4. On delete: remove chunks from the index.

Supported formats: .md, .txt, .pdf, .docx
"""

from __future__ import annotations

import hashlib
import json
import logging
import os
import sys
import threading
import time
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import config
from rag.embedder import embed_texts

logger = logging.getLogger(__name__)

# ─── Lazy imports (heavy libs) ────────────────────────────────────────────────
def _import_faiss():
    try:
        import faiss
        return faiss
    except ImportError:
        raise ImportError("faiss-cpu is not installed. Run: pip install faiss-cpu")

def _import_watchdog():
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
        return Observer, FileSystemEventHandler
    except ImportError:
        raise ImportError("watchdog is not installed. Run: pip install watchdog")


# ─── Document parsers ─────────────────────────────────────────────────────────

def _parse_md_or_txt(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def _parse_pdf(path: Path) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(path))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as exc:
        logger.warning("PDF parse error for %s: %s", path.name, exc)
        return ""


def _parse_docx(path: Path) -> str:
    try:
        from docx import Document
        doc = Document(str(path))
        return "\n".join(para.text for para in doc.paragraphs)
    except Exception as exc:
        logger.warning("DOCX parse error for %s: %s", path.name, exc)
        return ""


PARSERS = {
    ".md": _parse_md_or_txt,
    ".txt": _parse_md_or_txt,
    ".pdf": _parse_pdf,
    ".docx": _parse_docx,
}


def parse_document(path: Path) -> str:
    """Parse a document and return its full text content."""
    ext = path.suffix.lower()
    parser = PARSERS.get(ext)
    if parser is None:
        logger.warning("Unsupported file type: %s", ext)
        return ""
    return parser(path)


# ─── Chunker ─────────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = config.CHUNK_SIZE,
               overlap: int = config.CHUNK_OVERLAP) -> List[str]:
    """
    Split text into overlapping word-based chunks.
    (Word-based keeps it dependency-free; accurate enough for RAG.)
    """
    words = text.split()
    chunks: List[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return [c for c in chunks if c.strip()]


# ─── Vector Store ─────────────────────────────────────────────────────────────

class VectorStore:
    """
    A simple FAISS-backed vector store with JSON metadata.

    Metadata schema (per chunk):
      {
        "doc_id": str,          # MD5 hash of file path
        "file_path": str,       # absolute path
        "file_name": str,       # basename
        "chunk_index": int,     # index within document
        "text": str,            # chunk text
        "file_hash": str        # MD5 of file content (for change detection)
      }
    """

    def __init__(self):
        self._faiss = _import_faiss()
        self._lock = threading.Lock()
        self._index: Optional[object] = None  # faiss.IndexFlatIP
        self._metadata: List[Dict] = []
        self._load()

    # ── Persistence ────────────────────────────────────────────────────────

    def _load(self):
        faiss = self._faiss
        if config.VECTOR_STORE_PATH.exists() and config.VECTOR_METADATA_PATH.exists():
            try:
                self._index = faiss.read_index(str(config.VECTOR_STORE_PATH))
                with open(config.VECTOR_METADATA_PATH, "r", encoding="utf-8") as f:
                    self._metadata = json.load(f)
                logger.info(
                    "Loaded vector store: %d chunks from %d documents.",
                    len(self._metadata),
                    len({m["doc_id"] for m in self._metadata}),
                )
            except Exception as exc:
                logger.warning("Could not load existing vector store: %s. Starting fresh.", exc)
                self._reset()
        else:
            self._reset()

    def _reset(self):
        faiss = self._faiss
        self._index = faiss.IndexFlatIP(config.EMBEDDING_DIMENSION)
        self._metadata = []

    def _save(self):
        faiss = self._faiss
        faiss.write_index(self._index, str(config.VECTOR_STORE_PATH))
        with open(config.VECTOR_METADATA_PATH, "w", encoding="utf-8") as f:
            json.dump(self._metadata, f, ensure_ascii=False, indent=2)

    # ── Upsert ─────────────────────────────────────────────────────────────

    def upsert_document(self, file_path: Path):
        """Parse, chunk, embed, and add a document. Replaces any existing version."""
        doc_id = hashlib.md5(str(file_path).encode()).hexdigest()
        file_hash = hashlib.md5(file_path.read_bytes()).hexdigest()

        # Check if already indexed with same content hash
        existing = [m for m in self._metadata if m["doc_id"] == doc_id]
        if existing and existing[0].get("file_hash") == file_hash:
            logger.debug("No changes detected in %s — skipping re-index.", file_path.name)
            return

        text = parse_document(file_path)
        if not text.strip():
            logger.warning("Empty document: %s", file_path.name)
            return

        chunks = chunk_text(text)
        logger.info("Indexing %s: %d chunks.", file_path.name, len(chunks))

        try:
            vectors = embed_texts(chunks)
        except Exception as exc:
            logger.error("Embedding failed for %s: %s", file_path.name, exc)
            return

        with self._lock:
            # Remove old entries for this doc
            self._remove_doc(doc_id)

            # Add new entries
            arr = np.array(vectors, dtype="float32")
            # Normalize for cosine similarity via inner product
            norms = np.linalg.norm(arr, axis=1, keepdims=True)
            norms[norms == 0] = 1
            arr = arr / norms

            self._index.add(arr)
            for i, (chunk, vec) in enumerate(zip(chunks, vectors)):
                self._metadata.append({
                    "doc_id": doc_id,
                    "file_path": str(file_path),
                    "file_name": file_path.name,
                    "chunk_index": i,
                    "text": chunk,
                    "file_hash": file_hash,
                })

            self._save()

        logger.info("✓ Indexed %s (%d chunks).", file_path.name, len(chunks))

    def _remove_doc(self, doc_id: str):
        """Remove all chunks for a document (call while holding lock)."""
        # FAISS IndexFlatIP doesn't support deletion natively.
        # We rebuild the index minus the removed doc.
        remaining = [m for m in self._metadata if m["doc_id"] != doc_id]
        if len(remaining) == len(self._metadata):
            return  # Nothing to remove

        faiss = self._faiss
        self._index = faiss.IndexFlatIP(config.EMBEDDING_DIMENSION)
        self._metadata = []

        if remaining:
            texts = [m["text"] for m in remaining]
            vectors = embed_texts(texts)
            arr = np.array(vectors, dtype="float32")
            norms = np.linalg.norm(arr, axis=1, keepdims=True)
            norms[norms == 0] = 1
            arr = arr / norms
            self._index.add(arr)
            self._metadata = remaining

    def remove_document(self, file_path: Path):
        """Remove a document from the index."""
        doc_id = hashlib.md5(str(file_path).encode()).hexdigest()
        with self._lock:
            self._remove_doc(doc_id)
            self._save()
        logger.info("Removed %s from index.", file_path.name)

    # ── Search ─────────────────────────────────────────────────────────────

    def search(self, query_vector: List[float], top_k: int = config.TOP_K_RETRIEVAL) -> List[Dict]:
        """Return top-k most relevant chunks for the query vector."""
        if self._index.ntotal == 0:
            return []

        arr = np.array([query_vector], dtype="float32")
        norm = np.linalg.norm(arr)
        if norm > 0:
            arr = arr / norm

        k = min(top_k, self._index.ntotal)
        scores, indices = self._index.search(arr, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            meta = self._metadata[idx].copy()
            meta["score"] = float(score)
            results.append(meta)

        return results

    @property
    def total_chunks(self) -> int:
        return self._index.ntotal if self._index else 0


# ─── File Watcher ─────────────────────────────────────────────────────────────

class KnowledgeBaseWatcher:
    """
    Watches the knowledge_base/ directory and auto-indexes new/changed files.
    """

    def __init__(self, vector_store: VectorStore):
        self._store = vector_store
        Observer, FileSystemEventHandler = _import_watchdog()

        class _Handler(FileSystemEventHandler):

            def __init__(self_, store: VectorStore):
                self_._store = store

            def _handle(self_, event):
                if event.is_directory:
                    return
                path = Path(event.src_path)
                if path.suffix.lower() not in config.SUPPORTED_EXTENSIONS:
                    return
                # Small delay to let the file finish writing
                time.sleep(0.5)
                logger.info("[Watcher] Detected: %s (%s)", path.name, event.event_type)
                if event.event_type == "deleted":
                    self_._store.remove_document(path)
                else:
                    self_._store.upsert_document(path)

            def on_created(self_, event):  self_._handle(event)
            def on_modified(self_, event): self_._handle(event)
            def on_deleted(self_, event):  self_._handle(event)

        self._observer = Observer()
        self._observer.schedule(
            _Handler(vector_store),
            str(config.KNOWLEDGE_BASE_DIR),
            recursive=True,
        )

    def start(self):
        self._observer.start()
        logger.info("📂 Watching knowledge_base/ for changes…")

    def stop(self):
        self._observer.stop()
        self._observer.join()


# ─── Bootstrap ────────────────────────────────────────────────────────────────

def build_vector_store() -> VectorStore:
    """
    Create (or load) the vector store and index all existing documents.
    Returns the ready-to-use VectorStore.
    """
    store = VectorStore()

    existing_files = [
        p for p in config.KNOWLEDGE_BASE_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in config.SUPPORTED_EXTENSIONS
    ]

    if existing_files:
        logger.info("Indexing %d existing knowledge base document(s)…", len(existing_files))
        for path in existing_files:
            store.upsert_document(path)
    else:
        logger.info("Knowledge base is empty. Drop files in knowledge_base/ to get started.")

    return store


def start_watcher(vector_store: VectorStore) -> KnowledgeBaseWatcher:
    """Start the file watcher in the background."""
    watcher = KnowledgeBaseWatcher(vector_store)
    watcher.start()
    return watcher
