import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";

import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";

import BorrowRequestModal from "../components/BorrowRequestModal";

import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
  } = useCart();

  const {
    currentUser,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();


  const [
    selectedItem,
    setSelectedItem,
  ] = useState(null);

  const [
    notice,
    setNotice,
  ] = useState("");


  const requestItemId =
    useMemo(() => {
      const params =
        new URLSearchParams(
          location.search
        );

      return params.get(
        "request"
      );
    }, [location.search]);


  const requestedCartItem =
    useMemo(() => {
      if (
        !currentUser ||
        !requestItemId
      ) {
        return null;
      }

      return (
        cartItems.find(
          (item) =>
            String(item.id) ===
            String(requestItemId)
        ) || null
      );
    }, [
      currentUser,
      requestItemId,
      cartItems,
    ]);


  const activeItem =
    selectedItem ||
    requestedCartItem;


  useEffect(() => {
    if (
      !currentUser ||
      !requestItemId
    ) {
      return;
    }

    navigate(
      "/cart",
      {
        replace: true,
      }
    );
  }, [
    currentUser,
    requestItemId,
    navigate,
  ]);


  const handleRequest = (
    item
  ) => {
    setNotice("");

    if (!currentUser) {
      navigate(
        "/auth?mode=login",
        {
          state: {
            redirectTo:
              `/cart?request=${item.id}`,
          },
        }
      );

      return;
    }

    setSelectedItem(
      item
    );
  };


  const handleModalClose =
    () => {
      setSelectedItem(
        null
      );
    };


  const handleModalSuccess = (
    message
  ) => {
    if (activeItem?.id) {
      removeFromCart(
        activeItem.id
      );
    }

    setSelectedItem(
      null
    );

    setNotice(
      message ||
        "Borrowing request submitted successfully."
    );
  };


  const getOwnerName = (
    item
  ) => {
    if (
      item?.owner &&
      typeof item.owner ===
        "object"
    ) {
      const firstName =
        item.owner.first_name ||
        item.owner.firstName ||
        "";

      const lastName =
        item.owner.last_name ||
        item.owner.lastName ||
        "";

      return (
        item.owner.name ||
        [
          firstName,
          lastName,
        ]
          .filter(Boolean)
          .join(" ") ||
        "Neighbour"
      );
    }

    return (
      item?.ownerName ||
      item?.owner_name ||
      item?.owner ||
      "Neighbour"
    );
  };


  const getLocation = (
    item
  ) => {
    return (
      item?.location ||
      item?.owner?.location ||
      item?.owner?.profile
        ?.location ||
      ""
    );
  };


  return (
    <section className="cart-page">
      <div className="cart-header">
        <div>
          <h1>
            My Cart
          </h1>

          <p>
            Review your selected
            items and submit
            borrowing requests.
          </p>
        </div>

        <ShoppingCart
          size={30}
        />
      </div>


      {notice && (
        <div
          className="cart-notice"
          role="status"
        >
          {notice}
        </div>
      )}


      {cartItems.length ===
      0 ? (
        <div className="cart-empty">
          <ShoppingCart
            size={48}
          />

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add items from Browse
            Items to request them
            here.
          </p>
        </div>
      ) : (
        <>
          <div className="cart-summary">
            <h2>
              Selected Items
            </h2>

            <span className="cart-count">
              {cartItems.length}{" "}
              {cartItems.length ===
              1
                ? "item"
                : "items"}
            </span>
          </div>


          <div className="cart-grid">
            {cartItems.map(
              (item) => {
                const ownerName =
                  getOwnerName(
                    item
                  );

                const itemLocation =
                  getLocation(
                    item
                  );

                return (
                  <article
                    className="cart-card"
                    key={item.id}
                  >
                    <div className="cart-card__icon-wrap">
                      <span
                        className="cart-card__icon"
                        aria-hidden="true"
                      >
                        {item.icon ||
                          "🔧"}
                      </span>
                    </div>


                    <div className="cart-card__body">
                      <h3 className="cart-card__name">
                        {item.name}
                      </h3>


                      {item.category && (
                        <p className="cart-card__category">
                          {typeof item.category ===
                          "object"
                            ? item
                                .category
                                .name ||
                              "Equipment"
                            : item.category}
                        </p>
                      )}


                      {item.condition && (
                        <p className="cart-card__condition">
                          {
                            item.condition
                          }
                        </p>
                      )}


                      {item.description && (
                        <p className="cart-card__description">
                          {
                            item.description
                          }
                        </p>
                      )}


                      <div className="cart-card__meta">
                        {ownerName && (
                          <span>
                            <User
                              size={
                                13
                              }
                            />

                            {
                              ownerName
                            }
                          </span>
                        )}


                        {itemLocation && (
                          <span>
                            <MapPin
                              size={
                                13
                              }
                            />

                            {
                              itemLocation
                            }
                          </span>
                        )}
                      </div>


                      <div className="cart-card__actions">
                        <button
                          type="button"
                          className="cart-card__btn cart-card__btn--request"
                          onClick={() =>
                            handleRequest(
                              item
                            )
                          }
                        >
                          Request
                        </button>


                        <button
                          type="button"
                          className="cart-card__btn cart-card__btn--remove"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2
                            size={
                              16
                            }
                          />

                          <span>
                            Remove
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </>
      )}


      {activeItem && (
        <BorrowRequestModal
          item={activeItem}
          onClose={
            handleModalClose
          }
          onSuccess={
            handleModalSuccess
          }
        />
      )}
    </section>
  );
}


export default Cart;
