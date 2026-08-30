import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useItems from "../hooks/useItems";
import "./Items.css";

function MyListings() {
  const {
    items,
    itemsLoading,
    itemsError,
    deleteItem,
  } = useItems();

  const { currentUser } = useAuth();

  const [notice, setNotice] = useState("");
  const [deleteError, setDeleteError] =
    useState("");

  const [
    deletingItemId,
    setDeletingItemId,
  ] = useState(null);

  const currentUserId = String(
    currentUser?.id || ""
  );

  const myItems = items.filter((item) => {
    const ownerId =
      item.ownerId ?? item.owner_id;

    return String(ownerId) === currentUserId;
  });

  const handleDeleteItem = async (item) => {
    setNotice("");
    setDeleteError("");

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingItemId(item.id);

    try {
      await deleteItem(item.id);

      setNotice(
        `${item.name} was deleted successfully.`
      );
    } catch (error) {
      setDeleteError(
        error.message ||
          `Failed to delete ${item.name}.`
      );
    } finally {
      setDeletingItemId(null);
    }
  };

  if (itemsLoading) {
    return (
      <main className="dashboard-main">
        <section className="items-page">
          <p>Loading your listings...</p>
        </section>
      </main>
    );
  }

  if (itemsError) {
    return (
      <main className="dashboard-main">
        <section className="items-page">
          <p role="alert">{itemsError}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <section className="items-page">
        <header className="items-page-header">
          <div>
            <p className="page-label">
              OWNER INVENTORY
            </p>

            <h1>My Listings</h1>

            <p>
              Manage the tools and equipment you
              have listed.
            </p>
          </div>

          <Link
            className="add-item-link"
            to="/items/new"
          >
            <span>+</span>
            Add New Item
          </Link>
        </header>

        {notice && (
          <div
            className="listing-notice success"
            role="status"
          >
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

        {deleteError && (
          <div
            className="listing-notice error"
            role="alert"
          >
            <span>{deleteError}</span>

            <button
              type="button"
              onClick={() =>
                setDeleteError("")
              }
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="listings-summary">
          <span>
            <strong>{myItems.length}</strong>

            {myItems.length === 1
              ? " item listed"
              : " items listed"}
          </span>
        </div>

        {myItems.length > 0 ? (
          <div className="items-page-grid">
            {myItems.map((item) => {
              const isDeleting =
                String(deletingItemId) ===
                String(item.id);

              const availabilityClass = (
                item.statusColor ||
                item.availability ||
                ""
              )
                .toLowerCase()
                .replaceAll(" ", "-");

              return (
                <article
                  className="equipment-card"
                  key={item.id}
                >
                  <div className="equipment-image">
                    <span>
                      {item.icon || "🧰"}
                    </span>

                    <button
                      className="equipment-options"
                      type="button"
                      aria-label={`Options for ${item.name}`}
                    >
                      •••
                    </button>
                  </div>

                  <div className="equipment-content">
                    <div className="equipment-heading">
                      <span className="equipment-category">
                        {item.category ||
                          "Equipment"}
                      </span>

                      <span
                        className={`equipment-availability ${availabilityClass}`}
                      >
                        {item.availability ||
                          "Unknown"}
                      </span>
                    </div>

                    <h2>{item.name}</h2>

                    <p className="equipment-description">
                      {item.description}
                    </p>

                    <div className="equipment-details">
                      <span>
                        <b>Condition:</b>{" "}
                        {item.condition ||
                          "Not specified"}
                      </span>

                      <span>
                        <b>Location:</b>{" "}
                        {item.location ||
                          "Greenview Estate"}
                      </span>
                    </div>

                    <div className="listing-actions">
                      <Link
                        className="change-availability-button"
                        to={`/listings/${item.id}/availability`}
                      >
                        Change Availability
                      </Link>

                      <Link
                        className="edit-listing-button"
                        to={`/listings/${item.id}/edit`}
                      >
                        Edit Listing
                      </Link>

                      <button
                        className="delete-listing-button"
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          handleDeleteItem(item)
                        }
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="items-empty-state">
            <span>🧰</span>

            <h2>No items listed yet</h2>

            <p>
              Add your first tool or equipment item
              to start sharing with your community.
            </p>

            <Link to="/items/new">
              Add Your First Item
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default MyListings;