import { useMemo, useState } from "react";
import useItems from "../hooks/useItems";
import useRequests from "../hooks/useRequests";
import "./Items.css";

const getLocalDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function BrowseItems() {
  const { items } = useItems();

  const { addBorrowingRequest } = useRequests();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedAvailability, setSelectedAvailability] =
    useState("Available");
  const [notice, setNotice] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

const [borrowDates, setBorrowDates] = useState({
  startDate: "",
  endDate: "",
});

const [formError, setFormError] = useState("");

const minimumDate = getLocalDate();


  // Do not show the current user's items on the community page
  const communityItems = items.filter(
    (item) => item.ownerId !== 1
  );

  const categories = [
    "All Categories",
    ...new Set(
      communityItems.map((item) => item.category)
    ),
  ];

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return communityItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        item.owner.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;

      const matchesAvailability =
        selectedAvailability === "All Statuses" ||
        item.availability === selectedAvailability;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [
    communityItems,
    searchTerm,
    selectedCategory,
    selectedAvailability,
  ]);

 const openBorrowForm = (item) => {
  if (item.availability !== "Available") {
    setNotice(
      `${item.name} is not currently available to borrow.`
    );

    return;
  }

  setSelectedItem(item);

  setBorrowDates({
    startDate: "",
    endDate: "",
  });

  setFormError("");
  setNotice("");
};

const closeBorrowForm = () => {
  setSelectedItem(null);

  setBorrowDates({
    startDate: "",
    endDate: "",
  });

  setFormError("");
};

const handleDateChange = (event) => {
  const { name, value } = event.target;

  setBorrowDates((currentDates) => ({
    ...currentDates,
    [name]: value,
  }));

  setFormError("");
};

