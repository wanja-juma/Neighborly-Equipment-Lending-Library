import { Link } from "react-router-dom";
import useItems from "../hooks/useItems";
import "./Items.css";

function MyListings() {
  const {
  items,
  itemsLoading,
  itemsError,
} = useItems();

  const myItems = items.filter(
    (item) => item.ownerId === "1"
  );
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
        <p>{itemsError}</p>
      </section>
    </main>
  );
}

  return (
    <main className="dashboard-main">
      <section className="items-page">
        <header className="items-page-header">
          <div>
            <p className="page-label">OWNER INVENTORY</p>
            <h1>My Listings</h1>

            <p>
              Manage the tools and equipment you have listed.
            </p>
          </div>

          <Link className="add-item-link" to="/items/new">
            <span>+</span>
            Add New Item
          </Link>
        </header>

        <div className="listings-summary">
          <span>
            <strong>{myItems.length}</strong>
            {myItems.length === 1 ? " item listed" : " items listed"}
          </span>
        </div>

        {myItems.length > 0 ? (
          <div className="items-page-grid">
            {myItems.map((item) => (
              <article className="equipment-card" key={item.id}>
                <div className="equipment-image">
                  <span>{item.icon}</span>

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
                      {item.category}
                    </span>

                    <span
                      className={`equipment-availability ${item.statusColor}`}
                    >
                      {item.availability}
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
                      <b>Location:</b> {item.location}
                    </span>
                  </div>

                  <div className="listing-actions">
                    <button
                      className="edit-item-button"
                      type="button"
                    >
                      Edit Listing
                    </button>

                    <button
                      className="availability-button"
                      type="button"
                    >
                      Change Availability
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="items-empty-state">
            <span>🧰</span>
            <h2>No items listed yet</h2>

            <p>
              Add your first tool or equipment item to start
              sharing with your community.
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