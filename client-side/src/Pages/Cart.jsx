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