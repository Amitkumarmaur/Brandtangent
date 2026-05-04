"""
rag/indexer.py — Watch knowledge_base/, chunk, embed, upsert into FAISS.
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


def _import_faiss():
    try:
        import faiss

        return faiss
    except ImportError as exc:
        raise ImportError("faiss-cpu is required. pip install faiss-cpu") from exc


def _import_watchdog():
    try:
        from watchdog.events import FileSystemEventHandler
        from watchdog.observers import Observer

        return Observer, FileSystemEventHandler
    except ImportError as exc:
        raise ImportError("watchdog is required. pip install watchdog") from exc


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
    ext = path.suffix.lower()
    parser = PARSERS.get(ext)
    if parser is None:
        logger.warning("Unsupported file type: %s", ext)
        return ""
    return parser(path)


def chunk_text(
    text: str,
    chunk_size: int = config.CHUNK_SIZE,
    overlap: int = config.CHUNK_OVERLAP,
) -> List[str]:
    words = text.split()
    chunks: List[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
    return [c for c in chunks if c.strip()]


class VectorStore:
    def __init__(self) -> None:
        self._faiss = _import_faiss()
        self._lock = threading.Lock()
        self._index: Optional[object] = None
        self._metadata: List[Dict] = []
        self._load()

    def _load(self) -> None:
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
                logger.warning("Could not load vector store: %s. Starting fresh.", exc)
                self._reset()
        else:
            self._reset()

    def _reset(self) -> None:
        faiss = self._faiss
        self._index = faiss.IndexFlatIP(config.EMBEDDING_DIMENSION)
        self._metadata = []

    def _save(self) -> None:
        faiss = self._faiss
        faiss.write_index(self._index, str(config.VECTOR_STORE_PATH))
        with open(config.VECTOR_METADATA_PATH, "w", encoding="utf-8") as f:
            json.dump(self._metadata, f, ensure_ascii=False, indent=2)

    def upsert_document(self, file_path: Path) -> None:
        doc_id = hashlib.md5(str(file_path).encode()).hexdigest()
        file_hash = hashlib.md5(file_path.read_bytes()).hexdigest()

        existing = [m for m in self._metadata if m["doc_id"] == doc_id]
        if existing and existing[0].get("file_hash") == file_hash:
            logger.debug("No changes in %s — skip.", file_path.name)
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
            self._remove_doc(doc_id)
            arr = np.array(vectors, dtype="float32")
            norms = np.linalg.norm(arr, axis=1, keepdims=True)
            norms[norms == 0] = 1
            arr = arr / norms
            self._index.add(arr)
            for i, chunk in enumerate(chunks):
                self._metadata.append(
                    {
                        "doc_id": doc_id,
                        "file_path": str(file_path),
                        "file_name": file_path.name,
                        "chunk_index": i,
                        "text": chunk,
                        "file_hash": file_hash,
                    }
                )
            self._save()

        logger.info("Indexed %s (%d chunks).", file_path.name, len(chunks))

    def _remove_doc(self, doc_id: str) -> None:
        remaining = [m for m in self._metadata if m["doc_id"] != doc_id]
        if len(remaining) == len(self._metadata):
            return

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

    def remove_document(self, file_path: Path) -> None:
        doc_id = hashlib.md5(str(file_path).encode()).hexdigest()
        with self._lock:
            self._remove_doc(doc_id)
            self._save()
        logger.info("Removed %s from index.", file_path.name)

    def search(self, query_vector: List[float], top_k: int = config.TOP_K_RETRIEVAL) -> List[Dict]:
        if self._index.ntotal == 0:
            return []

        arr = np.array([query_vector], dtype="float32")
        norm = np.linalg.norm(arr)
        if norm > 0:
            arr = arr / norm

        k = min(top_k, self._index.ntotal)
        scores, indices = self._index.search(arr, k)

        results: List[Dict] = []
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


class KnowledgeBaseWatcher:
    def __init__(self, vector_store: VectorStore) -> None:
        self._store = vector_store
        Observer, FileSystemEventHandler = _import_watchdog()

        class _Handler(FileSystemEventHandler):
            def __init__(self_, store: VectorStore) -> None:
                self_._store = store

            def _handle(self_, event) -> None:
                if event.is_directory:
                    return
                path = Path(event.src_path)
                if path.suffix.lower() not in config.SUPPORTED_EXTENSIONS:
                    return
                time.sleep(0.5)
                logger.info("[Watcher] %s (%s)", path.name, event.event_type)
                if event.event_type == "deleted":
                    self_._store.remove_document(path)
                else:
                    self_._store.upsert_document(path)

            def on_created(self_, event) -> None:
                self_._handle(event)

            def on_modified(self_, event) -> None:
                self_._handle(event)

            def on_deleted(self_, event) -> None:
                self_._handle(event)

        self._observer = Observer()
        self._observer.schedule(
            _Handler(vector_store),
            str(config.KNOWLEDGE_BASE_DIR),
            recursive=True,
        )

    def start(self) -> None:
        self._observer.start()
        logger.info("Watching knowledge_base/ …")

    def stop(self) -> None:
        self._observer.stop()
        self._observer.join()


def build_vector_store() -> VectorStore:
    store = VectorStore()
    existing = [
        p
        for p in config.KNOWLEDGE_BASE_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in config.SUPPORTED_EXTENSIONS
    ]
    if existing:
        logger.info("Indexing %d knowledge base file(s)…", len(existing))
        for path in existing:
            store.upsert_document(path)
    else:
        logger.info("knowledge_base/ is empty.")
    return store


def start_watcher(vector_store: VectorStore) -> KnowledgeBaseWatcher:
    watcher = KnowledgeBaseWatcher(vector_store)
    watcher.start()
    return watcher
