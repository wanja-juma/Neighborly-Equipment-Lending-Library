import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import useItems from "../hooks/useItems";

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
  const { itemId } =
    useParams();

  const navigate =
    useNavigate();


  const {
  items,
  updateItem,
  refreshItems,
} = useItems();


  const [
    item,
    setItem,
  ] = useState(null);


  const [
    availability,
    setAvailability,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setError("");


      /*
       * First try to get the item
       * from ItemsProvider.
       */
      const existingItem =
        Array.isArray(items)
          ? items.find(
              (currentItem) =>
                String(
                  currentItem.id
                ) ===
                String(itemId)
            )
          : null;


      if (existingItem) {
        setItem(
          existingItem
        );

        setAvailability(
          existingItem.availability ||
            existingItem.status ||
            "Available"
        );

        setLoading(false);

        return;
      }


      /*
       * If the item is not already
       * in ItemsProvider, fetch it
       * from Flask.
       */
      const token =
        localStorage.getItem(
          "neighborlyToken"
        ) ||
        localStorage.getItem(
          "access_token"
        );


      try {
        const response =
          await fetch(
            `${API_URL}/items/${itemId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load the listing."
          );
        }


        const loadedItem =
          data.item ||
          data;


        setItem(
          loadedItem
        );


        setAvailability(
          loadedItem.availability ||
            loadedItem.status ||
            "Available"
        );

      } catch (
        requestError
      ) {
        setError(
          requestError.message
        );
      } finally {
        setLoading(false);
      }
    };


    loadItem();

  }, [
    itemId,
    items,
  ]);


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setSaving(true);
      setError("");


      try {

        /*
         * updateItem updates Flask
         * AND the ItemsProvider state.
         */
        const result =
          await updateItem(
            itemId,
            {
              availability,
            }
          );


        if (
          result &&
          result.success === false
        ) {
          throw new Error(
            result.message ||
              "Unable to update availability."
          );
        }
        await refreshItems();


        /*
         * Keep the local item
         * in sync as well.
         */
        setItem(
          (currentItem) => ({
            ...currentItem,
            availability,
          })
        );


        navigate(
          "/listings",
          {
            replace: true,

            state: {
              message:
                "Availability updated successfully.",
            },
          }
        );

      } catch (
        requestError
      ) {
        setError(
          requestError.message ||
            "Unable to update availability."
        );

      } finally {
        setSaving(false);
      }
    };


  if (loading) {
    return (
      <main className="availability-page">

        <p>
          Loading listing...
        </p>

      </main>
    );
  }


  if (
    error &&
    !item
  ) {
    return (
      <main className="availability-page">

        <div className="availability-error">

          <p>
            {error}
          </p>

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


          <h1>
            Change Availability
          </h1>


          <p>
            Update the availability of{" "}

            <strong>
              {item?.name ||
                "this equipment"}
            </strong>
            .
          </p>

        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >

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
                  key={
                    option.value
                  }
                >

                  <input
                    type="radio"
                    name="availability"
                    value={
                      option.value
                    }
                    checked={
                      availability ===
                      option.value
                    }
                    onChange={(
                      event
                    ) =>
                      setAvailability(
                        event.target
                          .value
                      )
                    }
                  />


                  <span>

                    <strong>
                      {option.value}
                    </strong>

                    <small>
                      {
                        option.description
                      }
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
              disabled={
                saving ||
                !availability
              }
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