import {
  useState,
} from "react";

import useRequests from "../hooks/useRequests";

export default function BorrowRequestModal({
  item,
  onClose,
  onSuccess,
}) {
  const {
    addBorrowingRequest,
    refreshRequests,
  } = useRequests();

  const [borrowDates, setBorrowDates] =
    useState({
      startDate: "",
      endDate: "",
    });

  const [formError, setFormError] =
    useState("");

  const [
    submittingRequest,
    setSubmittingRequest,
  ] = useState(false);


  if (!item) {
    return null;
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");


    /*
     * Validate dates.
     */
    if (
      !borrowDates.startDate ||
      !borrowDates.endDate
    ) {
      setFormError(
        "Please select both dates."
      );

      return;
    }


    if (
      new Date(borrowDates.endDate) <
      new Date(borrowDates.startDate)
    ) {
      setFormError(
        "End date cannot be before start date."
      );

      return;
    }


    /*
     * Validate item ID.
     */
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
      setSubmittingRequest(true);
      setFormError("");


      /*
       * Create the borrowing request.
       *
       * IMPORTANT:
       * The Flask API expects
       * equipment_id, not item_id.
       */
      const result =
        await addBorrowingRequest({
          equipment_id:
            equipmentId,

          start_date:
            borrowDates.startDate,

          end_date:
            borrowDates.endDate,
        });


      /*
       * Refresh request state so the
       * newly submitted request appears
       * in the Requests page.
       */
      if (
        typeof refreshRequests ===
        "function"
      ) {
        await refreshRequests();
      }


      /*
       * Tell Cart.jsx that the
       * request succeeded.
       *
       * Cart.jsx can then remove
       * this item from the cart.
       */
      onSuccess?.(result);

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
      setSubmittingRequest(false);
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
            type="button"
            onClick={onClose}
            className="close-modal-button"
            aria-label="Close borrowing form"
            disabled={
              submittingRequest
            }
          >
            ×
          </button>
        </header>


        <div className="borrow-item-summary">
          <div>
            <strong>
              {item.name}
            </strong>

            {item.condition && (
              <small>
                Condition:{" "}
                {item.condition}
              </small>
            )}
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
                value={
                  borrowDates.startDate
                }
                onChange={(event) =>
                  setBorrowDates(
                    (current) => ({
                      ...current,

                      startDate:
                        event.target.value,
                    })
                  )
                }
                disabled={
                  submittingRequest
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
                value={
                  borrowDates.endDate
                }
                min={
                  borrowDates.startDate ||
                  undefined
                }
                onChange={(event) =>
                  setBorrowDates(
                    (current) => ({
                      ...current,

                      endDate:
                        event.target.value,
                    })
                  )
                }
                disabled={
                  submittingRequest
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
                submittingRequest
              }
            >
              Cancel
            </button>


            <button
              className="submit-request-button"
              type="submit"
              disabled={
                submittingRequest
              }
            >
              {submittingRequest
                ? "Submitting..."
                : "Submit Request"}
            </button>

          </div>

        </form>
      </section>
    </div>
  );
}