import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import CartContext from "./CartContext";


const CART_STORAGE_KEY =
  "neighborlyCart";


function CartProvider({
  children,
}) {
  const [
    cartItems,
    setCartItems,
  ] = useState(() => {
    try {
      const storedCart =
        localStorage.getItem(
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
      JSON.stringify(
        cartItems
      )
    );
  }, [cartItems]);


  const addToCart =
    useCallback((item) => {
      setCartItems(
        (currentItems) => {
          const alreadyInCart =
            currentItems.some(
              (cartItem) =>
                Number(
                  cartItem.id
                ) ===
                Number(
                  item.id
                )
            );

          if (alreadyInCart) {
            return currentItems;
          }

          return [
            ...currentItems,
            item,
          ];
        }
      );
    }, []);


  const removeFromCart =
    useCallback(
      (itemId) => {
        setCartItems(
          (currentItems) =>
            currentItems.filter(
              (item) =>
                Number(
                  item.id
                ) !==
                Number(
                  itemId
                )
            )
        );
      },
      []
    );


  const isInCart =
    useCallback(
      (itemId) => {
        return cartItems.some(
          (item) =>
            Number(
              item.id
            ) ===
            Number(
              itemId
            )
        );
      },
      [cartItems]
    );


  const value =
    useMemo(
      () => ({
        cartItems,

        cartCount:
          cartItems.length,

        addToCart,

        removeFromCart,

        isInCart,
      }),
      [
        cartItems,
        addToCart,
        removeFromCart,
        isInCart,
      ]
    );


  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}


export default CartProvider;
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

  function isInCart(itemId) {
    return cartItems.some((i) => i.id === itemId);
  }

  function clearCart() {
    setCartItems([]);
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
    count: cartItems.length,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export default CartProvider;
