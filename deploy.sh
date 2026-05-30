#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="droplet"
REMOTE_PATH="/var/www/lotesrb"
PORT=443
DOMAIN="lotesrb.kolisevm.online"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$SCRIPT_DIR/dist/lotes-rb/browser"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Verificar rama
CURRENT_BRANCH=$(git -C "$SCRIPT_DIR" rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "master" ]; then
  echo "ERROR: Debes estar en 'master' para deployar (actual: $CURRENT_BRANCH)"
  exit 1
fi

# Verificar sin cambios pendientes
if ! git -C "$SCRIPT_DIR" diff --quiet || ! git -C "$SCRIPT_DIR" diff --cached --quiet; then
  echo "ERROR: Hay cambios sin commitear. Haz commit o stash antes de deployar."
  exit 1
fi

log "=== Deploy lotes-rb (frontend) iniciado ==="

# 1. Push a GitHub
log "[1/4] Push a origin/master..."
git -C "$SCRIPT_DIR" push origin master
log "      push OK"

# 2. Build de producción
log "[2/4] ng build --configuration production..."
cd "$SCRIPT_DIR"
npx ng build --configuration production
log "      build OK — output: $DIST_DIR"

# 3. rsync al droplet
log "[3/4] rsync al droplet..."
rsync -az --delete "$DIST_DIR/" "$REMOTE_HOST:$REMOTE_PATH/"
log "      rsync OK"

# 4. nginx reload
log "[4/4] nginx reload..."
ssh "$REMOTE_HOST" "nginx -t && systemctl reload nginx"
log "      nginx OK"

# Verificación HTTP
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 5 "https://$DOMAIN" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" != "000" ] && [ "$HTTP_CODE" -lt 500 ]; then
  COMMIT=$(git -C "$SCRIPT_DIR" rev-parse --short HEAD)
  log "      HTTP $HTTP_CODE en $DOMAIN — OK"
  log "=== Deploy completado ($COMMIT) ==="
else
  echo "AVISO: Deploy completado pero $DOMAIN respondió HTTP $HTTP_CODE — verificar manualmente."
fi
