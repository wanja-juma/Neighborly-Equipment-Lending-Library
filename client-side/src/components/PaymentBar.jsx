import { useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import tools from "../data/tools";
import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";
import "./PaymentBar.css";

const DAY_IN_MILLISECONDS =
  1000 * 60 * 60 * 24;

function PaymentBar() {
  const { requestId } = useParams();
  const { currentUser } = useAuth();

  const {
    borrowingRequests,
    requestsLoading,
    requestsError,
  } = useRequests();

  const [method, setMethod] =
    useState("mpesa");

  const [submitted, setSubmitted] =
    useState(false);

  const request = borrowingRequests.find(
    (currentRequest) =>
      String(currentRequest.id) ===
      String(requestId)
  );

  if (requestsLoading) {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <p>Loading payment details...</p>
        </section>
      </main>
    );
  }

  if (requestsError) {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <div
            className="payment-message error"
            role="alert"
          >
            <p>{requestsError}</p>

            <Link to="/requests">
              Return to Requests
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <div className="payment-message">
            <h2>Request not found</h2>

            <p>
              The borrowing request could not
              be found.
            </p>

            <Link to="/requests">
              Return to Requests
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const borrowerId =
    request.borrowerId ??
    request.borrower_id ??
    request.userId ??
    request.user_id;

  const requestDirection = String(
    request.requestType ??
    request.direction ??
    request.type ??
    ""
  ).toLowerCase();

  const belongsToCurrentUser =
    borrowerId !== undefined &&
    borrowerId !== null
      ? String(borrowerId) ===
        String(currentUser?.id)
      : requestDirection === "outgoing";

  if (!belongsToCurrentUser) {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <div className="payment-message error">
            <h2>Payment unavailable</h2>

            <p>
              You are not authorized to pay for
              this borrowing request.
            </p>

            <Link to="/requests">
              Return to Requests
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const requestStatus = String(
    request.status || ""
  ).toLowerCase();

  if (requestStatus !== "approved") {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <div className="payment-message">
            <h2>Payment not available</h2>

            <p>
              {requestStatus === "pending"
                ? "This request is still waiting for approval."
                : "Only approved borrowing requests can be paid."}
            </p>

            <Link to="/requests">
              Return to Requests
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const paymentStatus = String(
    request.paymentStatus ??
    request.payment_status ??
    "unpaid"
  ).toLowerCase();

  if (paymentStatus === "paid") {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <div className="payment-message">
            <h2>Payment already completed</h2>

            <p>
              This borrowing request has already
              been paid.
            </p>

            <Link to="/loans">
              View My Loans
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const itemId =
    request.itemId ??
    request.item_id ??
    request.item?.id;

  const tool = tools.find(
    (currentTool) =>
      String(currentTool.id) ===
      String(itemId)
  );

  const itemName =
    request.itemName ??
    request.item_name ??
    request.item?.name ??
    tool?.name ??
    "Equipment";

  const dailyRate = Number(
    request.dailyRate ??
    request.daily_rate ??
    request.item?.dailyRate ??
    request.item?.daily_rate ??
    tool?.dailyRate ??
    0
  );

  const startDateValue =
    request.startDate ??
    request.start_date;

  const endDateValue =
    request.endDate ??
    request.end_date ??
    request.dueDate ??
    request.due_date;

  const startDate = startDateValue
    ? new Date(startDateValue)
    : null;

  const endDate = endDateValue
    ? new Date(endDateValue)
    : null;

  const datesAreValid =
    startDate &&
    endDate &&
    !Number.isNaN(startDate.getTime()) &&
    !Number.isNaN(endDate.getTime());

  const duration = datesAreValid
    ? Math.max(
        1,
        Math.ceil(
          (endDate.getTime() -
            startDate.getTime()) /
            DAY_IN_MILLISECONDS
        ) + 1
      )
    : 1;

  const total = duration * dailyRate;

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
     * Later, call POST /api/payments here.
     * The backend must verify that the
     * request is approved and belongs to
     * the logged-in borrower.
     */
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="dashboard-main">
        <section className="payments-page">
          <div
            className="payment-success"
            role="status"
          >
            <span>✓</span>

            <h1>Payment Confirmed</h1>

            <p>
              Your payment of{" "}
              <strong>
                Ksh {total.toLocaleString()}
              </strong>{" "}
              for <strong>{itemName}</strong>{" "}
              has been recorded.
            </p>

            <Link to="/loans">
              View My Loans
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <section className="payments-page">
        <header className="payments-header">
          <p className="page-label">
            APPROVED REQUEST
          </p>

          <h1>Complete Payment</h1>

          <p>
            Your borrowing request was approved.
            Confirm your payment method below.
          </p>
        </header>

        <form
          className="payment-bar"
          onSubmit={handleSubmit}
        >
          <div className="payment-item-summary">
            <h2>{itemName}</h2>

            <span className="approved-badge">
              Approved
            </span>
          </div>

          <div className="payment-details">
            <div>
              <span>Duration</span>

              <strong>
                {duration}{" "}
                {duration === 1
                  ? "day"
                  : "days"}
              </strong>
            </div>

            <div>
              <span>Daily rate</span>

              <strong>
                Ksh{" "}
                {dailyRate.toLocaleString()}
              </strong>
            </div>
          </div>

          <label>
            <span>Payment Method</span>

            <select
              value={method}
              onChange={(event) =>
                setMethod(event.target.value)
              }
            >
              <option value="mpesa">
                M-Pesa
              </option>

              <option value="card">
                Card
              </option>

              <option value="cash">
                Cash on Pickup
              </option>
            </select>
          </label>

          <div className="payment-total">
            <span>Total</span>

            <strong>
              Ksh {total.toLocaleString()}
            </strong>
          </div>

          {dailyRate <= 0 && (
            <p
              className="payment-rate-error"
              role="alert"
            >
              The item does not have a valid
              daily rate. Payment cannot be
              completed.
            </p>
          )}

          <div className="payment-actions">
            <Link to="/requests">
              Cancel
            </Link>

            <button
              type="submit"
              disabled={dailyRate <= 0}
            >
              Pay Now
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PaymentBar;