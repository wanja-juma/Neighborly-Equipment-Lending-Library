import { useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useItems from "../hooks/useItems";
import "./Items.css";


function MyListings() {
  const { currentUser } = useAuth();

  const {
    items,
    itemsLoading,
    itemsError,
    deleteItem,
  } = useItems();

  const [notice, setNotice] =
    useState("");

  const [
    deleteError,
    setDeleteError,
  ] = useState("");

  const [
    deletingItemId,
    setDeletingItemId,
  ] = useState(null);


  const currentUserId = String(
    currentUser?.id || "1"
  );

  const safeItems = Array.isArray(items)
    ? items
    : [];


  const myItems = safeItems.filter(
    (item) => {
      const ownerId =
        item.ownerId ??
        item.owner_id ??
        item.owner?.id;

      return (
        String(ownerId) ===
        currentUserId
      );
    }
  );


  const getCategoryName = (
    item
  ) => {
    if (
      item.category &&
      typeof item.category ===
        "object"
    ) {
      return (
        item.category.name ||
        "Other"
      );
    }

    return (
      item.category ||
      item.category_name ||
      "Other"
    );
  };


  const handleDeleteItem =
    async (item) => {
      setNotice("");
      setDeleteError("");

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${item.name}"? This action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      setDeletingItemId(
        item.id
      );

      try {
        const result =
          await deleteItem(
            item.id
          );

        if (
          result &&
          result.success === false
        ) {
          throw new Error(
            result.message ||
              "The item could not be deleted."
          );
        }

        setNotice(
          `${item.name} was deleted successfully.`
        );
      } catch (error) {
        setDeleteError(
          error.message ||
            `Failed to delete ${item.name}.`
        );
      } finally {
        setDeletingItemId(
          null
        );
      }
    };


  if (itemsLoading) {
    return (
      <main className="dashboard-main">
        <section className="items-page">
          <p>
            Loading your listings...
          </p>
        </section>
      </main>
    );
  }


  if (itemsError) {
    return (
      <main className="dashboard-main">
        <section className="items-page">
          <p>
            {itemsError}
          </p>
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

            <h1>
              My Listings
            </h1>

            <p>
              Manage the tools and
              equipment you have listed.
            </p>
          </div>

          <Link
            className="add-item-link"
            to="/items/new"
          >
            <span>
              +
            </span>

            Add New Item
          </Link>
        </header>


        {notice && (
          <div
            className="listing-notice success"
            role="status"
          >
            <span>
              {notice}
            </span>

            <button
              type="button"
              onClick={() =>
                setNotice("")
              }
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
            <span>
              {deleteError}
            </span>

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
            <strong>
              {myItems.length}
            </strong>{" "}

            {myItems.length === 1
              ? "item listed"
              : "items listed"}
          </span>
        </div>


        {myItems.length > 0 ? (
          <div className="items-page-grid">

            {myItems.map(
              (item) => {
                const isDeleting =
                  String(
                    deletingItemId
                  ) ===
                  String(
                    item.id
                  );

                const availability =
                  item.availability ||
                  item.status ||
                  "Unknown";

                const availabilityClass =
                  item.statusColor ||
                  String(
                    availability
                  )
                    .toLowerCase()
                    .replaceAll(
                      " ",
                      "-"
                    );


                return (
                  <article
                    className="equipment-card"
                    key={item.id}
                  >
                    <div className="equipment-image">

                      <span>
                        {item.icon ||
                          "🧰"}
                      </span>

                      <button
                        className="equipment-options"
                        type="button"
                        aria-label={`Options for ${
                          item.name ||
                          "equipment"
                        }`}
                      >
                        •••
                      </button>

                    </div>


                    <div className="equipment-content">

                      <div className="equipment-heading">

                        <span className="equipment-category">
                          {
                            getCategoryName(
                              item
                            )
                          }
                        </span>

                        <span
                          className={`equipment-availability ${availabilityClass}`}
                        >
                          {availability}
                        </span>

                      </div>


                      <h2>
                        {item.name ||
                          "Equipment"}
                      </h2>


                      <p className="equipment-description">
                        {item.description ||
                          "No description provided."}
                      </p>


                      <div className="equipment-details">

                        <span>
                          <b>
                            Condition:
                          </b>{" "}
                          {item.condition ||
                            "Not specified"}
                        </span>

                        <span>
                          <b>
                            Location:
                          </b>{" "}
                          {item.location ||
                            "Greenview Estate"}
                        </span>

                      </div>


                      <div className="listing-actions">

                        <Link
                          to={`/items/${item.id}/edit`}
                          className="listing-action-btn edit-listing-btn"
                        >
                          Edit Listing
                        </Link>


                        <Link
                          to={`/items/${item.id}/availability`}
                          className="listing-action-btn availability-btn"
                        >
                          Change Availability
                        </Link>


                        <button
                          type="button"
                          className="listing-action-btn delete-listing-btn"
                          disabled={
                            isDeleting
                          }
                          onClick={() =>
                            handleDeleteItem(
                              item
                            )
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
              }
            )}

          </div>
        ) : (
          <div className="items-empty-state">

            <span>
              🧰
            </span>

            <h2>
              No items listed yet
            </h2>

            <p>
              Add your first tool or
              equipment item to start
              sharing with your
              community.
            </p>

            <Link
              to="/items/new"
            >
              Add Your First Item
            </Link>

          </div>
        )}

      </section>
    </main>
  );
}


export default MyListings;