# DigiiMark Voice Agent — production Dockerfile (Railway / any container host).
#
# Builds a slim Python image that runs `server.py` (FastAPI + WebSockets).
# PyAudio is intentionally NOT installed here — the web/server mode never
# touches the local mic/speaker. Install it separately for terminal mode.
#
# IMPORTANT — build context is the REPO ROOT (not voice_agent/) so that the
# shared persona module at agents_shared/ can be copied into the image.
# Build locally with:
#     docker build -f voice_agent/Dockerfile -t digiimark-voice .
# On Railway, set the service's "Root Directory" to the repo root and
# "Dockerfile Path" to voice_agent/Dockerfile.

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Minimal system deps (curl for healthchecks, ca-certificates for HTTPS).
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps first (layer cache friendly).
COPY voice_agent/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# Copy the shared persona module + the agent's own source.
COPY agents_shared/ /app/agents_shared/
COPY voice_agent/    /app/voice_agent/

# Run from the agent directory so its relative imports keep working;
# expose /app on PYTHONPATH so `from agents_shared import ...` resolves.
WORKDIR /app/voice_agent
ENV PYTHONPATH=/app

# Railway injects PORT; we also expose 8001 as a sensible default for local Docker.
ENV PORT=8001
EXPOSE 8001

# Basic healthcheck.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT}/api/health" || exit 1

CMD ["python", "server.py"]
