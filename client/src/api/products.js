const API_BASE = import.meta.env.VITE_API_URL;

export async function getCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) throw new Error("No se pudieron cargar las categorías");
  return res.json();
}

export async function getProducts(categorySlug = null) {
  const url = categorySlug
    ? `${API_BASE}/products?category=${categorySlug}`
    : `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}
