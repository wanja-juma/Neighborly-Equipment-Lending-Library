import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useItems from "../hooks/useItems";
import "./Items.css";

const initialFormData = {
  name: "",
  category: "",
  description: "",
  condition: "",
  icon: "🧰",
};

const categories = [
  "Power Tools",
  "Hand Tools",
  "Garden Equipment",
  "Cleaning Equipment",
  "Ladders",
  "Automotive Equipment",
  "Painting Equipment",
  "Other",
];

const conditions = [
  "Excellent condition",
  "Good condition",
  "Fair condition",
];

const itemIcons = [
  "🧰",
  "🔧",
  "🔩",
  "🪚",
  "🪜",
  "🌿",
  "💦",
  "🛒",
  "🎨",
  "🔨",
];

function AddItem() {
  const { addItem } = useItems();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState(initialFormData);

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
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
      newErrors.category =
        "Please select a category.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Item description is required.";
    } else if (
      formData.description.trim().length < 10
    ) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    }

    if (!formData.condition) {
      newErrors.condition =
        "Please select the item condition.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await addItem({
        name: formData.name.trim(),
        category: formData.category,
        description:
          formData.description.trim(),
        condition: formData.condition,
        icon: formData.icon,
      });

      navigate("/listings");
    } catch (error) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        submit:
          error.message || "Failed to add item.",
      }));
    }
  };

  return (
    <main className="dashboard-main">
      <section className="add-item-page">
        <header className="add-item-header">
          <div>
            <p className="page-label">
              NEW LISTING
            </p>

            <h1>Add New Item</h1>

            <p>
              Share a tool or piece of equipment with
              your community.
            </p>
          </div>

          <Link
            className="back-link"
            to="/listings"
          >
            ← Back to My Listings
          </Link>
        </header>

        <div className="add-item-layout">
          <form
            className="add-item-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-section-heading">
              <h2>Item information</h2>

              <p>
                Provide clear information to help
                neighbours understand what you are
                offering.
              </p>
            </div>

            {/* Item name */}
            <label className="item-form-field">
              <span>
                Item Name <b>*</b>
              </span>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="For example, Electric Drill"
                className={
                  errors.name ? "input-error" : ""
                }
              />

              {errors.name && (
                <small className="field-error">
                  {errors.name}
                </small>
              )}
            </label>

            <div className="form-fields-row">
              {/* Category */}
              <label className="item-form-field">
                <span>
                  Category <b>*</b>
                </span>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={
                    errors.category
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <small className="field-error">
                    {errors.category}
                  </small>
                )}
              </label>

              {/* Condition */}
              <label className="item-form-field">
                <span>
                  Condition <b>*</b>
                </span>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={
                    errors.condition
                      ? "input-error"
                      : ""
                  }
                >
                  <option value="">
                    Select the condition
                  </option>

                  {conditions.map((condition) => (
                    <option
                      key={condition}
                      value={condition}
                    >
                      {condition}
                    </option>
                  ))}
                </select>

                {errors.condition && (
                  <small className="field-error">
                    {errors.condition}
                  </small>
                )}
              </label>
            </div>

            {/* Description */}
            <label className="item-form-field">
              <span>
                Description <b>*</b>
              </span>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item, how it works and any important usage information..."
                rows="5"
                maxLength="300"
                className={
                  errors.description
                    ? "input-error"
                    : ""
                }
              />

              <div className="description-help">
                {errors.description ? (
                  <small className="field-error">
                    {errors.description}
                  </small>
                ) : (
                  <small>
                    Include any important usage or
                    safety information.
                  </small>
                )}

                <small>
                  {formData.description.length}/300
                </small>
              </div>
            </label>

            {/* Item icon */}
            <fieldset className="icon-fieldset">
              <legend>Choose an item icon</legend>

              <div className="icon-options">
                {itemIcons.map((icon) => (
                  <label
                    className={
                      formData.icon === icon
                        ? "icon-option selected"
                        : "icon-option"
                    }
                    key={icon}
                  >
                    <input
                      type="radio"
                      name="icon"
                      value={icon}
                      checked={
                        formData.icon === icon
                      }
                      onChange={handleChange}
                    />

                    <span>{icon}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* API submission error */}
            {errors.submit && (
              <div
                className="borrow-form-error"
                role="alert"
              >
                {errors.submit}
              </div>
            )}

            <div className="form-actions">
              <Link
                className="cancel-item-button"
                to="/listings"
              >
                Cancel
              </Link>

              <button
                className="submit-item-button"
                type="submit"
              >
                Add Item
              </button>
            </div>
          </form>

          {/* Listing preview */}
          <aside className="item-preview-panel">
            <p className="preview-label">
              LISTING PREVIEW
            </p>

            <article className="equipment-card preview-card">
              <div className="equipment-image">
                <span>{formData.icon}</span>

                <span className="image-status available">
                  Available
                </span>
              </div>

              <div className="equipment-content">
                <span className="equipment-category">
                  {formData.category ||
                    "Item Category"}
                </span>

                <h2>
                  {formData.name ||
                    "Your Item Name"}
                </h2>

                <p className="equipment-description">
                  {formData.description ||
                    "Your item description will appear here."}
                </p>

                <div className="equipment-details">
                  <span>
                    <b>Condition:</b>{" "}
                    {formData.condition ||
                      "Not selected"}
                  </span>

                  <span>
                    <b>Owner:</b> Wanja Juma
                  </span>

                  <span>
                    <b>Location:</b>{" "}
                    Greenview Estate
                  </span>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}


export default AddItem;