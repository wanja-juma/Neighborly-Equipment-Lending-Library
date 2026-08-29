import { useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";

import "./BrowseItems.css";
import "./Requests.css";

function Requests() {
  const [activeTab, setActiveTab] =
    useState("incoming");

  const [
    updatingRequestId,
    setUpdatingRequestId,
  ] = useState(null);

  const [actionError, setActionError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const { currentUser } = useAuth();

  const {
    borrowingRequests,
    requestsLoading,
    requestsError,
    updateRequestStatus,
    cancelBorrowingRequest,
  } = useRequests();

  const currentUserId = String(
    currentUser?.id || ""
  );

  const incomingRequests =
    borrowingRequests.filter((request) => {
      const ownerId =
        request.ownerId ??
        request.owner_id ??
        request.item?.ownerId ??
        request.item?.owner_id;

      const requestType = String(
        request.requestType ??
        request.direction ??
        request.type ??
        ""
      ).toLowerCase();

      return (
        String(ownerId) === currentUserId ||
        requestType === "incoming"
      );
    });

  const outgoingRequests =
    borrowingRequests.filter((request) => {
      const borrowerId =
        request.borrowerId ??
        request.borrower_id ??
        request.userId ??
        request.user_id;

      const requestType = String(
        request.requestType ??
        request.direction ??
        request.type ??
        ""
      ).toLowerCase();

      return (
        String(borrowerId) ===
          currentUserId ||
        requestType === "outgoing"
      );
    });

  const displayedRequests =
    activeTab === "incoming"
      ? incomingRequests
      : outgoingRequests;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActionError("");
    setNotice("");
  };

  const handleRequestAction = async (
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

    try {
      const result =
        await updateRequestStatus(
          requestId,
          newStatus
        );

      if (result?.success === false) {
        setActionError(
          result.message ||
            "The request could not be updated."
        );

        return;
      }

      if (newStatus === "Approved") {
        setNotice(
          "Request approved. The borrower can now complete the payment."
        );
      } else {
        setNotice(
          result?.message ||
            "Request declined successfully."
        );
      }
    } catch (error) {
      setActionError(
        error.message ||
          `Unable to ${newStatus.toLowerCase()} the request.`
      );
    } finally {
      setUpdatingRequestId(null);
    }
  };

  const handleCancelRequest = async (
    requestId
  ) => {
    setNotice("");
    setActionError("");
    setUpdatingRequestId(requestId);

    try {
      const result =
        await cancelBorrowingRequest(
          requestId
        );

      if (result?.success === false) {
        setActionError(
          result.message ||
            "Unable to cancel the request."
        );

        return;
      }

      setNotice(
        result?.message ||
          "Request cancelled successfully."
      );
    } catch (error) {
      setActionError(
        error.message ||
          "Unable to cancel the request."
      );
    } finally {
      setUpdatingRequestId(null);
    }
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
    <main className="requests-page">
      <div className="requests-heading">
        <div>
          <h1>Borrowing Requests</h1>

          <p>
            Manage requests for borrowing and
            lending equipment.
          </p>
        </div>
      </div>

      <div
  className="requests-tab-switcher"
  role="tablist"
  aria-label="Borrowing request categories"
>
  <button
    type="button"
    role="tab"
    className={`requests-tab-button ${
      activeTab === "incoming"
        ? "active"
        : ""
    }`}
    onClick={() =>
      handleTabChange("incoming")
    }
    aria-selected={
      activeTab === "incoming"
    }
    aria-controls="requests-content"
  >
    <span>Incoming</span>

    <span className="tab-count">
      {incomingRequests.length}
    </span>
  </button>

  <button
    type="button"
    role="tab"
    className={`requests-tab-button ${
      activeTab === "outgoing"
        ? "active"
        : ""
    }`}
    onClick={() =>
      handleTabChange("outgoing")
    }
    aria-selected={
      activeTab === "outgoing"
    }
    aria-controls="requests-content"
  >
    <span>Outgoing</span>

    <span className="tab-count">
      {outgoingRequests.length}
    </span>
  </button>
</div>

      <section className="requests-panel">
        <div className="requests-panel-heading">
          <div>
            <h2>
              {activeTab === "incoming"
                ? "Incoming Requests"
                : "Outgoing Requests"}
            </h2>

            <p>
              {activeTab === "incoming"
                ? "Requests from neighbours who want to borrow your items."
                : "Requests you have sent to borrow your neighbours' items."}
            </p>
          </div>

          <span className="request-count">
            {displayedRequests.length}
          </span>
        </div>

        {notice && (
          <div
            className="request-action-notice success"
            role="status"
          >
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div
            className="request-action-error"
            role="alert"
          >
            <span>{actionError}</span>

            <button
              type="button"
              onClick={() =>
                setActionError("")
              }
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {displayedRequests.length === 0 ? (
          <div className="requests-state">
            <span className="empty-icon">
              ✓
            </span>

            <h3>
              No {activeTab} requests
            </h3>

            <p>
              {activeTab === "incoming"
                ? "You have no incoming borrowing requests."
                : "You have not sent any borrowing requests."}
            </p>
          </div>
        ) : (
          <div className="requests-list">
            {displayedRequests.map(
              (request) => {
                const status = String(
                  request.status || "Pending"
                );

                const normalizedStatus =
                  status.toLowerCase();

                const paymentStatus = String(
                  request.paymentStatus ??
                    request.payment_status ??
                    "unpaid"
                ).toLowerCase();

                const isPending =
                  normalizedStatus ===
                  "pending";

                const isUpdating =
                  String(
                    updatingRequestId
                  ) === String(request.id);

                const canPay =
                  activeTab === "outgoing" &&
                  normalizedStatus ===
                    "approved" &&
                  paymentStatus !== "paid";

                const personName =
                  activeTab === "incoming"
                    ? request.borrowerName ||
                      request.borrower?.name ||
                      "Neighbour"
                    : request.ownerName ||
                      request.owner?.name ||
                      "Neighbour";

                const itemName =
                  request.itemName ||
                  request.item_name ||
                  request.item?.name ||
                  (typeof request.item ===
                  "string"
                    ? request.item
                    : "Equipment");

                const initials = String(
                  personName
                )
                  .split(" ")
                  .filter(Boolean)
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const startDate =
                  request.startDate ||
                  request.start_date ||
                  "Start date unavailable";

                const endDate =
                  request.endDate ||
                  request.end_date ||
                  "End date unavailable";

                const statusClass =
                  normalizedStatus.replaceAll(
                    " ",
                    "-"
                  );

                return (
                  <article
                    className="request-list-card"
                    key={request.id}
                  >
                    <span className="request-avatar">
                      {initials}
                    </span>

                    <div className="request-details">
                      <strong>
                        {personName}
                      </strong>

                      <p>
                        {activeTab ===
                        "incoming"
                          ? "Wants to borrow "
                          : "Request to borrow "}

                        <b>{itemName}</b>
                      </p>

                      <small>
                        {startDate} – {endDate}
                      </small>

                      {request.message && (
                        <small>
                          <strong>
                            Message:
                          </strong>{" "}
                          {request.message}
                        </small>
                      )}
                    </div>

                    <span
                      className={`request-status ${statusClass}`}
                    >
                      {status}
                    </span>

                    {activeTab ===
                      "incoming" &&
                      isPending && (
                        <div className="request-actions">
                          <button
                            type="button"
                            className="decline-request-button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleRequestAction(
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
                            type="button"
                            className="approve-request-button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleRequestAction(
                                request.id,
                                "Approved"
                              )
                            }
                          >
                            {isUpdating
                              ? "Updating..."
                              : "Approve"}
                          </button>
                        </div>
                      )}

                    {activeTab ===
                      "outgoing" &&
                      isPending && (
                        <div className="request-actions">
                          <button
                            type="button"
                            className="cancel-request-button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleCancelRequest(
                                request.id
                              )
                            }
                          >
                            {isUpdating
                              ? "Cancelling..."
                              : "Cancel Request"}
                          </button>
                        </div>
                      )}

                    {canPay && (
                      <div className="request-payment-action">
                        <Link
                          className="pay-request-button"
                          to={`/payments/${request.id}`}
                        >
                          Pay Now
                        </Link>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Requests;