import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import useRequests from "../hooks/useRequests.js";
import useAuth from "../hooks/useAuth.js";

import "./Requests.css";


function Requests() {
  const navigate = useNavigate();

  const {
    borrowingRequests,
    requestsLoading,
    requestsError,
    refreshRequests,
    updateBorrowingRequest,
  } = useRequests();

  const {
    currentUser,
  } = useAuth();

  const [
    activeTab,
    setActiveTab,
  ] = useState("incoming");

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [
    updatingRequestId,
    setUpdatingRequestId,
  ] = useState(null);


  const currentUserId =
    currentUser?.id;


  /*
   * Refresh when the user comes
   * back to the browser window.
   */
  useEffect(() => {
    const handleFocus =
      async () => {
        if (!currentUserId) {
          return;
        }

        await refreshRequests();
      };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [
    refreshRequests,
    currentUserId,
  ]);


  /*
   * Normalize possible API field names
   * for the borrower ID.
   */
  const getBorrowerId = (
    request
  ) => {
    return (
      request?.user_id ??
      request?.userId ??
      request?.borrower_id ??
      request?.borrowerId ??
      request?.user?.id ??
      request?.borrower?.id ??
      null
    );
  };


  /*
   * Normalize possible API field names
   * for the item owner ID.
   */
  const getOwnerId = (
    request
  ) => {
    return (
      request?.owner_id ??
      request?.ownerId ??
      request?.item?.owner_id ??
      request?.item?.ownerId ??
      request?.equipment?.owner_id ??
      request?.equipment?.ownerId ??
      null
    );
  };


  /*
   * Normalize possible API field names
   * for the loan ID.
   */
  const getLoanId = (
    request
  ) => {
    return (
      request?.loan_id ??
      request?.loanId ??
      request?.loan?.id ??
      null
    );
  };


  const getItemName = (
    request
  ) => {
    return (
      request?.item?.name ??
      request?.equipment?.name ??
      request?.item_name ??
      request?.itemName ??
      "Item"
    );
  };


  const getBorrowerName = (
    request
  ) => {
    if (
      request?.user &&
      typeof request.user ===
        "object"
    ) {
      const firstName =
        request.user.first_name ??
        request.user.firstName ??
        "";

      const lastName =
        request.user.last_name ??
        request.user.lastName ??
        "";

      return (
        request.user.name ||
        [firstName, lastName]
          .filter(Boolean)
          .join(" ") ||
        "Neighbour"
      );
    }

    if (
      request?.borrower &&
      typeof request.borrower ===
        "object"
    ) {
      const firstName =
        request.borrower.first_name ??
        request.borrower.firstName ??
        "";

      const lastName =
        request.borrower.last_name ??
        request.borrower.lastName ??
        "";

      return (
        request.borrower.name ||
        [firstName, lastName]
          .filter(Boolean)
          .join(" ") ||
        "Neighbour"
      );
    }

    return (
      request?.borrower_name ??
      request?.borrowerName ??
      "Neighbour"
    );
  };


  const formatDate = (
    value
  ) => {
    if (!value) {
      return "Not specified";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString();
  };


  /*
   * Requests sent BY the currently
   * logged-in user.
   */
  const outgoingRequests =
    useMemo(() => {
      if (!currentUserId) {
        return [];
      }

      return borrowingRequests.filter(
        (request) =>
          String(
            getBorrowerId(
              request
            )
          ) ===
          String(
            currentUserId
          )
      );
    }, [
      borrowingRequests,
      currentUserId,
    ]);


  /*
   * Requests received FOR items
   * owned by the current user.
   */
  const incomingRequests =
    useMemo(() => {
      if (!currentUserId) {
        return [];
      }

      return borrowingRequests.filter(
        (request) =>
          String(
            getOwnerId(
              request
            )
          ) ===
          String(
            currentUserId
          )
      );
    }, [
      borrowingRequests,
      currentUserId,
    ]);


  const displayedRequests =
    activeTab === "incoming"
      ? incomingRequests
      : outgoingRequests;


  const handleRequestAction =
    async (
      requestId,
      status
    ) => {
      try {
        setActionError("");

        setUpdatingRequestId(
          requestId
        );

        await updateBorrowingRequest(
          requestId,
          {
            status,
          }
        );

        await refreshRequests();
      } catch (error) {
        setActionError(
          error.message ||
            "Unable to update request."
        );
      } finally {
        setUpdatingRequestId(
          null
        );
      }
    };


  const handlePayment =
    (request) => {
      const loanId =
        getLoanId(request);

      if (!loanId) {
        setActionError(
          "This approved request does not have a loan attached yet."
        );

        return;
      }

      navigate(
        `/payments/${loanId}`
      );
    };


  if (requestsLoading) {
    return (
      <main className="requests-page">
        <p className="requests-message">
          Loading requests...
        </p>
      </main>
    );
  }


  if (requestsError) {
    return (
      <main className="requests-page">
        <p className="requests-message requests-message--error">
          {requestsError}
        </p>
      </main>
    );
  }


  return (
    <main className="requests-page">
      <div className="requests-heading">
        <div>
          <h1>
            Borrowing Requests
          </h1>

          <p>
            Manage requests you have
            received and requests you
            have sent.
          </p>
        </div>
      </div>


      {actionError && (
        <p className="requests-message requests-message--error">
          {actionError}
        </p>
      )}


      <div className="requests-tab-switcher">
        <button
          type="button"
          className={
            activeTab === "incoming"
              ? "requests-tab-button active"
              : "requests-tab-button"
          }
          onClick={() =>
            setActiveTab(
              "incoming"
            )
          }
        >
          Incoming Requests

          <span className="tab-count">
            {
              incomingRequests.length
            }
          </span>
        </button>


        <button
          type="button"
          className={
            activeTab === "outgoing"
              ? "requests-tab-button active"
              : "requests-tab-button"
          }
          onClick={() =>
            setActiveTab(
              "outgoing"
            )
          }
        >
          Outgoing Requests

          <span className="tab-count">
            {
              outgoingRequests.length
            }
          </span>
        </button>
      </div>


      <section className="requests-panel">
        <div className="requests-panel-heading">
          <div>
            <h2>
              {
                activeTab ===
                "incoming"
                  ? "Incoming Requests"
                  : "Outgoing Requests"
              }
            </h2>

            <p>
              {
                activeTab ===
                "incoming"
                  ? "Requests from neighbours who want to borrow your items."
                  : "Requests you have sent to borrow items from neighbours."
              }
            </p>
          </div>

          <span className="request-count">
            {
              displayedRequests.length
            }
          </span>
        </div>


        <div className="requests-list">
          {
            displayedRequests.length ===
            0 ? (
              <div className="empty-requests">
                <p>
                  {
                    activeTab ===
                    "incoming"
                      ? "You have no incoming requests."
                      : "You have no outgoing requests."
                  }
                </p>
              </div>
            ) : (
              displayedRequests.map(
                (request) => {
                  const status =
                    String(
                      request.status ||
                        "pending"
                    ).toLowerCase();

                  const isUpdating =
                    String(
                      updatingRequestId
                    ) ===
                    String(
                      request.id
                    );

                  const itemName =
                    getItemName(
                      request
                    );

                  const borrowerName =
                    getBorrowerName(
                      request
                    );

                  const startDate =
                    request.start_date ??
                    request.startDate;

                  const endDate =
                    request.end_date ??
                    request.endDate;

                  const loanId =
                    getLoanId(
                      request
                    );

                  const initials =
                    borrowerName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(
                        (name) =>
                          name
                            .charAt(0)
                            .toUpperCase()
                      )
                      .join("") ||
                    "N";


                  return (
                    <article
                      className="request-list-card"
                      key={
                        request.id
                      }
                    >
                      <div className="request-avatar">
                        {initials}
                      </div>


                      <div className="request-details">
                        <strong>
                          {itemName}
                        </strong>


                        {
                          activeTab ===
                            "incoming" && (
                            <p>
                              Requested by{" "}
                              <strong>
                                {
                                  borrowerName
                                }
                              </strong>
                            </p>
                          )
                        }


                        <p>
                          {
                            formatDate(
                              startDate
                            )
                          }{" "}
                          →{" "}
                          {
                            formatDate(
                              endDate
                            )
                          }
                        </p>


                        {
                          request.message && (
                            <small>
                              {
                                request.message
                              }
                            </small>
                          )
                        }


                        <div className="request-status-actions">
                          <span
                            className={
                              `request-status request-status--${status}`
                            }
                          >
                            {status}
                          </span>


                          {
                            activeTab ===
                              "outgoing" &&
                            status ===
                              "approved" &&
                            loanId && (
                              <button
                                type="button"
                                className="pay-now-btn"
                                onClick={() =>
                                  handlePayment(
                                    request
                                  )
                                }
                              >
                                Pay Now
                              </button>
                            )
                          }
                        </div>
                      </div>


                      {
                        activeTab ===
                          "incoming" &&
                        status ===
                          "pending" && (
                          <div className="request-actions">
                            <button
                              type="button"
                              className="approve-btn"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                handleRequestAction(
                                  request.id,
                                  "approved"
                                )
                              }
                            >
                              {
                                isUpdating
                                  ? "Updating..."
                                  : "Approve"
                              }
                            </button>


                            <button
                              type="button"
                              className="decline-btn"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                handleRequestAction(
                                  request.id,
                                  "declined"
                                )
                              }
                            >
                              Decline
                            </button>
                          </div>
                        )
                      }
                    </article>
                  );
                }
              )
            )
          }
        </div>
      </section>
    </main>
  );
}


export default Requests;
