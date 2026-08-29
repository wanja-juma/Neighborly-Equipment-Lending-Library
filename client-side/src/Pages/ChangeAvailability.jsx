
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./ChangeAvailability.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

const availabilityOptions = [
  {
    value: "Available",
    description:
      "The equipment can be requested by neighbours.",
  },
  {
    value: "Unavailable",
    description:
      "The equipment is temporarily unavailable.",
  },
  {
    value: "On Loan",
    description:
      "The equipment is currently borrowed.",
  },
];

function ChangeAvailability() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [availability, setAvailability] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem(
        "access_token"
      );

      try {
        const response = await fetch(
          `${API_URL}/items/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load the listing."
          );
        }

        const loadedItem =
          data.item || data;

        setItem(loadedItem);

        setAvailability(
          loadedItem.availability ||
            "Available"
        );
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem(
      "access_token"
    );

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update availability."
        );
      }

      navigate("/listings", {
        replace: true,
        state: {
          message:
            "Availability updated successfully.",
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="availability-page">
        <p>Loading listing...</p>
      </main>
    );
  }

  if (error && !item) {
    return (
      <main className="availability-page">
        <div className="availability-error">
          <p>{error}</p>

          <Link to="/listings">
            Back to My Listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="availability-page">
      <div className="availability-card">
        <div className="availability-heading">
          <Link
            className="back-link"
            to="/listings"
          >
            ← Back to My Listings
          </Link>

          <h1>Change Availability</h1>

          <p>
            Update the availability of{" "}
            <strong>
              {item?.name || "this equipment"}
            </strong>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset className="availability-options">
            <legend>
              Select availability
            </legend>

            {availabilityOptions.map(
              (option) => (
                <label
                  className={`availability-option ${
                    availability ===
                    option.value
                      ? "selected"
                      : ""
                  }`}
                  key={option.value}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={
                      availability ===
                      option.value
                    }
                    onChange={(event) =>
                      setAvailability(
                        event.target.value
                      )
                    }
                  />

                  <span>
                    <strong>
                      {option.value}
                    </strong>

                    <small>
                      {option.description}
                    </small>
                  </span>
                </label>
              )
            )}
          </fieldset>

          {error && (
            <p
              className="availability-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="availability-actions">
            <Link
              className="cancel-button"
              to="/listings"
            >
              Cancel
            </Link>

            <button
              className="save-availability-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Availability"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ChangeAvailability;