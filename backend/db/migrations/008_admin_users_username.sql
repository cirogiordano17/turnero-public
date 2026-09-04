-- admin_users pasa a usarse: renombra email -> username (no son emails) y siembra los usuarios actuales
ALTER TABLE admin_users RENAME COLUMN email TO username;
ALTER TABLE admin_users RENAME CONSTRAINT admin_users_email_key TO admin_users_username_key;

INSERT INTO admin_users (username, password_hash, role) VALUES
  ('admin', '$2b$10$RMsV0xsjpXmtwGT3FbBcGudS9VmFWKjVDU9KBqAT7KTPLUQ5FVqFa', 'super_admin'),
  ('operador', '$2b$10$SU74Js0bmopwfMTtA81neONEQQkPqLCzzwXmwo5SImSL/XcMh8vSO', 'operador')
ON CONFLICT (username) DO NOTHING;
