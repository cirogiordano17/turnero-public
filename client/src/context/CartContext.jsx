import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "pelu_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const idx = state.findIndex((i) => i.id === action.item.id);
      if (idx >= 0) {
        return state.map((i, x) =>
          x === idx ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "SET_QTY":
      if (action.qty <= 0) return state.filter((i) => i.id !== action.id);
      return state.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i));
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => dispatch({ type: "ADD", item });
  const removeItem = (id) => dispatch({ type: "REMOVE", id });
  const setQty = (id, qty) => dispatch({ type: "SET_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
