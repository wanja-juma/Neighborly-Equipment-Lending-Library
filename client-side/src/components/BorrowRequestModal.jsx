import {
  useState,
} from "react";

import useRequests from "../hooks/useRequests";

import "./BorrowRequestModal.css";


const getLocalDate = () => {
  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const getItemOwnerName = (
  item
) => {
  if (
    item?.owner &&
    typeof item.owner ===
      "object"
  ) {
    const firstName =
      item.owner.first_name ||
      item.owner.firstName ||
      "";

    const lastName =
      item.owner.last_name ||
      item.owner.lastName ||
      "";

    return (
      item.owner.name ||
      [
        firstName,
        lastName,
      ]
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


const getItemAvailability = (
  item
) => {
  return (
    item?.availability ||
    item?.status ||
    "Available"
  );
};


function BorrowRequestModal({
  item,
  onClose,
  onSuccess,
}) {
  const {
    addBorrowingRequest,
    refreshRequests,
  } = useRequests();


  const [
    borrowDates,
    setBorrowDates,
  ] = useState({
    startDate: "",
    endDate: "",
  });

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const minimumDate =
    getLocalDate();


  if (!item) {
    return null;
  }


  const handleDateChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setBorrowDates(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setFormError("");
  };


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setFormError("");


      const availability =
        getItemAvailability(
          item
        ).toLowerCase();

      if (
        availability !==
        "available"
      ) {
        setFormError(
          "This item is no longer available to borrow."
        );

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


      if (
        borrowDates.startDate <
        minimumDate
      ) {
        setFormError(
          "The borrowing date cannot be in the past."
        );

        return;
      }


      if (
        borrowDates.endDate <
        borrowDates.startDate
      ) {
        setFormError(
          "The return date cannot be before the borrowing date."
        );

        return;
      }


      const equipmentId =
        Number(item.id);

      if (
        !Number.isInteger(
          equipmentId
        ) ||
        equipmentId <= 0
      ) {
        setFormError(
          "This item has an invalid ID."
        );

        return;
      }


      try {
        setSubmitting(true);
        setFormError("");


        const result =
          await addBorrowingRequest({
            equipment_id:
              equipmentId,

            start_date:
              borrowDates.startDate,

            end_date:
              borrowDates.endDate,
          });


        if (
          result?.success ===
          false
        ) {
          const detailText =
            result.details
              ? Object.entries(
                  result.details
                )
                  .map(
                    ([
                      field,
                      messages,
                    ]) =>
                      `${field}: ${[]
                        .concat(
                          messages
                        )
                        .join(", ")}`
                  )
                  .join(" | ")
              : "";

          setFormError(
            [
              result.message,
              detailText,
            ]
              .filter(Boolean)
              .join(" — ") ||
              "Unable to submit the borrowing request."
          );

          return;
        }


        if (
          typeof refreshRequests ===
          "function"
        ) {
          await refreshRequests();
        }


        onSuccess?.(
          result?.message ||
            "Borrowing request submitted successfully."
        );
      } catch (error) {
        console.error(
          "Borrowing request failed:",
          error
        );

        setFormError(
          error?.message ||
            "Unable to submit the borrowing request."
        );
      } finally {
        setSubmitting(false);
      }
    };


  return (
    <div
      className="borrow-modal-overlay"
      role="presentation"
    >
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
              Request {item.name}
            </h2>

            <p>
              Select the dates you
              would like to borrow
              this item.
            </p>
          </div>


          <button
            className="close-modal-button"
            type="button"
            onClick={onClose}
            aria-label="Close borrowing form"
            disabled={submitting}
          >
            ×
          </button>
        </header>


        <div className="borrow-item-summary">
          <span
            className="borrow-summary-icon"
            aria-hidden="true"
          >
            {item.icon || "🧰"}
          </span>

          <div>
            <strong>
              {item.name}
            </strong>

            <span>
              Owned by{" "}
              {getItemOwnerName(
                item
              )}
            </span>

            <small>
              {item.condition ||
                "Condition not specified"}
            </small>
          </div>
        </div>


        <form
          className="borrow-date-form"
          onSubmit={handleSubmit}
        >
          <div className="borrow-date-fields">
            <label className="item-form-field">
              <span>
                Borrowing Date{" "}
                <b>*</b>
              </span>

              <input
                type="date"
                name="startDate"
                value={
                  borrowDates.startDate
                }
                min={
                  minimumDate
                }
                onChange={
                  handleDateChange
                }
                disabled={
                  submitting
                }
                required
              />
            </label>


            <label className="item-form-field">
              <span>
                Return Date{" "}
                <b>*</b>
              </span>

              <input
                type="date"
                name="endDate"
                value={
                  borrowDates.endDate
                }
                min={
                  borrowDates.startDate ||
                  minimumDate
                }
                onChange={
                  handleDateChange
                }
                disabled={
                  submitting
                }
                required
              />
            </label>
          </div>


          {formError && (
            <div
              className="borrow-form-error"
              role="alert"
            >
              {formError}
            </div>
          )}


          <div className="borrow-request-information">
            <strong>
              Before submitting
            </strong>

            <ul>
              <li>
                Wait for the item
                owner to approve
                your request.
              </li>

              <li>
                Collect the item
                only after the
                request is approved.
              </li>

              <li>
                Return the item by
                the selected return
                date.
              </li>
            </ul>
          </div>


          <div className="borrow-modal-actions">
            <button
              className="cancel-request-button"
              type="button"
              onClick={onClose}
              disabled={
                submitting
              }
            >
              Cancel
            </button>


            <button
              className="submit-request-button"
              type="submit"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Request"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}


export default BorrowRequestModal;