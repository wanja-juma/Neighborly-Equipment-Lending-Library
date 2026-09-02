
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

  
}