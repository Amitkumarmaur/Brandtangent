# DigiiMark Live Chat Agent — production Dockerfile (Railway / any container host).
#
# Builds a slim Python image that runs `main.py` (FastAPI + Uvicorn) on port
# 8010. The chat agent uses local FAISS + markdown KB + on-disk transcripts,
# so attach a Railway volume at /app/chatagent if you want either to survive
# restarts.
#
# IMPORTANT — build context is the REPO ROOT (not chatagent/) so that the
# shared persona module at agents_shared/ can be copied into the image.
# Build locally with:
#     docker build -f chatagent/Dockerfile -t digiimark-chat .
# On Railway, set the service's "Root Directory" to the repo root and
# "Dockerfile Path" to chatagent/Dockerfile.

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY chatagent/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY agents_shared/ /app/agents_shared/
COPY chatagent/     /app/chatagent/

WORKDIR /app/chatagent
ENV PYTHONPATH=/app

ENV PORT=8010
ENV CHAT_WEB_PORT=8010
EXPOSE 8010

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/health" || exit 1

CMD ["python", "main.py"]
