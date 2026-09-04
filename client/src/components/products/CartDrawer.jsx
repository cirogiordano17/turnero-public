import { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus, Send } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { getTransferSettings } from "../../admin/api/admin.api";

const SHIPPING_OPTIONS = [
  { value: "retiro", label: "Retiro en local (gratis)" },
  { value: "villa_allende", label: "Villa Allende (gratis)" },
  { value: "otro", label: "Otro destino" },
];

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, setQty, clearCart, subtotal } = useCart();
  const [shipping, setShipping] = useState("retiro");
  const [shippingCost, setShippingCost] = useState(0);
  const [waProductos, setWaProductos] = useState("");

  useEffect(() => {
    getTransferSettings()
      .then((data) => {
        setShippingCost(data.shipping_cost || 0);
        setWaProductos(data.whatsapp_productos || "");
      })
      .catch(() => {});
  }, []);

  const extraCost = shipping === "otro" ? shippingCost : 0;
  const total = subtotal + extraCost;

  const handleSendWhatsApp = () => {
    if (!waProductos) return;
    const lines = items.map(
      (i) => `• ${i.name} x${i.qty} — $${(i.price * i.qty).toLocaleString("es-AR")}`
    );
    const shippingLabel =
      shipping === "retiro"
        ? "Retiro en local"
        : shipping === "villa_allende"
        ? "Villa Allende (envío gratis)"
        : `Envío a domicilio (+$${shippingCost.toLocaleString("es-AR")})`;

    const msg = [
      "Hola! Quiero hacer el siguiente pedido:",
      "",
      ...lines,
      "",
      `Envío: ${shippingLabel}`,
      `*Total: $${total.toLocaleString("es-AR")}*`,
    ].join("\n");

    window.open(
      `https://wa.me/${waProductos}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (!open) return null;

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Mi carrito</h2>
          <button className="cart-drawer__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.photo_url && (
                    <img className="cart-item__img" src={item.photo_url} alt={item.name} />
                  )}
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">
                      ${(item.price * item.qty).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div className="cart-item__controls">
                    <button onClick={() => setQty(item.id, item.qty - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => setQty(item.id, item.qty + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer__shipping">
              <p className="cart-drawer__section-label">Envío / Retiro</p>
              {SHIPPING_OPTIONS.map((opt) => (
                <label key={opt.value} className="cart-drawer__radio">
                  <input
                    type="radio"
                    name="shipping"
                    value={opt.value}
                    checked={shipping === opt.value}
                    onChange={() => setShipping(opt.value)}
                  />
                  {opt.label}
                  {opt.value === "otro" && shippingCost > 0 && (
                    <span className="cart-drawer__shipping-cost">
                      {" "}(+${shippingCost.toLocaleString("es-AR")})
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Total</span>
                <span className="cart-drawer__total-amount">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>

              {waProductos ? (
                <button className="cart-drawer__send" onClick={handleSendWhatsApp}>
                  <Send size={16} />
                  Enviar pedido por WhatsApp
                </button>
              ) : (
                <p className="cart-drawer__hint">
                  Configurá el WhatsApp de productos desde el panel admin.
                </p>
              )}

              <button className="cart-drawer__clear" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
