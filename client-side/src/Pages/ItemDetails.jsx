import {
  Link,
  useParams,
} from "react-router-dom";

import useItems from "../hooks/useItems";

import "./ItemDetails.css";


function ItemDetails() {
  const { itemId } =
    useParams();

  const {
    items,
    itemsLoading,
    itemsError,
  } = useItems();


  const safeItems =
    Array.isArray(items)
      ? items
      : Array.isArray(items?.items)
        ? items.items
        : [];


  const item =
    safeItems.find(
      (currentItem) =>
        String(currentItem.id) ===
        String(itemId)
    );


  const getCategoryName = () => {
    if (
      item?.category &&
      typeof item.category === "object"
    ) {
      return (
        item.category.name ||
        item.category.title ||
        "Not specified"
      );
    }

    return (
      item?.category ||
      item?.categoryName ||
      item?.category_name ||
      "Not specified"
    );
  };


  const getOwnerName = () => {
    if (
      item?.owner &&
      typeof item.owner === "object"
    ) {
      const firstName =
        item.owner.firstName ||
        item.owner.first_name ||
        "";

      const lastName =
        item.owner.lastName ||
        item.owner.last_name ||
        "";

      return (
        item.owner.name ||
        [firstName, lastName]
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


  const availability =
    item?.availability ||
    item?.status ||
    "Unknown";


  const isAvailable =
    String(availability)
      .toLowerCase() ===
    "available";


  if (itemsLoading) {
    return (
      <main className="dashboard-main">
        <section className="item-details-page">
          <p>
            Loading item details...
          </p>
        </section>
      </main>
    );
  }


  if (itemsError) {
    return (
      <main className="dashboard-main">
        <section className="item-details-page">

          <div className="item-details-state">

            <h2>
              Unable to load item
            </h2>

            <p>
              {itemsError}
            </p>

            <Link
              to="/items"
              className="item-details-back-button"
            >
              ← Back to Browse Items
            </Link>

          </div>

        </section>
      </main>
    );
  }


  if (!item) {
    return (
      <main className="dashboard-main">
        <section className="item-details-page">

          <div className="item-details-state">

            <h2>
              Item not found
            </h2>

            <p>
              The equipment you are
              looking for could not be
              found.
            </p>

            <Link
              to="/items"
              className="item-details-back-button"
            >
              ← Back to Browse Items
            </Link>

          </div>

        </section>
      </main>
    );
  }


  return (
    <main className="dashboard-main">

      <section className="item-details-page">

        <Link
          to="/items"
          className="item-details-back-link"
        >
          ← Back to Browse Items
        </Link>


        <div className="item-details-card">

          <div className="item-details-image-area">

            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="item-details-image"
              />
            ) : (
              <div className="item-details-placeholder">
                🧰
              </div>
            )}

          </div>


          <div className="item-details-information">

            <p className="item-details-label">
              EQUIPMENT DETAILS
            </p>


            <h1>
              {item.name ||
                "Equipment"}
            </h1>


            <div
              className={`item-details-status ${
                isAvailable
                  ? "available"
                  : "unavailable"
              }`}
            >
              {availability}
            </div>


            <p className="item-details-description">
              {item.description ||
                "No description is available for this item."}
            </p>


            <div className="item-details-meta">

              <div>
                <span>
                  Condition
                </span>

                <strong>
                  {item.condition ||
                    "Not specified"}
                </strong>
              </div>


              <div>
                <span>
                  Category
                </span>

                <strong>
                  {getCategoryName()}
                </strong>
              </div>


              <div>
                <span>
                  Owner
                </span>

                <strong>
                  {getOwnerName()}
                </strong>
              </div>

            </div>


            <div className="item-details-actions">

              {isAvailable ? (
                <Link
                  to="/items"
                  className="item-details-primary-button"
                >
                  Request to Borrow
                </Link>
              ) : (
                <button
                  type="button"
                  className="item-details-disabled-button"
                  disabled
                >
                  Currently Unavailable
                </button>
              )}

              <Link
                to="/items"
                className="item-details-secondary-button"
              >
                Browse More Items
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


export default ItemDetails;