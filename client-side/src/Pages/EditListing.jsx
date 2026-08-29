import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useItems from "../hooks/useItems";
import "./Items.css";

const categories = [
  "Power Tools",
  "Hand Tools",
  "Garden Equipment",
  "Cleaning Equipment",
  "Outdoor Equipment",
  "Automotive",
  "Other",
];

const conditions = ["New", "Excellent", "Good", "Fair"];

const itemIcons = ["🔨", "🔧", "🪛", "🪚", "🧹", "🪜", "🌱", "🧰"];

const initialFormData = {
  name: "",
  category: "",
  condition: "",
  description: "",
  icon: "🧰",
  availability: "Available",
};

function EditItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const { items, itemsLoading, itemsError, updateItem } = useItems();
  const { currentUser } = useAuth();

  const currentUserId = String(currentUser?.id || "");

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = items.find(
    (item) => String(item.id) === String(itemId)
  );

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    setFormData({
      name: selectedItem.name || "",
      category: selectedItem.category || "",
      condition: selectedItem.condition || "",
      description: selectedItem.description || "",
      icon: selectedItem.icon || "🧰",
      availability: selectedItem.availability || "Available",
    });
  }, [selectedItem]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.condition) {
      newErrors.condition = "Please select the condition.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    }

    if (!formData.availability) {
      newErrors.availability = "Please select the availability.";
    }

    setFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateItem(itemId, {
        name: formData.name.trim(),
        category: formData.category,
        condition: formData.condition,
        description: formData.description.trim(),
        icon: formData.icon,
        availability: formData.availability,
        statusColor:
          formData.availability === "Available" ? "available" : "unavailable",
        updatedAt: new Date().toISOString(),
      });

      navigate("/listings");
    } catch (error) {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        submit: error.message || "Failed to update the listing.",
      }));

      setIsSubmitting(false);
    }
  };

  if (itemsLoading) {
    return (
      <main className="dashboard-main">
        <section className="edit-item-page">
          <p>Loading listing...</p>
        </section>
      </main>
    );
  }

  if (itemsError) {
    return (
      <main className="dashboard-main">
        <section className="edit-item-page">
          <p>{itemsError}</p>
        </section>
      </main>
    );
  }

  if (!selectedItem) {
    return (
      <main className="dashboard-main">
        <section className="edit-item-page">
          <div className="edit-item-empty">
            <h1>Listing Not Found</h1>
            <p>The listing may have been deleted or does not exist.</p>
            <Link to="/listings">Return to My Listings</Link>
          </div>
        </section>
      </main>
    );
  }

  const ownerId = selectedItem.ownerId ?? selectedItem.owner_id;

  if (String(ownerId) !== currentUserId) {
    return (
      <main className="dashboard-main">
        <section className="edit-item-page">
          <div className="edit-item-empty">
            <h1>Permission Denied</h1>
            <p>You can only edit your own listings.</p>
            <Link to="/listings">Return to My Listings</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <section className="edit-item-page">
        <header className="edit-item-header">
          <div>
            <p className="page-label">OWNER INVENTORY</p>
            <h1>Edit Listing</h1>
            <p>Update the item's information, condition and availability.</p>
          </div>

          <Link className="back-to-listings" to="/listings">
            ← Back to My Listings
          </Link>
        </header>

        <div className="edit-item-layout">
          <form className="edit-item-form" onSubmit={handleSubmit} noValidate>
            <label className="edit-form-field">
              <span>
                Item Name <b>*</b>
              </span>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={formErrors.name ? "input-error" : ""}
              />

              {formErrors.name && (
                <small className="field-error">{formErrors.name}</small>
              )}
            </label>

            <div className="edit-fields-row">
              <label className="edit-form-field">
                <span>
                  Category <b>*</b>
                </span>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={formErrors.category ? "input-error" : ""}
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {formErrors.category && (
                  <small className="field-error">
                    {formErrors.category}
                  </small>
                )}
              </label>

              <label className="edit-form-field">
                <span>
                  Condition <b>*</b>
                </span>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={formErrors.condition ? "input-error" : ""}
                >
                  <option value="">Select condition</option>

                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>

                {formErrors.condition && (
                  <small className="field-error">
                    {formErrors.condition}
                  </small>
                )}
              </label>
            </div>

            <label className="edit-form-field">
              <span>
                Description <b>*</b>
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                maxLength="300"
                className={formErrors.description ? "input-error" : ""}
              />

              <div className="edit-description-help">
                {formErrors.description ? (
                  <small className="field-error">
                    {formErrors.description}
                  </small>
                ) : (
                  <small>Describe the item clearly.</small>
                )}

                <small>{formData.description.length}/300</small>
              </div>
            </label>

            <label className="edit-form-field">
              <span>
                Availability <b>*</b>
              </span>

              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={formErrors.availability ? "input-error" : ""}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              {formErrors.availability && (
                <small className="field-error">
                  {formErrors.availability}
                </small>
              )}
            </label>

            <fieldset className="edit-icon-fieldset">
              <legend>Item Icon</legend>

              <div className="edit-icon-options">
                {itemIcons.map((icon) => (
                  <label
                    className={
                      formData.icon === icon
                        ? "edit-icon-option selected"
                        : "edit-icon-option"
                    }
                    key={icon}
                  >
                    <input
                      type="radio"
                      name="icon"
                      value={icon}
                      checked={formData.icon === icon}
                      onChange={handleChange}
                    />

                    <span>{icon}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {formErrors.submit && (
              <p className="edit-submit-error" role="alert">
                {formErrors.submit}
              </p>
            )}

            <div className="edit-form-actions">
              <Link className="cancel-edit-button" to="/listings">
                Cancel
              </Link>

              <button
                className="save-edit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <aside className="edit-item-preview">
            <p className="page-label">LISTING PREVIEW</p>

            <div className="edit-preview-icon">{formData.icon}</div>

            <span className="equipment-category">
              {formData.category || "Category"}
            </span>

            <h2>{formData.name || "Item Name"}</h2>

            <p>{formData.description || "Item description"}</p>

            <div className="edit-preview-details">
              <span>
                <b>Condition:</b> {formData.condition || "Not selected"}
              </span>

              <span>
                <b>Availability:</b> {formData.availability}
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default EditItem;