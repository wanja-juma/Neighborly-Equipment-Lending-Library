import { useState } from "react";
import CartContext from "./CartContext";

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(item) {
    setCartItems((current) => {
      if (current.some((i) => i.id === item.id)) {
        return current;
      }
      return [...current, item];
    });
  }

  function removeFromCart(itemId) {
    setCartItems((current) => current.filter((i) => i.id !== itemId));
  }
}

export default CartProvider;
