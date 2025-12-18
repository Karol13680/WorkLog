# ---------- FRONTEND ----------
FROM node:20-alpine AS frontend-build
WORKDIR /frontend-temp

COPY app/package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

COPY app/ .
RUN npx vite build

# ---------- BACKEND ----------
FROM python:3.11-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY server/requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir -r requirements.txt

COPY server .
COPY --from=frontend-build /frontend-temp/dist ./static

EXPOSE 5000
CMD ["python", "run.py"]
