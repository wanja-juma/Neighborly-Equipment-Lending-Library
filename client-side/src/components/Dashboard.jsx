import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useItems from "../hooks/useItems";
import useRequests from "../hooks/useRequests";
import useLoans from "../hooks/useLoans";
import getLoanStatus from "../utils/getLoanStatus";
import "./Dashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

const summaryCards = [
  {
    id: 1,
    title: "My Listings",
    value: 0,
    icon: "▦",
    color: "green",
  },
  {
    id: 2,
    title: "Pending Requests",
    value: 0,
    icon: "◷",
    color: "orange",
  },
  {
    id: 3,
    title: "Items Borrowed",
    value: 0,
    icon: "↓",
    color: "blue",
  },
  {
    id: 4,
    title: "Items Lent Out",
    value: 0,
    icon: "↑",
    color: "purple",
  },
];

function Dashboard() {
  const { items } = useItems();

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

  const [notice, setNotice] = useState("");
  const [currentUser, setCurrentUser] =
    useState(null);
  const [userLoading, setUserLoading] =
    useState(true);
  const [userError, setUserError] =
    useState("");

  const currentUserId = String(
    currentUser?.id || ""
  );

  // Current user's listings
  const myItems = items.filter(
    (item) =>
      String(item.ownerId) ===
      currentUserId
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem(
        "access_token"
      );

      if (!token) {
        setUserError("Please log in.");
        setUserLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load user information."
          );
        }

        setCurrentUser(data.user);
      } catch (error) {
        setUserError(error.message);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const recentListings = myItems.slice(0, 3);

  // Pending borrowing requests
  const pendingRequests =
    borrowingRequests.filter(
      (request) =>
        request.status?.toLowerCase() ===
        "pending"
    );

  const recentPendingRequests =
    pendingRequests.slice(0, 3);

  // Active loans
  const activeLoans = loans.filter(
    (loan) =>
      getLoanStatus(loan) !== "Returned"
  );

  const borrowedLoans = activeLoans.filter(
    (loan) =>
      String(loan.borrowerId) ===
        currentUserId ||
      loan.loanType === "borrowed"
  );

  const lentLoans = activeLoans.filter(
    (loan) =>
      String(loan.ownerId) ===
        currentUserId ||
      loan.loanType === "lent"
  );

  const recentActiveLoans =
    activeLoans.slice(0, 3);

    const returnReminderLoan = [
  ...borrowedLoans,
]
  .filter((loan) => {
    if (!loan.dueDate) {
      return false;
    }

    const dueDate = new Date(loan.dueDate);

    return !Number.isNaN(
      dueDate.getTime()
    );
  })
  .sort(
    (firstLoan, secondLoan) =>
      new Date(firstLoan.dueDate) -
      new Date(secondLoan.dueDate)
  )[0];

const getReturnReminderText = (loan) => {
  if (!loan?.dueDate) {
    return "";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(loan.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const daysRemaining = Math.round(
    (dueDate - today) /
      millisecondsPerDay
  );

  if (daysRemaining < 0) {
    const overdueDays =
      Math.abs(daysRemaining);

    return `${overdueDays} ${
      overdueDays === 1 ? "day" : "days"
    } overdue`;
  }

  if (daysRemaining === 0) {
    return "due today";
  }

  if (daysRemaining === 1) {
    return "due tomorrow";
  }

  return `due in ${daysRemaining} days`;
};

const formatReminderDate = (dueDate) => {
  if (!dueDate) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(dueDate));
};

  // Convert a status into a CSS class
  const getLoanStatusClass = (status) => {
    return (status || "On Track")
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  // Dynamic dashboard summary
  const dashboardSummary = summaryCards.map(
    (card) => {
      if (card.title === "My Listings") {
        return {
          ...card,
          value: myItems.length,
        };
      }

      if (
        card.title === "Pending Requests"
      ) {
        return {
          ...card,
          value: pendingRequests.length,
        };
      }

      if (card.title === "Items Borrowed") {
        return {
          ...card,
          value: borrowedLoans.length,
        };
      }

      if (card.title === "Items Lent Out") {
        return {
          ...card,
          value: lentLoans.length,
        };
      }

      return card;
    }
  );

  const currentDate =
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

  const handleRequest = async (
    requestId,
    newStatus
  ) => {
    setNotice("");

    const result = await updateRequestStatus(
      requestId,
      newStatus
    );

    setNotice(result.message);
  };

  const firstName =
    currentUser?.profile?.first_name ||
    "Neighbor";

  const lastName =
    currentUser?.profile?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "N";

  return (
    <div className="neighborly-app">
      <main className="dashboard-main">
        {/* Top navigation */}
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

            <div className="profile">
              <span className="profile-avatar">
                {initials}
              </span>

              <div className="profile-details">
                <strong>{fullName}</strong>
                <small>Member</small>
              </div>

              <span className="profile-arrow">
                ⌄
              </span>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          {/* Notification */}
          {notice && (
            <div
              className="request-notice"
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

          {/* Welcome section */}
          <div className="welcome-row">
            <div className="welcome-message">
              <p className="current-date">
                {currentDate}
              </p>

              <h1>
                {userLoading
                  ? "Welcome back"
                  : `Welcome back, ${firstName}`}
              </h1>

              {userError && (
                <p className="user-error" role="alert">
                  {userError}
                </p>
              )}

              <p className="welcome-description">
                Here is what is happening in your
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

          {/* Summary cards */}
          <section
            className="summary-grid"
            aria-label="Dashboard summary"
          >
            {dashboardSummary.map((card) => (
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
                  <strong>{card.value}</strong>
                  <span>{card.title}</span>
                </div>

                <span className="summary-arrow">
                  ›
                </span>
              </article>
            ))}
          </section>

          {/* Borrowing requests */}
          <div className="dashboard-panels">
            <section className="requests-panel">
              <div className="panel-heading">
                <div>
                  <h2>Borrowing Requests</h2>

                  <p>
                    Review requests from neighbours
                    who want to borrow your items.
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
                      Loading borrowing requests...
                    </p>
                  </div>
                ) : requestsError ? (
                  <div className="requests-empty-state error">
                    <p>{requestsError}</p>
                  </div>
                ) : recentPendingRequests.length >
                  0 ? (
                  recentPendingRequests.map(
                    (request) => {
                      const borrowerName =
                        request.borrowerName ||
                        request.borrower ||
                        "Neighbour";

                      const initials =
                        request.initials ||
                        borrowerName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();

                      return (
                        <article
                          className="request-card"
                          key={request.id}
                        >
                          <span
                            className={`borrower-avatar ${
                              request.avatarColor ||
                              "blue"
                            }`}
                          >
                            {initials}
                          </span>

                          <div className="request-information">
                            <strong>
                              {borrowerName}
                            </strong>

                            <span className="request-description">
                              wants to borrow{" "}
                              <b>
                                {request.itemName ||
                                  request.item ||
                                  "your item"}
                              </b>
                            </span>

                            <small className="request-dates">
                              {request.startDate ||
                                "Date not provided"}{" "}
                              –{" "}
                              {request.endDate ||
                                "Date not provided"}
                            </small>
                          </div>

                          <div className="request-buttons">
                            <button
                              className="decline-button"
                              type="button"
                              onClick={() =>
                                handleRequest(
                                  request.id,
                                  "Declined"
                                )
                              }
                            >
                              Decline
                            </button>

                            <button
                              className="approve-button"
                              type="button"
                              onClick={() =>
                                handleRequest(
                                  request.id,
                                  "Approved"
                                )
                              }
                            >
                              Approve
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
                        All requests reviewed
                      </strong>

                      <p>
                        You have no pending
                        borrowing requests.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Active loans */}
          <section className="loans-panel">
            <div className="panel-heading">
              <div>
                <h2>Active Loans</h2>

                <p>
                  Items you are currently borrowing
                  or lending.
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
                    Loading active loans...
                  </p>
                </div>
              ) : loansError ? (
                <div className="loans-empty-state error">
                  <p>{loansError}</p>
                </div>
              ) : recentActiveLoans.length >
                0 ? (
                recentActiveLoans.map((loan) => {
                  const currentStatus =
                    getLoanStatus(loan);

                  const isBorrowed =
                    String(loan.borrowerId) ===
                      currentUserId ||
                    loan.loanType ===
                      "borrowed";

                  return (
                    <article
                      className="loan-card"
                      key={loan.id}
                    >
                      <span className="loan-item-icon">
                        {loan.icon || "🧰"}
                      </span>

                      <div className="loan-information">
                        <strong>
                          {loan.item ||
                            loan.itemName ||
                            "Equipment"}
                        </strong>

                        <span className="loan-person">
                          {isBorrowed
                            ? `Borrowed from ${
                                loan.ownerName ||
                                loan.person ||
                                "Neighbour"
                              }`
                            : `Lent to ${
                                loan.borrowerName ||
                                loan.person ||
                                "Neighbour"
                              }`}
                        </span>

                        <small className="loan-due-date">
                          Due{" "}
                          {loan.dueDate ||
                            "date not provided"}
                        </small>
                      </div>

                      <span
                        className={`loan-status ${getLoanStatusClass(
                          currentStatus
                        )}`}
                      >
                        {currentStatus}
                      </span>

                      <Link
                        className="loan-options-button"
                        to="/loans"
                        aria-label={`View details for ${
                          loan.item ||
                          loan.itemName ||
                          "loan"
                        }`}
                      >
                        •••
                      </Link>
                    </article>
                  );
                })
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
                      You have no borrowed or lent
                      items at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Listings and reminder */}
          <div className="listings-reminder-layout">
            {/* My Listings */}
            <section className="listings-panel">
              <div className="panel-heading">
                <div>
                  <h2>My Listings</h2>

                  <p>
                    Your recently added tools and
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
                {recentListings.length > 0 ? (
                  recentListings.map((item) => (
                    <article
                      className="listing-card"
                      key={item.id}
                    >
                      <div className="listing-image">
                        <span>
                          {item.icon || "🧰"}
                        </span>

                        <Link
                          className="listing-options-button"
                          to="/listings"
                          aria-label={`View options for ${item.name}`}
                        >
                          •••
                        </Link>
                      </div>

                      <div className="listing-information">
                        <strong>
                          {item.name}
                        </strong>

                        <span className="item-condition">
                          {item.condition}
                        </span>

                        <small
                          className={`availability-status ${
                            item.statusColor ||
                            item.availability
                              ?.toLowerCase()
                              .replaceAll(
                                " ",
                                "-"
                              ) ||
                            ""
                          }`}
                        >
                          <span className="status-dot" />

                          {item.availability ||
                            "Unknown"}
                        </small>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="listings-empty-state">
                    <p>
                      You have not added any items
                      yet.
                    </p>

                    <Link
                      className="primary-button"
                      to="/items/new"
                    >
                      Add Your First Item
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Return reminder */}
            {returnReminderLoan ? (
  <aside
    className={`return-reminder ${getLoanStatusClass(
      getLoanStatus(returnReminderLoan)
    )}`}
  >
    <span className="reminder-icon">
      !
    </span>

    <div className="reminder-information">
      <small>RETURN REMINDER</small>

      <strong>
        {returnReminderLoan.item ||
          returnReminderLoan.itemName ||
          "Borrowed Item"}
      </strong>

      <p>
        Return to{" "}
        {returnReminderLoan.ownerName ||
          returnReminderLoan.person ||
          "the item owner"}{" "}
        by{" "}
        <b>
          {formatReminderDate(
            returnReminderLoan.dueDate
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
      <small>RETURN REMINDER</small>

      <strong>No items due</strong>

      <p>
        You have no borrowed items to return.
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
    </div>
  );
}

export default Dashboard;
