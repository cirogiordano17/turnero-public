import { useEffect, useRef, useState } from "react";
import { Package, FolderOpen, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import "../styles/admin-modal.css";

const API_BASE = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

function getAuthHeaders() {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}/admin${path}`, {
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...opts.headers },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error del servidor");
  return data;
}

// ── Cloudinary upload ──────────────────────────────────────────

async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary no configurado. Agregá VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET al .env");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error subiendo imagen");
  return data.secure_url;
}

// ── CategoryForm ───────────────────────────────────────────────

function CategoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", slug: "", sort_order: 0, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-modal__form">
      <div className="admin-modal__field">
        <label className="admin-modal__label">Nombre</label>
        <input
          className="admin-modal__input"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: initial ? p.slug : slugify(e.target.value) }))}
          required
          placeholder="Ej: Cuidado del Cabello"
        />
      </div>
      <div className="admin-modal__field">
        <label className="admin-modal__label">Slug (URL)</label>
        <input
          className="admin-modal__input"
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
          required
          placeholder="cuidado-cabello"
        />
      </div>
      <div className="admin-modal__field">
        <label className="admin-modal__label">Orden</label>
        <input
          type="number"
          className="admin-modal__input"
          value={form.sort_order}
          onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
        />
      </div>
      {error && <p className="admin-modal__error">{error}</p>}
      <div className="admin-modal__actions">
        <button type="button" className="admin-modal__btn admin-modal__btn--ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

// ── ProductForm ────────────────────────────────────────────────

function ProductForm({ initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    category_id: categories[0]?.id || "",
    name: "",
    description: "",
    price: "",
    photo_url: "",
    ...initial,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadToCloudinary(file);
      setForm((p) => ({ ...p, photo_url: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-modal__form">
      <div className="admin-modal__field">
        <label className="admin-modal__label">Categoría</label>
        <select
          className="admin-modal__input"
          value={form.category_id}
          onChange={(e) => setForm((p) => ({ ...p, category_id: Number(e.target.value) }))}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="admin-modal__field">
        <label className="admin-modal__label">Nombre</label>
        <input
          className="admin-modal__input"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
          placeholder="Nombre del producto"
        />
      </div>
      <div className="admin-modal__field">
        <label className="admin-modal__label">Descripción</label>
        <textarea
          className="admin-modal__input"
          rows={3}
          value={form.description || ""}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Descripción opcional"
        />
      </div>
      <div className="admin-modal__field">
        <label className="admin-modal__label">Precio ($)</label>
        <input
          type="number"
          className="admin-modal__input"
          value={form.price}
          onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
          required
          min={0}
          step={1}
          placeholder="0"
        />
      </div>

      <div className="admin-modal__field">
        <label className="admin-modal__label">Foto del producto</label>
        {form.photo_url && (
          <img
            src={form.photo_url}
            alt="preview"
            style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
          />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="admin-modal__btn admin-modal__btn--ghost"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <Upload size={15} />
          {uploading ? "Subiendo..." : form.photo_url ? "Cambiar foto" : "Subir foto"}
        </button>
        {!CLOUD_NAME && (
          <p className="admin-modal__hint" style={{ marginTop: 4 }}>
            Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET para subir fotos.
          </p>
        )}
      </div>

      {error && <p className="admin-modal__error">{error}</p>}
      <div className="admin-modal__actions">
        <button type="button" className="admin-modal__btn admin-modal__btn--ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={saving || uploading}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

// ── Main modal ─────────────────────────────────────────────────

export default function AdminProductsModal({ open, onClose }) {
  const [tab, setTab] = useState("productos");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [catForm, setCatForm] = useState(null); // null | "new" | {id, ...}
  const [prodForm, setProdForm] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null); // {type, id, name}

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        apiFetch("/products/categories"),
        apiFetch("/products"),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) loadAll();
  }, [open]);

  if (!open) return null;

  // ── category handlers ──

  async function saveCategory(form) {
    if (catForm?.id) {
      await apiFetch(`/products/categories/${catForm.id}`, { method: "PATCH", body: JSON.stringify(form) });
    } else {
      await apiFetch("/products/categories", { method: "POST", body: JSON.stringify(form) });
    }
    setCatForm(null);
    await loadAll();
  }

  async function deleteCategory(id) {
    await apiFetch(`/products/categories/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    await loadAll();
  }

  // ── product handlers ──

  async function saveProduct(form) {
    if (prodForm?.id) {
      await apiFetch(`/products/${prodForm.id}`, { method: "PATCH", body: JSON.stringify(form) });
    } else {
      await apiFetch("/products", { method: "POST", body: JSON.stringify(form) });
    }
    setProdForm(null);
    await loadAll();
  }

  async function deleteProduct(id) {
    await apiFetch(`/products/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    await loadAll();
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <div className="admin-modal__header-left">
            <Package size={18} strokeWidth={2.2} />
            <h2 className="admin-modal__title">Gestión de Productos</h2>
          </div>
          <button className="admin-modal__close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="admin-modal__tabs">
          <button
            className={`admin-modal__tab${tab === "productos" ? " admin-modal__tab--active" : ""}`}
            onClick={() => { setTab("productos"); setCatForm(null); setProdForm(null); }}
          >
            <Package size={14} /> Productos
          </button>
          <button
            className={`admin-modal__tab${tab === "categorias" ? " admin-modal__tab--active" : ""}`}
            onClick={() => { setTab("categorias"); setCatForm(null); setProdForm(null); }}
          >
            <FolderOpen size={14} /> Categorías
          </button>
        </div>

        <div className="admin-modal__body">
          {loading && <p className="admin-modal__hint">Cargando...</p>}
          {error && <p className="admin-modal__error">{error}</p>}

          {/* ── CATEGORÍAS ── */}
          {!loading && tab === "categorias" && (
            <>
              {catForm ? (
                <CategoryForm
                  initial={catForm === "new" ? {} : catForm}
                  onSave={saveCategory}
                  onCancel={() => setCatForm(null)}
                />
              ) : (
                <>
                  <button
                    className="admin-modal__btn admin-modal__btn--primary"
                    style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}
                    onClick={() => setCatForm("new")}
                  >
                    <Plus size={15} /> Nueva categoría
                  </button>
                  {categories.length === 0 ? (
                    <p className="admin-modal__hint">No hay categorías todavía.</p>
                  ) : (
                    <ul className="admin-modal__list">
                      {categories.map((cat) => (
                        <li key={cat.id} className="admin-modal__list-item">
                          <span className="admin-modal__list-name">
                            {cat.name}
                            {!cat.active && <span className="admin-modal__badge admin-modal__badge--gray">inactiva</span>}
                          </span>
                          <div className="admin-modal__list-actions">
                            <button onClick={() => setCatForm(cat)} title="Editar">
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete({ type: "cat", id: cat.id, name: cat.name })}
                              title="Eliminar"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}

          {/* ── PRODUCTOS ── */}
          {!loading && tab === "productos" && (
            <>
              {prodForm ? (
                <ProductForm
                  initial={prodForm === "new" ? {} : prodForm}
                  categories={categories}
                  onSave={saveProduct}
                  onCancel={() => setProdForm(null)}
                />
              ) : (
                <>
                  {categories.length === 0 ? (
                    <p className="admin-modal__hint">Primero crea una categoría.</p>
                  ) : (
                    <button
                      className="admin-modal__btn admin-modal__btn--primary"
                      style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}
                      onClick={() => setProdForm("new")}
                    >
                      <Plus size={15} /> Nuevo producto
                    </button>
                  )}
                  {products.length === 0 ? (
                    <p className="admin-modal__hint">No hay productos todavía.</p>
                  ) : (
                    <ul className="admin-modal__list">
                      {products.map((p) => (
                        <li key={p.id} className="admin-modal__list-item">
                          {p.photo_url && (
                            <img
                              src={p.photo_url}
                              alt={p.name}
                              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
                            />
                          )}
                          <span className="admin-modal__list-name">
                            {p.name}
                            <span className="admin-modal__list-sub">{p.category_name} · ${Number(p.price).toLocaleString("es-AR")}</span>
                            {!p.active && <span className="admin-modal__badge admin-modal__badge--gray">inactivo</span>}
                          </span>
                          <div className="admin-modal__list-actions">
                            <button onClick={() => setProdForm(p)} title="Editar">
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setConfirmDelete({ type: "prod", id: p.id, name: p.name })}
                              title="Eliminar"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}

          {/* ── CONFIRM DELETE ── */}
          {confirmDelete && (
            <div className="admin-modal-backdrop" onClick={() => setConfirmDelete(null)}>
              <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal__header">
                  <h2 className="admin-modal__title">Confirmar eliminación</h2>
                </div>
                <div className="admin-modal__body">
                  <p className="admin-modal__hint">
                    ¿Eliminar <strong>{confirmDelete.name}</strong>?
                    {confirmDelete.type === "cat" && " Si tiene productos asociados, no se podrá eliminar."}
                  </p>
                  <div className="admin-modal__actions">
                    <button
                      className="admin-modal__btn admin-modal__btn--ghost"
                      onClick={() => setConfirmDelete(null)}
                    >Cancelar</button>
                    <button
                      className="admin-modal__btn admin-modal__btn--danger"
                      onClick={() =>
                        confirmDelete.type === "cat"
                          ? deleteCategory(confirmDelete.id)
                          : deleteProduct(confirmDelete.id)
                      }
                    >Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
