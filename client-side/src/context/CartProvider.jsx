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

      const parsedCart =
        storedCart
          ? JSON.parse(storedCart)
          : [];

      return Array.isArray(
        parsedCart
      )
        ? parsedCart
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

          if (
            alreadyInCart
          ) {
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


  const clearCart =
    useCallback(() => {
      setCartItems([]);
    }, []);


  const value =
    useMemo(
      () => ({
        cartItems,

        cartCount:
          cartItems.length,

        count:
          cartItems.length,

        addToCart,

        removeFromCart,

        isInCart,

        clearCart,
      }),
      [
        cartItems,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart,
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