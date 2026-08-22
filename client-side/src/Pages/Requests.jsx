import { useState } from "react";
import useRequests from "../hooks/useRequests";
import useLoans from "../hooks/useLoans";
import "./BrowseItems.css";

const CURRENT_USER_ID = "1";

function Requests() {
  const {
    borrowingRequests,
    requestsLoading,
    requestsError,
    updateRequestStatus,
    cancelBorrowingRequest,
  } = useRequests();

  const { addLoan } = useLoans();

  const [notice, setNotice] = useState("");
  const [actionError, setActionError] =
    useState("");
  const [updatingRequestId, setUpdatingRequestId] =
    useState(null);

  const incomingRequests =
    borrowingRequests.filter(
      (request) =>
        String(request.ownerId) ===
        CURRENT_USER_ID
    );

  const outgoingRequests =
    borrowingRequests.filter(
      (request) =>
        String(request.borrowerId) ===
        CURRENT_USER_ID
    );

  const handleStatusChange = async (
  requestId,
  newStatus
) => {
  setNotice("");
  setActionError("");
  setUpdatingRequestId(requestId);

  const selectedRequest =
    borrowingRequests.find(
      (request) =>
        String(request.id) ===
        String(requestId)
    );

  if (!selectedRequest) {
    setActionError(
      "The borrowing request could not be found."
    );
    setUpdatingRequestId(null);
    return;
  }

  const requestResult =
    await updateRequestStatus(
      requestId,
      newStatus
    );

  if (!requestResult.success) {
    setActionError(requestResult.message);
    setUpdatingRequestId(null);
    return;
  }

  if (newStatus === "Approved") {
    const loanResult = await addLoan({
      requestId: selectedRequest.id,
      itemId: selectedRequest.itemId,

      item:
        selectedRequest.item ||
        selectedRequest.itemName ||
        "Equipment",

      icon:
        selectedRequest.itemIcon ||
        selectedRequest.icon ||
        "🧰",

      ownerId: selectedRequest.ownerId,
      borrowerId: selectedRequest.borrowerId,

      ownerName:
        selectedRequest.ownerName ||
        selectedRequest.owner ||
        "Item owner",

      borrowerName:
        selectedRequest.borrowerName ||
        selectedRequest.borrower ||
        "Neighbour",

      person:
        selectedRequest.borrowerName ||
        selectedRequest.borrower ||
        "Neighbour",

      loanType:
        String(selectedRequest.ownerId) ===
        CURRENT_USER_ID
          ? "lent"
          : "borrowed",

      startDate: selectedRequest.startDate,
      dueDate: selectedRequest.endDate,
      status: "On Track",
    });

    if (!loanResult.success) {
      setActionError(
        `The request was approved, but the loan could not be created: ${loanResult.message}`
      );

      setUpdatingRequestId(null);
      return;
    }

    setNotice(
      "Request approved and active loan created."
    );
  } else {
    setNotice(requestResult.message);
  }

  setUpdatingRequestId(null);
};

  const handleCancelRequest = async (
    requestId
  ) => {
    setNotice("");
    setActionError("");
    setUpdatingRequestId(requestId);

    const result =
      await cancelBorrowingRequest(requestId);

    if (result.success) {
      setNotice(result.message);
    } else {
      setActionError(result.message);
    }

    setUpdatingRequestId(null);
  };

  const renderRequestCard = (
    request,
    requestType
  ) => {
    const isPending =
      request.status?.toLowerCase() ===
      "pending";

    const isUpdating =
      updatingRequestId === request.id;

    const itemName =
      request.itemName ||
      request.item ||
      "Item";

    const borrowerName =
      request.borrowerName ||
      request.borrower ||
      "Neighbour";

    const ownerName =
      request.ownerName ||
      request.owner ||
      "Item owner";

    return (
      <article
        className="request-page-card"
        key={request.id}
      >
        <div className="request-card-top">
          <div className="request-item-details">
            <span className="request-item-icon">
              {request.itemIcon ||
                request.icon ||
                "🧰"}
            </span>

            <div>
              <span className="request-type-label">
                {requestType === "incoming"
                  ? "INCOMING REQUEST"
                  : "YOUR REQUEST"}
              </span>

              <h3>{itemName}</h3>
            </div>
          </div>

          <span
            className={`request-status-badge ${
              request.status?.toLowerCase() ||
              "pending"
            }`}
          >
            {request.status || "Pending"}
          </span>
        </div>

        <div className="request-page-information">
          <p>
            <strong>
              {requestType === "incoming"
                ? "Borrower:"
                : "Owner:"}
            </strong>{" "}
            {requestType === "incoming"
              ? borrowerName
              : ownerName}
          </p>

          <p>
            <strong>Date range:</strong>{" "}
            {request.startDate || "Not provided"} –{" "}
            {request.endDate || "Not provided"}
          </p>

          {request.message && (
            <p>
              <strong>Message:</strong>{" "}
              {request.message}
            </p>
          )}
        </div>

        {requestType === "incoming" &&
          isPending && (
            <div className="request-page-actions">
              <button
                className="decline-button"
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  handleStatusChange(
                    request.id,
                    "Declined"
                  )
                }
              >
                {isUpdating
                  ? "Updating..."
                  : "Decline"}
              </button>

              <button
  className="approve-button"
  type="button"
  disabled={isUpdating}
  onClick={() =>
    handleStatusChange(
      request.id,
      "Approved"
    )
  }
>
  {isUpdating ? "Updating..." : "Approve"}
</button>
            </div>
          )}

        {requestType === "outgoing" &&
          isPending && (
            <div className="request-page-actions">
              <button
                className="cancel-request-button"
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  handleCancelRequest(request.id)
                }
              >
                {isUpdating
                  ? "Cancelling..."
                  : "Cancel Request"}
              </button>
            </div>
          )}
      </article>
    );
  };

  if (requestsLoading) {
    return (
      <main className="dashboard-main">
        <section className="page-content">
          <div className="requests-page-message">
            <p>
              Loading borrowing requests...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (requestsError) {
    return (
      <main className="dashboard-main">
        <section className="page-content">
          <div className="requests-page-message error">
            <p>{requestsError}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <section className="page-content requests-page">
        <header className="requests-page-header">
          <div>
            <p className="page-label">
              BORROWING MANAGEMENT
            </p>

            <h1>Borrowing Requests</h1>

            <p>
              Review incoming requests and track
              requests you have submitted.
            </p>
          </div>

          <div className="requests-summary">
            <div>
              <strong>
                {incomingRequests.length}
              </strong>
              <span>Incoming</span>
            </div>

            <div>
              <strong>
                {outgoingRequests.length}
              </strong>
              <span>Outgoing</span>
            </div>
          </div>
        </header>

        {notice && (
          <p
            className="request-action-notice success"
            role="status"
          >
            {notice}
          </p>
        )}

        {actionError && (
          <p
            className="request-action-notice error"
            role="alert"
          >
            {actionError}
          </p>
        )}

        <section className="request-page-section">
          <div className="request-section-heading">
            <div>
              <h2>Incoming Requests</h2>

              <p>
                Requests from neighbours who want
                to borrow your items.
              </p>
            </div>

            <span className="request-count">
              {incomingRequests.length}
            </span>
          </div>

          <div className="request-page-grid">
            {incomingRequests.length > 0 ? (
              incomingRequests.map((request) =>
                renderRequestCard(
                  request,
                  "incoming"
                )
              )
            ) : (
              <div className="request-page-empty">
                <span>✓</span>

                <div>
                  <strong>
                    No incoming requests
                  </strong>

                  <p>
                    New borrowing requests will
                    appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="request-page-section">
          <div className="request-section-heading">
            <div>
              <h2>My Requests</h2>

              <p>
                Track the borrowing requests you
                have submitted.
              </p>
            </div>

            <span className="request-count">
              {outgoingRequests.length}
            </span>
          </div>

          <div className="request-page-grid">
            {outgoingRequests.length > 0 ? (
              outgoingRequests.map((request) =>
                renderRequestCard(
                  request,
                  "outgoing"
                )
              )
            ) : (
              <div className="request-page-empty">
                <span>📭</span>

                <div>
                  <strong>
                    You have no requests
                  </strong>

                  <p>
                    Browse available items to submit
                    a borrowing request.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Requests;