import { useState } from "react";
import { Link } from "react-router-dom";
import useItems from "../hooks/useItems";
import useRequests from "../hooks/useRequests";
import useLoans from "../hooks/useLoans";
import getLoanStatus from "../utils/getLoanStatus";
import "./Dashboard.css";

const summaryCards = [
  {
    id: 1,
    title: "My Listings",
    value: 12,
    icon: "▦",
    color: "green",
  },
  {
    id: 2,
    title: "Pending Requests",
    value: 3,
    icon: "◷",
    color: "orange",
  },
  {
    id: 3,
    title: "Items Borrowed",
    value: 2,
    icon: "↓",
    color: "blue",
  },
  {
    id: 4,
    title: "Items Lent Out",
    value: 4,
    icon: "↑",
    color: "purple",
  },
];

function Dashboard() {

    const { items } = useItems();

    const myItems = items.filter((item) => item.ownerId === "1");

    const recentListings = myItems.slice(0, 3);
    
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

   const activeLoans = loans.filter(
  (loan) =>
    getLoanStatus(loan) !== "Returned"
);

const borrowedLoans = activeLoans.filter(
  (loan) =>
    String(loan.borrowerId) === "1" ||
    loan.loanType === "borrowed"
);

const lentLoans = activeLoans.filter(
  (loan) =>
    String(loan.ownerId) === "1" ||
    loan.loanType === "lent"
);

const recentActiveLoans = activeLoans.slice(
  0,
  3
);

const getLoanStatusClass = (loan) => {
  if (loan.statusColor) {
    return loan.statusColor;
  }

  return (loan.status || "On Track")
    .toLowerCase()
    .replaceAll(" ", "-");
};

    const [notice, setNotice] = useState("");
    const pendingRequests = borrowingRequests.filter(
        (request) =>
        request.status?.toLowerCase() === "pending"
    );
    const recentPendingRequests =
        pendingRequests.slice(0, 3);

    const dashboardSummary = summaryCards.map(
  (card) => {
    if (card.title === "Pending Requests") {
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

    const currentDate = new Intl.DateTimeFormat("en-GB", {
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

  return (
    <div className="neighborly-app">
      
      {/* Main dashboard area */}
      <main className="dashboard-main">
        {/* Top navigation bar */}
        <header className="top-navigation">
          {/* Search bar */}
          <label className="search-bar">
            <span className="search-icon">⌕</span>

            <input
              type="search"
              placeholder="Search items or neighbours..."
              aria-label="Search items or neighbours"
            />
          </label>

          {/* Profile section */}
          <div className="top-navigation-actions">
            <button
              className="notification-button"
              type="button"
              aria-label="View notifications"
            >
              ♢
              <span className="notification-indicator"></span>
            </button>

            <div className="profile">
              <span className="profile-avatar">WJ</span>

              <div className="profile-details">
                <strong>Wanja Juma</strong>
                <small>Member</small>
              </div>

              <span className="profile-arrow">⌄</span>
            </div>
          </div>
        </header>

 {/* Dashboard content will be added in the next step */}
        
<section className="dashboard-content">
  {notice && (
    <div className="request-notice" role="status">
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
      <p className="current-date">{currentDate}</p>

      <h1>Welcome back, Wanja!</h1>

      <p className="welcome-description">
        Here is what is happening in your community today.
      </p>
    </div>

    <Link className="primary-button" to="/items/new">
        <span className="button-icon">+</span>
        Add New Item
    </Link>
  </div>

  {/* Summary cards */}
<section
    className="summary-grid"
    aria-label="Dashboard summary">
    {dashboardSummary.map((card) => (
      <article className="summary-card" key={card.id}>
        <span className={`summary-icon ${card.color}`}>
          {card.icon}
        </span>

        <div className="summary-information">
          <strong>{card.value}</strong>
          <span>{card.title}</span>
        </div>

        <span className="summary-arrow">›</span>
      </article>
    ))}
  </section>

  {/* Borrowing requests section */}
<div className="dashboard-panels">
  <section className="requests-panel">
    <div className="panel-heading">
      <div>
        <h2>Borrowing Requests</h2>

        <p>
          Review requests from neighbours who want to
          borrow your items.
        </p>
      </div>

      <Link
        className="view-all-button"
        to="/requests"
      >
        View All
      </Link>
    </div>

    {notice && (
      <p className="request-notice" role="status">
        {notice}
      </p>
    )}

    <div className="requests-list">
      {requestsLoading ? (
        <div className="requests-empty-state">
          <p>Loading borrowing requests...</p>
        </div>
      ) : requestsError ? (
        <div className="requests-empty-state error">
          <p>{requestsError}</p>
        </div>
      ) : recentPendingRequests.length > 0 ? (
        recentActiveLoans.map((loan) => {
  const currentStatus =
    getLoanStatus(loan);

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
          {loan.loanType === "borrowed" ||
          String(loan.borrowerId) === "1"
            ? `Borrowed from ${
                loan.person ||
                loan.ownerName ||
                "Neighbour"
              }`
            : `Lent to ${
                loan.person ||
                loan.borrowerName ||
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
})  (
        <div className="requests-empty-state">
          <span className="empty-state-icon">
            ✓
          </span>

          <div>
            <strong>All requests reviewed</strong>

            <p>
              You have no pending borrowing requests.
            </p>
          </div>
        </div>
      )}
    </div>
  </section>
</div>


{/* Active loans section */}
<section className="loans-panel">
  <div className="panel-heading">
    <div>
      <h2>Active Loans</h2>

      <p>
        Items you are currently borrowing or
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
        <p>Loading active loans...</p>
      </div>
    ) : loansError ? (
      <div className="loans-empty-state error">
        <p>{loansError}</p>
      </div>
    ) : recentActiveLoans.length > 0 ? (
      recentActiveLoans.map((loan) => (
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
              {loan.loanType === "borrowed" ||
              String(loan.borrowerId) === "1"
                ? `Borrowed from ${
                    loan.person ||
                    loan.ownerName ||
                    "Neighbour"
                  }`
                : `Lent to ${
                    loan.person ||
                    loan.borrowerName ||
                    "Neighbour"
                  }`}
            </span>

            <small className="loan-due-date">
              Due{" "}
              {loan.dueDate || "date not provided"}
            </small>
          </div>

          <span
            className={`loan-status ${getLoanStatusClass(
              loan
            )}`}
          >
            {loan.status || "On Track"}
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
      ))
    ) 
    : (
      <div className="loans-empty-state">
        <span className="empty-state-icon">
          ✓
        </span>

        <div>
          <strong>No active loans</strong>

          <p>
            You have no borrowed or lent items at
            the moment.
          </p>
        </div>
      </div>
    )}
  </div>
</section>


{/* Listings and reminder section */}
<div className="listings-reminder-layout">
  {/* My Listings section */}
  <section className="listings-panel">
    <div className="panel-heading">
      <div>
        <h2>My Listings</h2>
        <p>Your recently added tools and equipment.</p>
      </div>

    <Link className="view-all-button" to="/listings">
        View All
    </Link>

    </div>

    <div className="listings-grid">
      {recentListings.map((item) => (
        <article className="listing-card" key={item.id}>
          <div className="listing-image">
            <span>{item.icon}</span>

            <button
              className="listing-options-button"
              type="button"
              aria-label={`View options for ${item.name}`}
            >
              •••
            </button>
          </div>

          <div className="listing-information">
            <strong>{item.name}</strong>

            <span className="item-condition">
              {item.condition}
            </span>

            <small
              className={`availability-status ${item.statusColor}`}
            >
              <span className="status-dot"></span>
              {item.availability}
            </small>
          </div>
        </article>
      ))}
    </div>
  </section>

  {/* Return reminder */}
  <aside className="return-reminder">
    <span className="reminder-icon">!</span>

    <div className="reminder-information">
      <small>RETURN REMINDER</small>

      <strong>Socket Wrench Set</strong>

      <p>
        Return to Mary Njeri by <b>tomorrow</b>.
      </p>
    </div>

    <button className="view-loan-button" type="button">
      View Loan
    </button>
  </aside>
</div>

</section>
</main>
</div>
  );
}

export default Dashboard;
