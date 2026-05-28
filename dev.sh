#!/bin/bash

# ─────────────────────────────────────────
#  Levanta el entorno local de desarrollo
#  Backend: Docker Compose (db + api)
#  Frontend: Vite dev server
# ─────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── 1. Backend ────────────────────────────
echo ""
echo "► Levantando backend (docker compose)..."
docker compose -f "$ROOT_DIR/compose.yaml" up -d --build

if [ $? -ne 0 ]; then
  echo ""
  echo "✗ Error al levantar Docker. ¿Está Docker Desktop corriendo?"
  exit 1
fi

echo "✓ Backend corriendo en http://localhost:3000"
echo "  (health: http://localhost:3000/health)"

# ── 2. Frontend ───────────────────────────
echo ""
echo "► Levantando frontend (npm run dev)..."
cd "$ROOT_DIR/client" && npm run dev
