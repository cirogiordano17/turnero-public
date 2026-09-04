-- Roles en admin_users
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'operador';

-- Categorías de productos
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  photo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings: whatsapp de productos y costo de envío
ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp_productos TEXT NOT NULL DEFAULT '';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS shipping_cost INTEGER NOT NULL DEFAULT 0;
