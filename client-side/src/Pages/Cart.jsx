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
   
  }, [currentUser, cartItems]);

  function handleModalSuccess(message) {
    if (selectedItem) {
      removeFromCart(selectedItem.id);
    }
    setSelectedItem(null);
    setNotice(message);
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