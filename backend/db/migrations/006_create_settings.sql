CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  transfer_cvu TEXT NOT NULL DEFAULT '',
  transfer_alias TEXT NOT NULL DEFAULT '',
  transfer_cuit TEXT NOT NULL DEFAULT '',
  transfer_holder_name TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT ''
);

INSERT INTO settings (id, transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp)
VALUES (1, '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;
