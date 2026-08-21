import { useMemo, useState } from "react";
import useItems from "../hooks/useItems";
import "./Items.css";

function BrowseItems() {
  const { items } = useItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedAvailability, setSelectedAvailability] =
    useState("Available");
  const [notice, setNotice] = useState("");

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

  const handleBorrowRequest = (item) => {
    if (item.availability !== "Available") {
      setNotice(
        `${item.name} is not currently available to borrow.`
      );

      return;
    }

    setNotice(
      `Your request to borrow ${item.name} has been submitted.`
    );
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
                    disabled={
                      item.availability !== "Available"
                    }
                    onClick={() =>
                      handleBorrowRequest(item)
                    }
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
    </main>
  );
}

export default BrowseItems;