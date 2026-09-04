import {
  useState,
} from "react";

import {
  ShoppingCart,
  Trash2,
} from "lucide-react";

import useCart from "../hooks/useCart";
import BorrowRequestModal from "../components/BorrowRequestModal";

import "./Cart.css";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
  } = useCart();

  const [
    selectedItem,
    setSelectedItem,
  ] = useState(null);

  const [notice, setNotice] =
    useState("");

  const handleRequestSuccess = () => {
    const requestedItemId =
      selectedItem?.id;

    if (requestedItemId) {
      removeFromCart(
        requestedItemId
      );
    }

    setSelectedItem(null);

    setNotice(
      "Borrowing request submitted successfully."
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>My Cart</h1>

          <p>
            Review your selected items
            and submit borrowing
            requests.
          </p>
        </div>

        <ShoppingCart size={30} />
      </div>

      {notice && (
        <div className="cart-notice">
          {notice}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={48} />

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add items from Browse
            Items to request them.
          </p>
        </div>
      ) : (
        <div className="cart-grid">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart-card"
            >
              <div className="cart-card-content">
                <h3>{item.name}</h3>

                {item.category && (
                  <p>
                    {typeof item.category ===
                    "object"
                      ? item.category.name
                      : item.category}
                  </p>
                )}

                {item.description && (
                  <p>
                    {item.description}
                  </p>
                )}
              </div>

              <div className="cart-actions">
                <button
                  type="button"
                  className="request-button"
                  onClick={() =>
                    setSelectedItem(
                      item
                    )
                  }
                >
                  Request
                </button>

                <button
                  type="button"
                  className="remove-cart-button"
                  onClick={() =>
                    removeFromCart(
                      item.id
                    )
                  }
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <BorrowRequestModal
          item={selectedItem}
          onClose={() =>
            setSelectedItem(null)
          }
          onSuccess={
            handleRequestSuccess
          }
        />
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, MapPin, Trash2 } from "lucide-react";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import BorrowRequestModal from "../components/BorrowRequestModal";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedItem, setSelectedItem] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const params = new URLSearchParams(location.search);
    const requestItemId = params.get("request");
    if (!requestItemId) return;

    const item = cartItems.find((i) => String(i.id) === requestItemId);
    if (item) {
      setSelectedItem(item);
    }

    navigate("/cart", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, cartItems]);

  function handleRequest(item) {
    if (!currentUser) {
      navigate("/auth?mode=login", {
        state: { redirectTo: `/cart?request=${item.id}` },
      });
      return;
    }
    setSelectedItem(item);
  }

  function handleModalClose() {
    setSelectedItem(null);
  }

  function handleModalSuccess(message) {
    if (selectedItem) {
      removeFromCart(selectedItem.id);
    }
    setSelectedItem(null);
    setNotice(message);
  }

  return (
    <section className="cart-page">
      {notice && (
        <div className="cart-notice" role="status">
          {notice}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <ShoppingCart size={40} />
          <h2>Your cart is empty</h2>
          <p>Add tools from Browse Tools to request them here.</p>
        </div>
      ) : (
        <>
          <div className="cart-header">
            <h2>Your Cart</h2>
            <span className="cart-count">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="cart-grid">
            {cartItems.map((item) => (
              <div className="cart-card" key={item.id}>
                <div className="cart-card__icon-wrap">
                  <span className="cart-card__icon" aria-hidden="true">
                    {item.icon || "🔧"}
                  </span>
                </div>

                <div className="cart-card__body">
                  <p className="cart-card__name">{item.name}</p>
                  <p className="cart-card__condition">{item.condition}</p>

                  <div className="cart-card__meta">
                    {item.owner && (
                      <span>
                        <User size={13} /> {item.owner}
                      </span>
                    )}
                    {item.location && (
                      <span>
                        <MapPin size={13} /> {item.location}
                      </span>
                    )}
                  </div>

                  <div className="cart-card__actions">
                    <button
                      type="button"
                      className="cart-card__btn cart-card__btn--request"
                      onClick={() => handleRequest(item)}
                    >
                      Request
                    </button>
                    <button
                      type="button"
                      className="cart-card__btn cart-card__btn--remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <BorrowRequestModal
        item={selectedItem}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </section>
  );
}

export default Cart;
