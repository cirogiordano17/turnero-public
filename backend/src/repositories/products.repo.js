async function getActiveCategories(db) {
  return db.query(
    `SELECT id, name, slug, sort_order
     FROM product_categories
     WHERE active = true
     ORDER BY sort_order ASC, name ASC`
  );
}

async function getAllCategories(db) {
  return db.query(
    `SELECT id, name, slug, sort_order, active
     FROM product_categories
     ORDER BY sort_order ASC, name ASC`
  );
}

async function createCategory(db, { name, slug, sort_order }) {
  return db.query(
    `INSERT INTO product_categories (name, slug, sort_order)
     VALUES ($1, $2, $3)
     RETURNING id, name, slug, sort_order, active`,
    [name, slug, sort_order ?? 0]
  );
}

async function updateCategory(db, id, { name, slug, sort_order, active }) {
  return db.query(
    `UPDATE product_categories
     SET name = $1, slug = $2, sort_order = $3, active = $4
     WHERE id = $5
     RETURNING id, name, slug, sort_order, active`,
    [name, slug, sort_order ?? 0, active, id]
  );
}

async function deleteCategory(db, id) {
  return db.query(
    `DELETE FROM product_categories WHERE id = $1 RETURNING id`,
    [id]
  );
}

async function getActiveProducts(db, categorySlug) {
  const base = `
    SELECT p.id, p.name, p.description, p.price, p.photo_url,
           pc.name AS category_name, pc.slug AS category_slug
    FROM products p
    JOIN product_categories pc ON pc.id = p.category_id
    WHERE p.active = true AND pc.active = true
  `;
  if (categorySlug) {
    return db.query(base + ` AND pc.slug = $1 ORDER BY p.name ASC`, [categorySlug]);
  }
  return db.query(base + ` ORDER BY pc.sort_order ASC, p.name ASC`);
}

async function getAllProducts(db) {
  return db.query(
    `SELECT p.id, p.name, p.description, p.price, p.photo_url, p.active,
            p.category_id, pc.name AS category_name, pc.slug AS category_slug
     FROM products p
     JOIN product_categories pc ON pc.id = p.category_id
     ORDER BY pc.sort_order ASC, p.name ASC`
  );
}

async function createProduct(db, { category_id, name, description, price, photo_url }) {
  return db.query(
    `INSERT INTO products (category_id, name, description, price, photo_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, category_id, name, description, price, photo_url, active`,
    [category_id, name, description || null, price, photo_url || null]
  );
}

async function updateProduct(db, id, { category_id, name, description, price, photo_url, active }) {
  return db.query(
    `UPDATE products
     SET category_id = $1, name = $2, description = $3, price = $4,
         photo_url = $5, active = $6
     WHERE id = $7
     RETURNING id, category_id, name, description, price, photo_url, active`,
    [category_id, name, description || null, price, photo_url || null, active, id]
  );
}

async function deleteProduct(db, id) {
  return db.query(`DELETE FROM products WHERE id = $1 RETURNING id`, [id]);
}

module.exports = {
  getActiveCategories, getAllCategories, createCategory, updateCategory, deleteCategory,
  getActiveProducts, getAllProducts, createProduct, updateProduct, deleteProduct,
};
