import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import CartDrawer from "../components/products/CartDrawer";
import { getCategories, getProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import "../styles/products.css";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(activeSlug)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeSlug]);

  return (
    <div className="products-page">
      <Navbar />

      <main className="products-main">
        <div className="products-header">
          <button className="products-back" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            Volver
          </button>
          <h1 className="products-title">Productos</h1>
        </div>

        {categories.length > 0 && (
          <div className="products-categories">
            <button
              className={`products-cat-btn${activeSlug === null ? " products-cat-btn--active" : ""}`}
              onClick={() => setActiveSlug(null)}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`products-cat-btn${activeSlug === cat.slug ? " products-cat-btn--active" : ""}`}
                onClick={() => setActiveSlug(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="products-loading">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="products-empty">No hay productos disponibles en esta categoría.</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <button
        className="cart-fab"
        onClick={() => setCartOpen(true)}
        aria-label="Ver carrito"
      >
        <ShoppingCart size={22} />
        {totalItems > 0 && <span className="cart-fab__badge">{totalItems}</span>}
      </button>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
