import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";
import "./BorrowRequestModal.css";
 
const getLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
 
const getItemOwnerId = (item) =>
  item?.ownerId ?? item?.owner_id ?? item?.owner?.id ?? "";

const getItemOwnerName = (item) => {
  if (item?.owner && typeof item.owner === "object") {
    const firstName = item.owner.first_name || item.owner.firstName || "";
    const lastName = item.owner.last_name || item.owner.lastName || "";
    return (
      item.owner.name ||
      [firstName, lastName].filter(Boolean).join(" ") ||
      "Neighbour"
    );
  }
  return item?.ownerName || item?.owner_name || item?.owner || "Neighbour";
};

const getItemAvailability = (item) =>
  item?.availability || item?.status || "Available";
 
// A borrow-request form for a single item. Renders nothing if `item` is null —
// the parent controls when it's open by passing/clearing the item.
function BorrowRequestModal({ item, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const { addBorrowingRequest } = useRequests();
 
  const [borrowDates, setBorrowDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
 
  const minimumDate = getLocalDate();
 
  if (!item) {
    return null;
  }

  function handleDateChange(event) {
    const { name, value } = event.target;
    setBorrowDates((current) => ({ ...current, [name]: value }));
    setFormError("");
  }
 
  async function handleSubmit(event) {
    event.preventDefault();
 
    const availability = getItemAvailability(item).toLowerCase();
    if (availability !== "available") {
      setFormError("This item is no longer available to borrow.");
      return;
    }
 
    if (!borrowDates.startDate || !borrowDates.endDate) {
      setFormError("Please select both the borrowing and return dates.");
      return;
    }
 
    if (borrowDates.startDate < minimumDate) {
      setFormError("The borrowing date cannot be in the past.");
      return;
    }
 
    if (borrowDates.endDate < borrowDates.startDate) {
      setFormError("The return date must be after the borrowing date.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await addBorrowingRequest({
        itemId: item.id,
        itemName: item.name,
        itemIcon: item.icon || "🧰",
        ownerId: getItemOwnerId(item),
        ownerName: getItemOwnerName(item),
        borrowerId: currentUser?.id,
        borrowerName: currentUser?.name,
        startDate: borrowDates.startDate,
        endDate: borrowDates.endDate,
      });
 
      if (result && result.success === false) {
        setFormError(result.message || "Unable to submit the request.");
        return;
      }
 
      onSuccess?.(result?.message || "Borrowing request submitted successfully.");
    } catch (error) {
      setFormError(error.message || "Unable to submit the borrowing request.");
    } finally {
      setSubmitting(false);
    }
  }
   } 