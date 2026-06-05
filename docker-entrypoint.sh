#!/bin/sh
set -e

mkdir -p /app/data /app/.next 2>/dev/null || true
chown -R axius:nodejs /app/data /app/.next 2>/dev/null || true

if [ -S /var/run/docker.sock ]; then
  DOCKER_GID=$(stat -c %g /var/run/docker.sock 2>/dev/null || echo "")
  if [ -n "$DOCKER_GID" ]; then
    EXISTING_GROUP=$(getent group "$DOCKER_GID" | cut -d: -f1 2>/dev/null || echo "")
    if [ -n "$EXISTING_GROUP" ]; then
      adduser axius "$EXISTING_GROUP" 2>/dev/null || true
    else
      addgroup -g "$DOCKER_GID" docker-host 2>/dev/null || true
      adduser axius docker-host 2>/dev/null || true
    fi
  fi
fi

exec su-exec axius "$@"
