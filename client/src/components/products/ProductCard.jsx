import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { CONTACT } from "../../config/contact";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleConsult = () => {
    const text = encodeURIComponent(
      `Hola! Me interesa el producto: *${product.name}* ($${product.price}). ¿Está disponible?`
    );
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <div className="product-card">
      {product.photo_url ? (
        <img
          className="product-card__img"
          src={product.photo_url}
          alt={product.name}
        />
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
        <button
          className="product-card__btn product-card__btn--primary"
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, photo_url: product.photo_url })}
        >
          <ShoppingCart size={15} />
          Agregar
        </button>
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
