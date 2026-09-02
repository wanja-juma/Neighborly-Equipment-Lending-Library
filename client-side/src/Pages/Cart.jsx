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