import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";
import "./Requests.css";

function Requests() {
  const [activeTab, setActiveTab] =
    useState("incoming");

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
        String(borrowerId) === currentUserId ||
        requestType === "outgoing"
      );
    });

  const displayedRequests =
    activeTab === "incoming"
      ? incomingRequests
      : outgoingRequests;

  const handleRequestStatus = async (
    requestId,
    status
  ) => {
    await updateRequestStatus(
      requestId,
      status
    );
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
            setActiveTab("incoming")
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
            setActiveTab("outgoing")
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

                const status =
                  request.status || "Pending";

                const initials = personName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

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
                        {request.startDate ||
                          request.start_date ||
                          "Start date unavailable"}
                        {" – "}
                        {request.endDate ||
                          request.end_date ||
                          "End date unavailable"}
                      </small>
                    </div>

                    <span
                      className={`request-status ${status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {status}
                    </span>

                    {activeTab === "incoming" &&
                      status.toLowerCase() ===
                        "pending" && (
                        <div className="request-actions">
                          <button
                            type="button"
                            className="decline-button"
                            onClick={() =>
                              handleRequestStatus(
                                request.id,
                                "Declined"
                              )
                            }
                          >
                            Decline
                          </button>

                          <button
                            type="button"
                            className="approve-button"
                            onClick={() =>
                              handleRequestStatus(
                                request.id,
                                "Approved"
                              )
                            }
                          >
                            Approve
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