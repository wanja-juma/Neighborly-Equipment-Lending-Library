import { useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useRequests from "../hooks/useRequests";

import "./Requests.css";


function getPersonName(person) {
  if (!person) {
    return "";
  }

  if (typeof person === "string") {
    return person;
  }

  const profile = person.profile || {};

  const firstName =
    person.firstName ||
    person.first_name ||
    profile.firstName ||
    profile.first_name ||
    "";

  const lastName =
    person.lastName ||
    person.last_name ||
    profile.lastName ||
    profile.last_name ||
    "";

  return (
    person.name ||
    `${firstName} ${lastName}`.trim()
  );
}


function Requests() {
  const [activeTab, setActiveTab] =
    useState("incoming");

  const [
    updatingRequestId,
    setUpdatingRequestId,
  ] = useState(null);

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [notice, setNotice] =
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

  const safeRequests = Array.isArray(
    borrowingRequests
  )
    ? borrowingRequests
    : [];


  const getBorrowerId = (request) => {
    return (
      request.borrowerId ??
      request.borrower_id ??
      request.userId ??
      request.user_id ??
      request.borrower?.id ??
      request.user?.id ??
      request.loan?.borrowerId ??
      request.loan?.borrower_id ??
      request.loan?.borrower?.id
    );
  };


  const getOwnerId = (request) => {
    return (
      request.ownerId ??
      request.owner_id ??
      request.owner?.id ??
      request.item?.ownerId ??
      request.item?.owner_id ??
      request.item?.owner?.id ??
      request.loan?.item?.ownerId ??
      request.loan?.item?.owner_id ??
      request.loan?.item?.owner?.id
    );
  };


  const getRequestDirection = (
    request
  ) => {
    return String(
      request.requestType ||
        request.request_type ||
        request.direction ||
        request.type ||
        ""
    ).toLowerCase();
  };


  const incomingRequests =
    safeRequests.filter((request) => {
      const ownerId =
        getOwnerId(request);

      const direction =
        getRequestDirection(request);

      return (
        String(ownerId) ===
          currentUserId ||
        direction === "incoming"
      );
    });


  const outgoingRequests =
    safeRequests.filter((request) => {
      const borrowerId =
        getBorrowerId(request);

      const direction =
        getRequestDirection(request);

      return (
        String(borrowerId) ===
          currentUserId ||
        direction === "outgoing"
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
    setActionError("");
    setNotice("");
    setUpdatingRequestId(requestId);

    try {
      const result =
        await updateRequestStatus(
          requestId,
          newStatus
        );

      if (!result?.success) {
        setActionError(
          result?.message ||
            `Unable to ${newStatus} the request.`
        );

        return;
      }

      setNotice(
        newStatus === "approved"
          ? "The request was approved."
          : "The request was declined."
      );
    } catch (error) {
      setActionError(
        error.message ||
          `Unable to ${newStatus} the request.`
      );
    } finally {
      setUpdatingRequestId(null);
    }
  };


  const getItem = (request) => {
    return (
      request.item ||
      request.loan?.item ||
      null
    );
  };


  const getItemName = (request) => {
    const item = getItem(request);

    if (typeof item === "string") {
      return item;
    }

    return (
      request.itemName ||
      request.item_name ||
      item?.name ||
      "Equipment"
    );
  };


  const getPerson = (request) => {
    if (activeTab === "incoming") {
      return (
        request.borrower ||
        request.user ||
        request.loan?.borrower ||
        null
      );
    }

    return (
      request.owner ||
      getItem(request)?.owner ||
      request.loan?.item?.owner ||
      null
    );
  };


  const getDisplayedPersonName = (
    request
  ) => {
    const directName =
      activeTab === "incoming"
        ? request.borrowerName ||
          request.borrower_name ||
          request.userName ||
          request.user_name
        : request.ownerName ||
          request.owner_name;

    return (
      directName ||
      getPersonName(
        getPerson(request)
      ) ||
      "Neighbour"
    );
  };


  const getStartDate = (request) => {
    return (
      request.startDate ||
      request.start_date ||
      request.loan?.startDate ||
      request.loan?.start_date ||
      "Start date unavailable"
    );
  };


  const getEndDate = (request) => {
    return (
      request.endDate ||
      request.end_date ||
      request.dueDate ||
      request.due_date ||
      request.loan?.endDate ||
      request.loan?.end_date ||
      request.loan?.dueDate ||
      request.loan?.due_date ||
      "End date unavailable"
    );
  };


  const getLoanId = (request) => {
    return (
      request.loan_id ??
      request.loanId ??
      request.loan?.id ??
      null
    );
  };


  const formatDate = (value) => {
    if (
      !value ||
      value.includes?.("unavailable")
    ) {
      return value;
    }

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return value;
    }

    return date.toLocaleDateString();
  };


  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };


  if (requestsLoading) {
    return (
      <main className="dashboard-main">
        <section className="requests-page">
          <div className="requests-state">
            <p>
              Loading requests...
            </p>
          </div>
        </section>
      </main>
    );
  }


  if (requestsError) {
    return (
      <main className="dashboard-main">
        <section className="requests-page">
          <div
            className="requests-state error"
            role="alert"
          >
            <p>{requestsError}</p>
          </div>
        </section>
      </main>
    );
  }


  return (
    <main className="dashboard-main">
      <section className="requests-page">

        <header className="requests-heading">
          <div>
            <h1>
              Borrowing Requests
            </h1>

            <p>
              Manage requests for borrowing
              and lending equipment.
            </p>
          </div>
        </header>


        <div
          className="requests-tab-switcher"
          role="tablist"
          aria-label="Borrowing request type"
        >
          <button
            type="button"
            role="tab"
            className={`requests-tab-button ${
              activeTab === "incoming"
                ? "active"
                : ""
            }`}
            aria-selected={
              activeTab === "incoming"
            }
            onClick={() =>
              handleTabChange("incoming")
            }
          >
            Incoming

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
            aria-selected={
              activeTab === "outgoing"
            }
            onClick={() =>
              handleTabChange("outgoing")
            }
          >
            Outgoing

            <span className="tab-count">
              {outgoingRequests.length}
            </span>
          </button>
        </div>


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


        <section
          className="requests-panel"
          role="tabpanel"
        >
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
                  const requestId =
                    request.id;

                  const status = String(
                    request.status ||
                      "pending"
                  ).toLowerCase();

                  const statusClass =
                    status.replace(
                      /\s+/g,
                      "-"
                    );

                  const isPending =
                    status === "pending";

                  const isUpdating =
                    String(
                      updatingRequestId
                    ) ===
                    String(requestId);

                  const loanId =
                    getLoanId(request);

                  const canPay =
                    activeTab ===
                      "outgoing" &&
                    status ===
                      "approved" &&
                    Boolean(loanId);

                  const personName =
                    getDisplayedPersonName(
                      request
                    );

                  const itemName =
                    getItemName(request);


                  return (
                    <article
                      className="request-list-card"
                      key={requestId}
                    >

                      <span className="request-avatar">
                        {getInitials(
                          personName
                        ) || "N"}
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

                          <b>
                            {itemName}
                          </b>
                        </p>

                        <small>
                          {formatDate(
                            getStartDate(
                              request
                            )
                          )}

                          {" – "}

                          {formatDate(
                            getEndDate(
                              request
                            )
                          )}
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
                                  requestId,
                                  "declined"
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
                                  requestId,
                                  "approved"
                                )
                              }
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Approve"}
                            </button>

                          </div>
                        )}


                      {canPay && (
                        <div className="request-payment-action">

                          <Link
                            className="pay-request-button"
                            to={`/payments/${loanId}`}
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

      </section>
    </main>
  );
}


export default Requests;
