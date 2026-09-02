import { useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useItems from "../hooks/useItems";
import useLoans from "../hooks/useLoans";
import useRequests from "../hooks/useRequests";
import getLoanStatus from "../utils/getLoanStatus";

import "./Dashboard.css";

const summaryCards = [
  {
    id: 1,
    title: "My Listings",
    icon: "▦",
    color: "green",
  },
  {
    id: 2,
    title: "Pending Requests",
    icon: "◷",
    color: "orange",
  },
  {
    id: 3,
    title: "Items Borrowed",
    icon: "↓",
    color: "blue",
  },
  {
    id: 4,
    title: "Items Lent Out",
    icon: "↑",
    color: "purple",
  },
];

const normalizeCollection = (
  value,
  ...properties
) => {
  if (Array.isArray(value)) {
    return value;
  }

  for (const property of properties) {
    if (
      Array.isArray(
        value?.[property]
      )
    ) {
      return value[property];
    }
  }

  return [];
};

const getItemName = (record) => {
  if (
    record?.item &&
    typeof record.item === "object"
  ) {
    return (
      record.item.name ||
      "Equipment"
    );
  }

  return (
    record?.itemName ||
    record?.item_name ||
    record?.item ||
    record?.name ||
    "Equipment"
  );
};

const getPersonName = (
  directName,
  person,
  fallback = "Neighbour"
) => {
  if (
    typeof directName === "string" &&
    directName.trim()
  ) {
    return directName.trim();
  }

  if (
    typeof person === "string" &&
    person.trim()
  ) {
    return person.trim();
  }

  if (
    person &&
    typeof person === "object"
  ) {
    if (person.name) {
      return person.name;
    }

    const profile =
      person.profile || person;

    const firstName =
      profile.firstName ||
      profile.first_name ||
      "";

    const lastName =
      profile.lastName ||
      profile.last_name ||
      "";

    const profileName = [
      firstName,
      lastName,
    ]
      .filter(Boolean)
      .join(" ");

    if (profileName) {
      return profileName;
    }
  }

  return fallback;
};

const getRecordOwnerId = (record) =>
  record?.ownerId ??
  record?.owner_id ??
  record?.owner?.id ??
  record?.item?.ownerId ??
  record?.item?.owner_id ??
  record?.item?.owner?.id;

const getRecordBorrowerId = (record) =>
  record?.borrowerId ??
  record?.borrower_id ??
  record?.borrower?.id ??
  record?.userId ??
  record?.user_id;

const getDueDate = (loan) =>
  loan?.dueDate ??
  loan?.due_date ??
  loan?.endDate ??
  loan?.end_date;

const formatDate = (date) => {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(parsedDate);
};

const getReturnReminderText = (
  loan
) => {
  const dueDateValue =
    getDueDate(loan);

  if (!dueDateValue) {
    return "";
  }

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const dueDate =
    new Date(dueDateValue);

  if (
    Number.isNaN(
      dueDate.getTime()
    )
  ) {
    return "";
  }

  dueDate.setHours(
    0,
    0,
    0,
    0
  );

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const daysRemaining =
    Math.round(
      (
        dueDate.getTime() -
        today.getTime()
      ) /
        millisecondsPerDay
    );

  if (daysRemaining < 0) {
    const overdueDays =
      Math.abs(daysRemaining);

    return `${overdueDays} ${
      overdueDays === 1
        ? "day"
        : "days"
    } overdue`;
  }

  if (daysRemaining === 0) {
    return "Due today";
  }

  if (daysRemaining === 1) {
    return "Due tomorrow";
  }

  return `Due in ${daysRemaining} days`;
};

const getStatusClass = (status) =>
  String(
    status || "On Track"
  )
    .toLowerCase()
    .replaceAll(" ", "-");

function Dashboard() {
  const { currentUser } =
    useAuth();

  const { items } =
    useItems();

  const {
    borrowingRequests,
    requestsLoading,
    requestsError,
    updateRequestStatus,
  } = useRequests();

  const {
    loans,
    loansLoading,
    loansError,
  } = useLoans();

  const [
    notice,
    setNotice,
  ] = useState("");

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [
    updatingRequestId,
    setUpdatingRequestId,
  ] = useState(null);

  const safeItems =
    normalizeCollection(
      items,
      "items"
    );

  const safeRequests =
    normalizeCollection(
      borrowingRequests,
      "borrowingRequests",
      "borrowing_requests",
      "requests"
    );

  const safeLoans =
    normalizeCollection(
      loans,
      "loans"
    );

  const currentUserId =
    String(
      currentUser?.id || ""
    );

  const firstName =
    currentUser?.firstName ||
    currentUser?.first_name ||
    currentUser?.profile
      ?.first_name ||
    currentUser?.profile
      ?.firstName ||
    "";

  const lastName =
    currentUser?.lastName ||
    currentUser?.last_name ||
    currentUser?.profile
      ?.last_name ||
    currentUser?.profile
      ?.lastName ||
    "";

  const fullName =
    currentUser?.name ||
    [firstName, lastName]
      .filter(Boolean)
      .join(" ") ||
    currentUser?.email ||
    "Neighbour";

  const displayName =
    firstName ||
    fullName.split(" ")[0] ||
    "Neighbour";

  const myItems =
    safeItems.filter(
      (item) =>
        String(
          getRecordOwnerId(item)
        ) === currentUserId
    );

  const recentListings =
    myItems.slice(0, 3);

  const pendingRequests =
    safeRequests.filter(
      (request) => {
        const status =
          String(
            request.status || ""
          ).toLowerCase();

        const requestType =
          String(
            request.requestType ??
              request.request_type ??
              request.direction ??
              request.type ??
              ""
          ).toLowerCase();

        const ownerId =
          String(
            getRecordOwnerId(
              request
            ) ?? ""
          );

        return (
          status === "pending" &&
          (
            ownerId ===
              currentUserId ||
            requestType ===
              "incoming"
          )
        );
      }
    );

  const recentPendingRequests =
    pendingRequests.slice(0, 3);

  const activeLoans =
    safeLoans.filter(
      (loan) => {
        const status =
          String(
            getLoanStatus(loan) ||
              ""
          ).toLowerCase();

        return (
          status !== "returned" &&
          status !== "completed" &&
          status !== "cancelled" &&
          status !== "canceled"
        );
      }
    );

  const borrowedLoans =
    activeLoans.filter(
      (loan) => {
        const loanType =
          String(
            loan.loanType ??
              loan.loan_type ??
              ""
          ).toLowerCase();

        return (
          String(
            getRecordBorrowerId(
              loan
            ) ?? ""
          ) === currentUserId ||
          loanType === "borrowed"
        );
      }
    );

  const lentLoans =
    activeLoans.filter(
      (loan) => {
        const loanType =
          String(
            loan.loanType ??
              loan.loan_type ??
              ""
          ).toLowerCase();

        return (
          String(
            getRecordOwnerId(
              loan
            ) ?? ""
          ) === currentUserId ||
          loanType === "lent"
        );
      }
    );

  const currentUserActiveLoans =
    activeLoans.filter(
      (loan) =>
        borrowedLoans.includes(
          loan
        ) ||
        lentLoans.includes(
          loan
        )
    );

  const recentActiveLoans =
    currentUserActiveLoans.slice(
      0,
      3
    );

  const returnReminderLoan =
    [...borrowedLoans]
      .filter((loan) => {
        const dueDateValue =
          getDueDate(loan);

        if (!dueDateValue) {
          return false;
        }

        const dueDate =
          new Date(
            dueDateValue
          );

        return !Number.isNaN(
          dueDate.getTime()
        );
      })
      .sort(
        (
          firstLoan,
          secondLoan
        ) =>
          new Date(
            getDueDate(firstLoan)
          ) -
          new Date(
            getDueDate(
              secondLoan
            )
          )
      )[0];

  const dashboardSummary =
    summaryCards.map(
      (card) => {
        switch (card.title) {
          case "My Listings":
            return {
              ...card,
              value:
                myItems.length,
            };

          case "Pending Requests":
            return {
              ...card,
              value:
                pendingRequests.length,
            };

          case "Items Borrowed":
            return {
              ...card,
              value:
                borrowedLoans.length,
            };

          case "Items Lent Out":
            return {
              ...card,
              value:
                lentLoans.length,
            };

          default:
            return {
              ...card,
              value: 0,
            };
        }
      }
    );

  const currentDate =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date());

  const handleRequest =
    async (
      requestId,
      newStatus
    ) => {
      setNotice("");
      setActionError("");
      setUpdatingRequestId(
        requestId
      );

      try {
        const result =
          await updateRequestStatus(
            requestId,
            newStatus
          );

        if (
          result &&
          result.success === false
        ) {
          throw new Error(
            result.message ||
              "The request could not be updated."
          );
        }

        setNotice(
          result?.message ||
            `Request ${newStatus.toLowerCase()} successfully.`
        );
      } catch (error) {
        setActionError(
          error.message ||
            "The request could not be updated."
        );
      } finally {
        setUpdatingRequestId(
          null
        );
      }
    };

  return (
    <main className="dashboard-main">
      <header className="top-navigation">
        <label className="search-bar">
          <span className="search-icon">
            ⌕
          </span>

          <input
            type="search"
            placeholder="Search items or neighbours..."
            aria-label="Search items or neighbours"
          />
        </label>

        <div className="top-navigation-actions">
          <button
            className="notification-button"
            type="button"
            aria-label="View notifications"
          >
            ♢

            <span className="notification-indicator" />
          </button>

        </div>
      </header>

      <section className="dashboard-content">
        {notice && (
          <div
            className="request-notice"
            role="status"
          >
            <span>
              {notice}
            </span>

            <button
              type="button"
              onClick={() =>
                setNotice("")
              }
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div
            className="request-notice error"
            role="alert"
          >
            <span>
              {actionError}
            </span>

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

        <div className="welcome-row">
          <div className="welcome-message">
            <p className="current-date">
              {currentDate}
            </p>

            <h1>
              Welcome back,{" "}
              {displayName}
            </h1>

            <p className="welcome-description">
              Here is what is
              happening in your
              community today.
            </p>
          </div>

          <Link
            className="primary-button"
            to="/items/new"
          >
            <span className="button-icon">
              +
            </span>

            Add New Item
          </Link>
        </div>

        <section
          className="summary-grid"
          aria-label="Dashboard summary"
        >
          {dashboardSummary.map(
            (card) => (
              <article
                className="summary-card"
                key={card.id}
              >
                <span
                  className={`summary-icon ${card.color}`}
                >
                  {card.icon}
                </span>

                <div className="summary-information">
                  <strong>
                    {card.value}
                  </strong>

                  <span>
                    {card.title}
                  </span>
                </div>

                <span className="summary-arrow">
                  ›
                </span>
              </article>
            )
          )}
        </section>

        <div className="dashboard-panels">
          <section className="requests-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Borrowing Requests
                </h2>

                <p>
                  Review requests
                  from neighbours
                  who want to
                  borrow your
                  items.
                </p>
              </div>

              <Link
                className="view-all-button"
                to="/requests"
              >
                View All
              </Link>
            </div>

            <div className="requests-list">
              {requestsLoading ? (
                <div className="requests-empty-state">
                  <p>
                    Loading borrowing
                    requests...
                  </p>
                </div>
              ) : requestsError ? (
                <div className="requests-empty-state error">
                  <p>
                    {requestsError}
                  </p>
                </div>
              ) : recentPendingRequests.length >
                0 ? (
                recentPendingRequests.map(
                  (request) => {
                    const borrowerName =
                      getPersonName(
                        request.borrowerName ??
                          request.borrower_name,
                        request.borrower
                      );

                    const requestInitials =
                      request.initials ||
                      borrowerName
                        .split(" ")
                        .filter(Boolean)
                        .map((name) =>
                          name.charAt(0)
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ||
                      "N";

                    const startDate =
                      request.startDate ??
                      request.start_date;

                    const endDate =
                      request.endDate ??
                      request.end_date;

                    const isUpdating =
                      String(
                        updatingRequestId
                      ) ===
                      String(
                        request.id
                      );

                    return (
                      <article
                        className="request-card"
                        key={
                          request.id
                        }
                      >
                        <span
                          className={`borrower-avatar ${
                            request.avatarColor ||
                            "blue"
                          }`}
                        >
                          {
                            requestInitials
                          }
                        </span>

                        <div className="request-information">
                          <strong>
                            {
                              borrowerName
                            }
                          </strong>

                          <span className="request-description">
                            Wants to
                            borrow{" "}
                            <b>
                              {getItemName(
                                request
                              )}
                            </b>
                          </span>

                          <small className="request-dates">
                            {formatDate(
                              startDate
                            )}{" "}
                            –{" "}
                            {formatDate(
                              endDate
                            )}
                          </small>
                        </div>

                        <div className="request-buttons">
                          <button
                            className="decline-button"
                            type="button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleRequest(
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
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleRequest(
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
                      </article>
                    );
                  }
                )
              ) : (
                <div className="requests-empty-state">
                  <span className="empty-state-icon">
                    ✓
                  </span>

                  <div>
                    <strong>
                      All requests
                      reviewed
                    </strong>

                    <p>
                      You have no
                      pending
                      borrowing
                      requests.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="loans-panel">
          <div className="panel-heading">
            <div>
              <h2>
                Active Loans
              </h2>

              <p>
                Items you are
                currently
                borrowing or
                lending.
              </p>
            </div>

            <Link
              className="view-all-button"
              to="/loans"
            >
              View All
            </Link>
          </div>

          <div className="loans-list">
            {loansLoading ? (
              <div className="loans-empty-state">
                <p>
                  Loading active
                  loans...
                </p>
              </div>
            ) : loansError ? (
              <div className="loans-empty-state error">
                <p>
                  {loansError}
                </p>
              </div>
            ) : recentActiveLoans.length >
              0 ? (
              recentActiveLoans.map(
                (loan) => {
                  const currentStatus =
                    getLoanStatus(
                      loan
                    );

                  const borrowerId =
                    getRecordBorrowerId(
                      loan
                    );

                  const loanType =
                    String(
                      loan.loanType ??
                        loan.loan_type ??
                        ""
                    ).toLowerCase();

                  const isBorrowed =
                    String(
                      borrowerId ??
                        ""
                    ) ===
                      currentUserId ||
                    loanType ===
                      "borrowed";

                  const ownerName =
                    getPersonName(
                      loan.ownerName ??
                        loan.owner_name,
                      loan.owner
                    );

                  const borrowerName =
                    getPersonName(
                      loan.borrowerName ??
                        loan.borrower_name,
                      loan.borrower
                    );

                  const fallbackPerson =
                    getPersonName(
                      loan.person,
                      null
                    );

                  const personName =
                    isBorrowed
                      ? ownerName !==
                        "Neighbour"
                        ? ownerName
                        : fallbackPerson
                      : borrowerName !==
                          "Neighbour"
                        ? borrowerName
                        : fallbackPerson;

                  const loanItemName =
                    getItemName(
                      loan
                    );

                  return (
                    <article
                      className="loan-card"
                      key={
                        loan.id
                      }
                    >
                      <span className="loan-item-icon">
                        {loan.icon ||
                          loan.item
                            ?.icon ||
                          "🧰"}
                      </span>

                      <div className="loan-information">
                        <strong>
                          {
                            loanItemName
                          }
                        </strong>

                        <span className="loan-person">
                          {isBorrowed
                            ? `Borrowed from ${personName}`
                            : `Lent to ${personName}`}
                        </span>

                        <small className="loan-due-date">
                          Due{" "}
                          {formatDate(
                            getDueDate(
                              loan
                            )
                          )}
                        </small>
                      </div>

                      <span
                        className={`loan-status ${getStatusClass(
                          currentStatus
                        )}`}
                      >
                        {
                          currentStatus
                        }
                      </span>

                      <Link
                        className="loan-options-button"
                        to="/loans"
                        aria-label={`View details for ${loanItemName}`}
                      >
                        •••
                      </Link>
                    </article>
                  );
                }
              )
            ) : (
              <div className="loans-empty-state">
                <span className="empty-state-icon">
                  ✓
                </span>

                <div>
                  <strong>
                    No active loans
                  </strong>

                  <p>
                    You have no
                    borrowed or lent
                    items at the
                    moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="listings-reminder-layout">
          <section className="listings-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  My Listings
                </h2>

                <p>
                  Your recently
                  added tools and
                  equipment.
                </p>
              </div>

              <Link
                className="view-all-button"
                to="/listings"
              >
                View All
              </Link>
            </div>

            <div className="listings-grid">
              {recentListings.length >
              0 ? (
                recentListings.map(
                  (item) => {
                    const statusClass =
                      item.statusColor ||
                      String(
                        item.availability ||
                          ""
                      )
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        );

                    return (
                      <article
                        className="listing-card"
                        key={
                          item.id
                        }
                      >
                        <div className="listing-image">
                          <span>
                            {item.icon ||
                              "🧰"}
                          </span>

                          <Link
                            className="listing-options-button"
                            to="/listings"
                            aria-label={`View options for ${
                              item.name ||
                              "equipment"
                            }`}
                          >
                            •••
                          </Link>
                        </div>

                        <div className="listing-information">
                          <strong>
                            {item.name ||
                              "Equipment"}
                          </strong>

                          <span className="item-condition">
                            {item.condition ||
                              "Unknown"}
                          </span>

                          <small
                            className={`availability-status ${statusClass}`}
                          >
                            <span className="status-dot" />

                            {item.availability ||
                              "Unknown"}
                          </small>
                        </div>
                      </article>
                    );
                  }
                )
              ) : (
                <div className="listings-empty-state">
                  <p>
                    You have not
                    added any items
                    yet.
                  </p>

                  <Link
                    className="primary-button"
                    to="/items/new"
                  >
                    Add Your First
                    Item
                  </Link>
                </div>
              )}
            </div>
          </section>

          {returnReminderLoan ? (
            <aside
              className={`return-reminder ${getStatusClass(
                getLoanStatus(
                  returnReminderLoan
                )
              )}`}
            >
              <span className="reminder-icon">
                !
              </span>

              <div className="reminder-information">
                <small>
                  RETURN REMINDER
                </small>

                <strong>
                  {getItemName(
                    returnReminderLoan
                  )}
                </strong>

                <p>
                  Return to{" "}
                  {getPersonName(
                    returnReminderLoan
                      .ownerName ??
                      returnReminderLoan
                        .owner_name,
                    returnReminderLoan.owner,
                    returnReminderLoan.person ||
                      "the item owner"
                  )}{" "}
                  by{" "}
                  <b>
                    {formatDate(
                      getDueDate(
                        returnReminderLoan
                      )
                    )}
                  </b>
                  .
                </p>

                <span className="reminder-due-status">
                  {getReturnReminderText(
                    returnReminderLoan
                  )}
                </span>
              </div>

              <Link
                className="view-loan-button"
                to="/loans"
              >
                View Loan
              </Link>
            </aside>
          ) : (
            <aside className="return-reminder empty">
              <span className="reminder-icon">
                ✓
              </span>

              <div className="reminder-information">
                <small>
                  RETURN REMINDER
                </small>

                <strong>
                  No items due
                </strong>

                <p>
                  You have no
                  borrowed items to
                  return.
                </p>
              </div>

              <Link
                className="view-loan-button"
                to="/items"
              >
                Browse Items
              </Link>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
