const productsRepo = require("../repositories/products.repo");
const { toIntId } = require("../utils/validate");

// ── Público ──────────────────────────────────────────────

async function getCategories(req, res) {
  try {
    const result = await productsRepo.getActiveCategories(req.app.locals.db);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProducts(req, res) {
  try {
    const result = await productsRepo.getActiveProducts(req.app.locals.db, req.query.category || null);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── Admin: categorías ─────────────────────────────────────

async function adminGetCategories(req, res) {
  try {
    const result = await productsRepo.getAllCategories(req.app.locals.db);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function adminCreateCategory(req, res) {
  const { name, slug, sort_order } = req.body;
  if (!name?.trim() || !slug?.trim()) return res.status(400).json({ error: "name y slug son requeridos" });
  try {
    const result = await productsRepo.createCategory(req.app.locals.db, {
      name: name.trim(), slug: slug.trim().toLowerCase(), sort_order: sort_order ?? 0,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "El slug ya existe" });
    res.status(500).json({ error: err.message });
  }
}

async function adminUpdateCategory(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  const { name, slug, sort_order, active } = req.body;
  try {
    const result = await productsRepo.updateCategory(req.app.locals.db, id, {
      name: name?.trim(), slug: slug?.trim().toLowerCase(), sort_order: sort_order ?? 0, active: active ?? true,
    });
    if (!result.rows.length) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "El slug ya existe" });
    res.status(500).json({ error: err.message });
  }
}

async function adminDeleteCategory(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  try {
    const result = await productsRepo.deleteCategory(req.app.locals.db, id);
    if (!result.rows.length) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "23503") return res.status(409).json({ error: "La categoría tiene productos asociados" });
    res.status(500).json({ error: err.message });
  }
}

// ── Admin: productos ──────────────────────────────────────

async function adminGetProducts(req, res) {
  try {
    const result = await productsRepo.getAllProducts(req.app.locals.db);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function adminCreateProduct(req, res) {
  const { category_id, name, description, price, photo_url } = req.body;
  if (!name?.trim() || !category_id || price == null) {
    return res.status(400).json({ error: "category_id, name y price son requeridos" });
  }
  try {
    const result = await productsRepo.createProduct(req.app.locals.db, {
      category_id: Number(category_id), name: name.trim(), description, price: Number(price), photo_url,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function adminUpdateProduct(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  const { category_id, name, description, price, photo_url, active } = req.body;
  try {
    const result = await productsRepo.updateProduct(req.app.locals.db, id, {
      category_id: Number(category_id), name: name?.trim(), description,
      price: Number(price), photo_url, active: active ?? true,
    });
    if (!result.rows.length) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function adminDeleteProduct(req, res) {
  const id = toIntId(req.params.id);
  if (!id) return res.status(400).json({ error: "id inválido" });
  try {
    const result = await productsRepo.deleteProduct(req.app.locals.db, id);
    if (!result.rows.length) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCategories, getProducts,
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
};
