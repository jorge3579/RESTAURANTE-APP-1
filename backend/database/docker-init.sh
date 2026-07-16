#!/bin/sh
set -eu

psql \
  --set ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --file /database/031_ejecutar_todo_postgres.sql
