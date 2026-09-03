import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "neighborlyCart";

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      return storedCart
        ? JSON.parse(storedCart)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((currentItems) => {
      const alreadyInCart =
        currentItems.some(
          (cartItem) =>
            Number(cartItem.id) ===
            Number(item.id)
        );

      if (alreadyInCart) {
        return currentItems;
      }

      return [...currentItems, item];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          Number(item.id) !==
          Number(itemId)
      )
    );
  };

  const isInCart = (itemId) =>
    cartItems.some(
      (item) =>
        Number(item.id) ===
        Number(itemId)
    );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount: cartItems.length,
      addToCart,
      removeFromCart,
      isInCart,
    }),
    [cartItems]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}