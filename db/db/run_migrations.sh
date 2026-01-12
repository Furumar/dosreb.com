#!/usr/bin/env bash
set -euo pipefail

# run_migrations.sh
# Simple helper to apply SQL migrations in db/migrations/*.sql
# Tries `psql` if PG* env vars are present, otherwise falls back to `supabase db query`.

MIGRATIONS_DIR="$(dirname "$0")/migrations"

if command -v psql >/dev/null 2>&1 && [ -n "${PGHOST:-}" ] ; then
  echo "Running migrations via psql against $PGHOST:$PGPORT/$PGDATABASE"
  for f in "$MIGRATIONS_DIR"/*.sql; do
    echo "--- applying $f"
    psql "$PGDATABASE" -f "$f"
  done
  exit 0
fi

if command -v supabase >/dev/null 2>&1 ; then
  echo "Running migrations via supabase CLI (supabase db query)"
  for f in "$MIGRATIONS_DIR"/*.sql; do
    echo "--- applying $f"
    supabase db query < "$f"
  done
  exit 0
fi

echo "No supported runner found. Either set PGHOST/PGDATABASE and install psql, or install the Supabase CLI."
exit 2
