CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  run_at timestamptz NOT NULL DEFAULT now()
);