const handleBorrowRequest = (event) => {
  event.preventDefault();

  if (!selectedItem) {
    return;
  }

  if (
    !borrowDates.startDate ||
    !borrowDates.endDate
  ) {
    setFormError(
      "Please select both the borrowing and return dates."
    );

    return;
  }

  if (borrowDates.startDate < minimumDate) {
    setFormError(
      "The borrowing date cannot be in the past."
    );

    return;
  }

  if (
    borrowDates.endDate < borrowDates.startDate
  ) {
    setFormError(
      "The return date must be after the borrowing date."
    );

    return;
  }

  const result = addBorrowingRequest({
    itemId: selectedItem.id,
    itemName: selectedItem.name,
    itemIcon: selectedItem.icon,
    ownerId: selectedItem.ownerId,
    ownerName: selectedItem.owner,
    borrowerId: 1,
    borrowerName: "Wanja Juma",
    startDate: borrowDates.startDate,
    endDate: borrowDates.endDate,
  });

  if (!result.success) {
    setFormError(result.message);
    return;
  }

  setNotice(result.message);
  closeBorrowForm();
};

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedAvailability("Available");
  };

  return (
    <main className="dashboard-main">
      <section className="items-page">
        {notice && (
          <div className="browse-notice" role="status">
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        <header className="items-page-header">
          <div>
            <p className="page-label">
              COMMUNITY EQUIPMENT
            </p>

            <h1>Browse Items</h1>

            <p>
              Find tools and equipment available from
              neighbours in your community.
            </p>
          </div>
        </header>

        {/* Search and filters */}
        <section
          className="browse-filters"
          aria-label="Item filters"
        >
          <label className="browse-search">
            <span>⌕</span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search items, descriptions or owners..."
              aria-label="Search community items"
            />
          </label>

          <label className="filter-field">
            <span>Category</span>

            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Availability</span>

            <select
              value={selectedAvailability}
              onChange={(event) =>
                setSelectedAvailability(event.target.value)
              }
            >
              <option value="Available">Available</option>
              <option value="All Statuses">
                All Statuses
              </option>
              <option value="Requested">Requested</option>
              <option value="On Loan">On Loan</option>
            </select>
          </label>

          <button
            className="clear-filters-button"
            type="button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </section>

        {/* Result count */}
        <div className="browse-results-heading">
          <p>
            <strong>{filteredItems.length}</strong>
            {filteredItems.length === 1
              ? " item found"
              : " items found"}
          </p>
        </div>

        {/* Equipment results */}
        {filteredItems.length > 0 ? (
          <div className="items-page-grid">
            {filteredItems.map((item) => (
              <article
                className="equipment-card"
                key={item.id}
              >
                <div className="equipment-image">
                  <span>{item.icon}</span>

                  <span
                    className={`image-status ${item.statusColor}`}
                  >
                    {item.availability}
                  </span>
                </div>

                <div className="equipment-content">
                  <div className="equipment-heading">
                    <span className="equipment-category">
                      {item.category}
                    </span>
                  </div>

                  <h2>{item.name}</h2>

                  <p className="equipment-description">
                    {item.description}
                  </p>

                  <div className="equipment-details">
                    <span>
                      <b>Condition:</b> {item.condition}
                    </span>

                    <span>
                      <b>Owner:</b> {item.owner}
                    </span>

                    <span>
                      <b>Location:</b> {item.location}
                    </span>
                  </div>

                  <button
                    className="borrow-item-button"
                    type="button"
                    disabled={item.availability !== "Available"}
                    onClick={() => openBorrowForm(item)}
              >
                    {item.availability === "Available"
                    ? "Request to Borrow"
                    : "Currently Unavailable"}
                </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="items-empty-state">
            <span>🔍</span>

            <h2>No matching items found</h2>

            <p>
              Try changing your search term, category or
              availability filter.
            </p>

            <button
              className="empty-clear-button"
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {selectedItem && (
  <div className="borrow-modal-overlay">
    <section
      className="borrow-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrow-modal-title"
    >
      <header className="borrow-modal-header">
        <div>
          <p className="page-label">
            BORROWING REQUEST
          </p>

          <h2 id="borrow-modal-title">
            Request {selectedItem.name}
          </h2>

          <p>
            Select the dates you would like to borrow this
            item.
          </p>
        </div>

        <button
          className="close-modal-button"
          type="button"
          onClick={closeBorrowForm}
          aria-label="Close borrowing form"
        >
          ×
        </button>
      </header>

      <div className="borrow-item-summary">
        <span className="borrow-summary-icon">
          {selectedItem.icon}
        </span>

        <div>
          <strong>{selectedItem.name}</strong>

          <span>
            Owned by {selectedItem.owner}
          </span>

          <small>
            {selectedItem.condition}
          </small>
        </div>
      </div>

      <form
        className="borrow-date-form"
        onSubmit={handleBorrowRequest}
      >
        <div className="borrow-date-fields">
          <label className="item-form-field">
            <span>
              Borrowing Date <b>*</b>
            </span>

            <input
              type="date"
              name="startDate"
              value={borrowDates.startDate}
              min={minimumDate}
              onChange={handleDateChange}
            />
          </label>

          <label className="item-form-field">
            <span>
              Return Date <b>*</b>
            </span>

            <input
              type="date"
              name="endDate"
              value={borrowDates.endDate}
              min={
                borrowDates.startDate || minimumDate
              }
              onChange={handleDateChange}
            />
          </label>
        </div>

        {formError && (
          <div className="borrow-form-error" role="alert">
            {formError}
          </div>
        )}

        <div className="borrow-request-information">
          <strong>Before submitting</strong>

          <ul>
            <li>
              Wait for the item owner to approve your
              request.
            </li>

            <li>
              Collect the item only after the request is
              approved.
            </li>

            <li>
              Return the item by the selected return date.
            </li>
          </ul>
        </div>

        <div className="borrow-modal-actions">
          <button
            className="cancel-request-button"
            type="button"
            onClick={closeBorrowForm}
          >
            Cancel
          </button>

          <button
            className="submit-request-button"
            type="submit"
          >
            Submit Request
          </button>
        </div>
      </form>
    </section>
  </div>
)}
    </main>
  );
}

export default BrowseItems;