import { useState } from "react";
import { Link } from "react-router-dom";
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

const requests = [
  {
    id: 1,
    initials: "JK",
    borrower: "Frank Kamau",
    item: "Electric Drill",
    startDate: "22 Aug",
    endDate: "24 Aug",
    avatarColor: "orange",
  },
  {
    id: 2,
    initials: "SM",
    borrower: "Tonny Mwangi",
    item: "Cordless Screwdriver",
    startDate: "23 Aug",
    endDate: "25 Aug",
    avatarColor: "blue",
  },
  {
    id: 3,
    initials: "AN",
    borrower: "Amina Noor",
    item: "Garden Mower",
    startDate: "25 Aug",
    endDate: "27 Aug",
    avatarColor: "green",
  },
  {
    id: 4,
    initials: "PO",
    borrower: "Peter Otieno",
    item: "Extension Ladder",
    startDate: "28 Aug",
    endDate: "30 Aug",
    avatarColor: "blue",
  },
];

const loans = [
  {
    id: 1,
    icon: "🔧",
    item: "Socket Wrench Set",
    loanType: "borrowed",
    person: "Mary Njeri",
    dueDate: "21 Aug",
    status: "Due Soon",
    statusColor: "warning",
  },
  {
    id: 2,
    icon: "🪜",
    item: "Extension Ladder",
    loanType: "lent",
    person: "David Kimani",
    dueDate: "25 Aug",
    status: "On Track",
    statusColor: "success",
  },
  {
    id: 3,
    icon: "🧰",
    item: "Tool Box",
    loanType: "lent",
    person: "Grace Wambui",
    dueDate: "17 Aug",
    status: "Overdue",
    statusColor: "danger",
  },
];

const listings = [
  {
    id: 1,
    icon: "🔩",
    name: "Electric Drill",
    condition: "Good condition",
    availability: "Available",
    statusColor: "available",
  },
  {
    id: 2,
    icon: "🌿",
    name: "Garden Mower",
    condition: "Excellent condition",
    availability: "Requested",
    statusColor: "requested",
  },
  {
    id: 3,
    icon: "🪚",
    name: "Circular Saw",
    condition: "Good condition",
    availability: "On Loan",
    statusColor: "on-loan",
  },
];

function Dashboard() {

  
  const [pendingRequests, setPendingRequests] = useState(requests);
  const [notice, setNotice] = useState("");

  const dashboardSummary = summaryCards.map((card) =>
    card.title === "Pending Requests"
      ? { ...card, value: pendingRequests.length }
      : card
  );

  const currentDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

  const handleRequest = (id, action) => {
  const selected = pendingRequests.find(
    (request) => request.id === id
  );

  if (!selected) {
    return;
  }

  setPendingRequests((currentRequests) =>
    currentRequests.filter((request) => request.id !== id)
  );

  setNotice(`${selected.item} request ${action}.`);
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
      <p>Review requests from neighbours who want to borrow your items.</p>
    </div>

    <Link className="view-all-button" to="/requests">
        View All
    </Link>

  </div>

  <div className="requests-list">
   {pendingRequests.length > 0 ? (
    pendingRequests.map((request) => (
      <article className="request-card" key={request.id}>
        <span
          className={`borrower-avatar ${request.avatarColor}`}
        >
          {request.initials}
        </span>

        <div className="request-information">
          <strong>{request.borrower}</strong>

          <span className="request-description">
            wants to borrow <b>{request.item}</b>
          </span>

          <small className="request-dates">
            {request.startDate} – {request.endDate}
          </small>
        </div>

        <div className="request-buttons">
          <button
            className="decline-button"
            type="button"
            onClick={() =>
              handleRequest(request.id, "declined")
            }
          >
            Decline
          </button>

          <button
            className="approve-button"
            type="button"
            onClick={() =>
              handleRequest(request.id, "approved")
            }
          >
            Approve
          </button>
        </div>
      </article>
    ))
  ) : (
    <div className="requests-empty-state">
      <span className="empty-state-icon">✓</span>

      <div>
        <strong>All requests reviewed</strong>
        <p>You have no pending borrowing requests.</p>
      </div>
    </div>
  )}
  </div>
</section>

{/* Active loans section */}
<section className="loans-panel">
  <div className="panel-heading">
    <div>
      <h2>Active Loans</h2>
      <p>Items you are currently borrowing or lending.</p>
    </div>
    <Link className="view-all-button" to="/loans">
        View All
    </Link>
    
  </div>

  <div className="loans-list">
    {loans.map((loan) => (
      <article className="loan-card" key={loan.id}>
        <span className="loan-item-icon">{loan.icon}</span>

        <div className="loan-information">
          <strong>{loan.item}</strong>

          <span className="loan-person">
            {loan.loanType === "borrowed"
              ? `Borrowed from ${loan.person}`
              : `Lent to ${loan.person}`}
          </span>

          <small className="loan-due-date">
            Due {loan.dueDate}
          </small>
        </div>

        <span
          className={`loan-status ${loan.statusColor}`}
        >
          {loan.status}
        </span>

        <button
          className="loan-options-button"
          type="button"
          aria-label={`View options for ${loan.item}`}
        >
          •••
        </button>
      </article>
    ))}
  </div>
</section>
</div>

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
      {listings.map((item) => (
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
