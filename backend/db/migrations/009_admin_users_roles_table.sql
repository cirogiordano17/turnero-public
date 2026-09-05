-- Normaliza el rol de admin_users en su propia tabla (id, nombre, descripcion) via FK
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT ''
);

INSERT INTO roles (name, description) VALUES
  ('super_admin', 'Acceso total al panel: turnos, servicios, clientes, productos y configuración'),
  ('operador', 'Gestiona turnos de peluquería y registros akáshicos; sin acceso a productos ni configuración de transferencia')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id);

UPDATE admin_users SET role_id = (SELECT id FROM roles WHERE roles.name = admin_users.role)
WHERE role_id IS NULL;

ALTER TABLE admin_users ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE admin_users DROP COLUMN role;
