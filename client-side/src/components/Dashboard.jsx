import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

import useItems from "../hooks/useItems";
import useLoans from "../hooks/useLoans";
import useRequests from "../hooks/useRequests";
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

const normalizeCollection = (
  value,
  property
) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.[property])) {
    return value[property];
  }

  return [];
};

const getItemName = (record) => {
  if (record.itemName) {
    return record.itemName;
  }

  if (record.item_name) {
    return record.item_name;
  }

  if (record.item?.name) {
    return record.item.name;
  }

  if (typeof record.item === "string") {
    return record.item;
  }

  return "Equipment";
};

const getPersonName = (
  directName,
  person,
  fallback = "Neighbour"
) => {
  if (directName) {
    return directName;
  }

  if (person?.name) {
    return person.name;
  }

  if (person?.profile) {
    const fullName = [
      person.profile.first_name,
      person.profile.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    if (fullName) {
      return fullName;
    }
  }

  if (typeof person === "string") {
    return person;
  }

  return fallback;
};

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

  const [notice, setNotice] =
    useState("");

  const [currentUser, setCurrentUser] =
    useState(null);

  const [userLoading, setUserLoading] =
    useState(true);

  const [userError, setUserError] =
    useState("");

  const safeItems = normalizeCollection(
    items,
    "items"
  );

  const safeRequests =
    normalizeCollection(
      borrowingRequests,
      "borrowingRequests"
    );

  const safeLoans = normalizeCollection(
    loans,
    "loans"
  );

  const currentUserId = String(
    currentUser?.id || ""
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token =
        localStorage.getItem(
          "neighborlyToken"
        ) ||
        localStorage.getItem(
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
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Unable to load user information."
          );
        }

        setCurrentUser(
          data.user || data
        );
      } catch (error) {
        setUserError(
          error.message ||
            "Unable to load user information."
        );
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const myItems = safeItems.filter(
    (item) => {
      const ownerId =
        item.ownerId ??
        item.owner_id ??
        item.owner?.id;

      return (
        String(ownerId) ===
        currentUserId
      );
    }
  );

  const recentListings =
    myItems.slice(0, 3);

  const pendingRequests =
    safeRequests.filter((request) => {
      const status = String(
        request.status || ""
      ).toLowerCase();

      const ownerId =
        request.ownerId ??
        request.owner_id ??
        request.item?.ownerId ??
        request.item?.owner_id;

      const direction = String(
        request.requestType ??
        request.direction ??
        request.type ??
        ""
      ).toLowerCase();

      return (
        status === "pending" &&
        (String(ownerId) ===
          currentUserId ||
          direction === "incoming")
      );
    });

  const recentPendingRequests =
    pendingRequests.slice(0, 3);

  const activeLoans = safeLoans.filter(
    (loan) =>
      getLoanStatus(loan) !== "Returned"
  );

  const borrowedLoans =
    activeLoans.filter((loan) => {
      const borrowerId =
        loan.borrowerId ??
        loan.borrower_id ??
        loan.borrower?.id;

      return (
        String(borrowerId) ===
          currentUserId ||
        loan.loanType === "borrowed"
      );
    });

  const lentLoans =
    activeLoans.filter((loan) => {
      const ownerId =
        loan.ownerId ??
        loan.owner_id ??
        loan.owner?.id ??
        loan.item?.ownerId ??
        loan.item?.owner_id;

      return (
        String(ownerId) ===
          currentUserId ||
        loan.loanType === "lent"
      );
    });

  const recentActiveLoans =
    activeLoans.slice(0, 3);

  const returnReminderLoan = [
    ...borrowedLoans,
  ]
    .filter((loan) => {
      const dueDateValue =
        loan.dueDate ??
        loan.due_date;

      if (!dueDateValue) {
        return false;
      }

      const dueDate = new Date(
        dueDateValue
      );

      return !Number.isNaN(
        dueDate.getTime()
      );
    })
    .sort((firstLoan, secondLoan) => {
      const firstDueDate = new Date(
        firstLoan.dueDate ??
          firstLoan.due_date
      );

      const secondDueDate = new Date(
        secondLoan.dueDate ??
          secondLoan.due_date
      );

      return (
        firstDueDate -
        secondDueDate
      );
    })[0];

  const getReturnReminderText = (
    loan
  ) => {
    const dueDateValue =
      loan?.dueDate ??
      loan?.due_date;

    if (!dueDateValue) {
      return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(
      dueDateValue
    );

    if (
      Number.isNaN(
        dueDate.getTime()
      )
    ) {
      return "";
    }

    dueDate.setHours(0, 0, 0, 0);

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const daysRemaining =
      Math.round(
        (dueDate - today) /
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
      return "due today";
    }

    if (daysRemaining === 1) {
      return "due tomorrow";
    }

    return `due in ${daysRemaining} days`;
  };

  const formatReminderDate = (
    dueDateValue
  ) => {
    if (!dueDateValue) {
      return "Date unavailable";
    }

    const dueDate = new Date(
      dueDateValue
    );

    if (
      Number.isNaN(
        dueDate.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(dueDate);
  };

  const getLoanStatusClass = (
    status
  ) => {
    return String(
      status || "On Track"
    )
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  const dashboardSummary =
    summaryCards.map((card) => {
      if (
        card.title === "My Listings"
      ) {
        return {
          ...card,
          value: myItems.length,
        };
      }

      if (
        card.title ===
        "Pending Requests"
      ) {
        return {
          ...card,
          value: pendingRequests.length,
        };
      }

      if (
        card.title ===
        "Items Borrowed"
      ) {
        return {
          ...card,
          value: borrowedLoans.length,
        };
      }

      if (
        card.title ===
        "Items Lent Out"
      ) {
        return {
          ...card,
          value: lentLoans.length,
        };
      }

      return card;
    });

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

  const handleRequest = async (
    requestId,
    newStatus
  ) => {
    setNotice("");

    try {
      const result =
        await updateRequestStatus(
          requestId,
          newStatus
        );

      setNotice(
        result?.message ||
          `Request ${newStatus.toLowerCase()} successfully.`
      );
    } catch (error) {
      setNotice(
        error.message ||
          "Unable to update request."
      );
    }
  };

  const firstName =
    currentUser?.profile?.first_name ||
    currentUser?.firstName ||
    currentUser?.first_name ||
    "Neighbor";

  const lastName =
    currentUser?.profile?.last_name ||
    currentUser?.lastName ||
    currentUser?.last_name ||
    "";

  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "N";

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
              <p
                className="user-error"
                role="alert"
              >
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
                <strong>
                  {card.value}
                </strong>

                <span>{card.title}</span>
              </div>

              <span className="summary-arrow">
                ›
              </span>
            </article>
          ))}
        </section>

        <div className="dashboard-panels">
          <section className="requests-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  Borrowing Requests
                </h2>

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
                    Loading borrowing
                    requests...
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
                        .map(
                          (name) => name[0]
                        )
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
                          {requestInitials}
                        </span>

                        <div className="request-information">
                          <strong>
                            {borrowerName}
                          </strong>

                          <span className="request-description">
                            wants to borrow{" "}
                            <b>
                              {getItemName(
                                request
                              )}
                            </b>
                          </span>

                          <small className="request-dates">
                            {request.startDate ??
                              request.start_date ??
                              "Date not provided"}{" "}
                            –{" "}
                            {request.endDate ??
                              request.end_date ??
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

                const borrowerId =
                  loan.borrowerId ??
                  loan.borrower_id ??
                  loan.borrower?.id;

                const isBorrowed =
                  String(borrowerId) ===
                    currentUserId ||
                  loan.loanType ===
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

                const personName =
                  getPersonName(
                    loan.person,
                    null
                  );

                const loanItemName =
                  getItemName(loan);

                const dueDate =
                  loan.dueDate ??
                  loan.due_date ??
                  "date not provided";

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
                        {loanItemName}
                      </strong>

                      <span className="loan-person">
                        {isBorrowed
                          ? `Borrowed from ${
                              ownerName !==
                              "Neighbour"
                                ? ownerName
                                : personName
                            }`
                          : `Lent to ${
                              borrowerName !==
                              "Neighbour"
                                ? borrowerName
                                : personName
                            }`}
                      </span>

                      <small className="loan-due-date">
                        Due {dueDate}
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
                      aria-label={`View details for ${loanItemName}`}
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

        <div className="listings-reminder-layout">
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
                        {item.name ||
                          "Equipment"}
                      </strong>

                      <span className="item-condition">
                        {item.condition ||
                          "Unknown"}
                      </span>

                      <small
                        className={`availability-status ${
                          item.statusColor ||
                          String(
                            item.availability ||
                              ""
                          )
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            )
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

          {returnReminderLoan ? (
            <aside
              className={`return-reminder ${getLoanStatusClass(
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
                    returnReminderLoan.ownerName ??
                      returnReminderLoan.owner_name,
                    returnReminderLoan.owner,
                    returnReminderLoan.person ||
                      "the item owner"
                  )}{" "}
                  by{" "}
                  <b>
                    {formatReminderDate(
                      returnReminderLoan.dueDate ??
                        returnReminderLoan.due_date
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
                  You have no borrowed items to
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