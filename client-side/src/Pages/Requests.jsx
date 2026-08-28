import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";
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

  const { currentUser } = useAuth();

  const {
    borrowingRequests,
    requestsLoading,
    requestsError,
    updateRequestStatus,
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

      const requestType = (
        request.requestType ||
        request.direction ||
        request.type ||
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

      const requestType = (
        request.requestType ||
        request.direction ||
        request.type ||
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

  const handleRequestAction = async (
    requestId,
    newStatus
  ) => {
    setActionError("");
    setUpdatingRequestId(requestId);

    try {
      await updateRequestStatus(
        requestId,
        newStatus
      );
    } catch (error) {
      setActionError(
        error.message ||
          `Unable to ${newStatus.toLowerCase()} the request.`
      );
    } finally {
      setUpdatingRequestId(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActionError("");
  };

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

      <section
        className="request-tabs"
        aria-label="Request categories"
      >
        <button
          type="button"
          className={`request-tab-card ${
            activeTab === "incoming"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleTabChange("incoming")
          }
          aria-pressed={
            activeTab === "incoming"
          }
        >
          <span className="request-tab-icon">
            ↓
          </span>

          <div>
            <strong>Incoming Requests</strong>

            <span>
              {incomingRequests.length}{" "}
              {incomingRequests.length === 1
                ? "request"
                : "requests"}
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`request-tab-card ${
            activeTab === "outgoing"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleTabChange("outgoing")
          }
          aria-pressed={
            activeTab === "outgoing"
          }
        >
          <span className="request-tab-icon">
            ↑
          </span>

          <div>
            <strong>Outgoing Requests</strong>

            <span>
              {outgoingRequests.length}{" "}
              {outgoingRequests.length === 1
                ? "request"
                : "requests"}
            </span>
          </div>
        </button>
      </section>

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
                : "Requests you have sent to borrow your neighbours’ items."}
            </p>
          </div>

          <span className="request-count">
            {displayedRequests.length}
          </span>
        </div>

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

        {requestsLoading ? (
          <div className="requests-state">
            <p>Loading requests...</p>
          </div>
        ) : requestsError ? (
          <div className="requests-state error">
            <p>{requestsError}</p>
          </div>
        ) : displayedRequests.length === 0 ? (
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
                const status =
                  request.status || "Pending";

                const isPending =
                  status.toLowerCase() ===
                  "pending";

                const isUpdating =
                  String(
                    updatingRequestId
                  ) === String(request.id);

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
                  request.item?.name ||
                  request.item ||
                  "Equipment";

                const initials = personName
                  .split(" ")
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

                const statusClass = status
                  .toLowerCase()
                  .replaceAll(" ", "-");

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
                        {activeTab === "incoming"
                          ? "Wants to borrow "
                          : "Request to borrow "}

                        <b>{itemName}</b>
                      </p>

                      <small>
                        {startDate} – {endDate}
                      </small>
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