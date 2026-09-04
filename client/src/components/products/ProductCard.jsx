import { Minus, Plus, MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CONTACT } from "../../config/contact";

export default function ProductCard({ product }) {
  const { items, addItem, setQty } = useCart();

  const cartItem = items.find((i) => i.id === product.id);
  const qty = cartItem?.qty ?? 0;

  const handleConsult = () => {
    const text = encodeURIComponent(
      `Hola! Me interesa el producto: *${product.name}* ($${product.price}). ¿Está disponible?`
    );
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <div className="product-card">
      {product.photo_url ? (
        <img className="product-card__img" src={product.photo_url} alt={product.name} />
      ) : (
        <div className="product-card__img-placeholder">Sin imagen</div>
      )}

      <div className="product-card__body">
        <p className="product-card__cat">{product.category_name}</p>
        <h3 className="product-card__name">{product.name}</h3>
        {product.description && (
          <p className="product-card__desc">{product.description}</p>
        )}
        <p className="product-card__price">${product.price.toLocaleString("es-AR")}</p>
      </div>

      <div className="product-card__actions">
        {qty === 0 ? (
          <button
            className="product-card__btn product-card__btn--primary"
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, photo_url: product.photo_url })}
          >
            <ShoppingCart size={15} />
            Agregar
          </button>
        ) : (
          <div className="product-card__qty">
            <button onClick={() => setQty(product.id, qty - 1)}>
              <Minus size={14} />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty(product.id, qty + 1)}>
              <Plus size={14} />
            </button>
          </div>
        )}

        <button
          className="product-card__btn product-card__btn--ghost"
          onClick={handleConsult}
        >
          <MessageCircle size={15} />
          Consultar
        </button>
      </div>
    </div>
  );
}
