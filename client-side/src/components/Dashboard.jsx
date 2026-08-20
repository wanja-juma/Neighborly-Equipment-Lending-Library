import { useState } from "react";
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
    borrower: "John Kamau",
    item: "Electric Drill",
    startDate: "22 Aug",
    endDate: "24 Aug",
    avatarColor: "orange",
  },
  {
    id: 2,
    initials: "AN",
    borrower: "Amina Noor",
    item: "Garden Mower",
    startDate: "25 Aug",
    endDate: "27 Aug",
    avatarColor: "green",
  },
  {
    id: 3,
    initials: "PO",
    borrower: "Peter Otieno",
    item: "Extension Ladder",
    startDate: "28 Aug",
    endDate: "30 Aug",
    avatarColor: "blue",
  },
];

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

  const currentDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

  const navigationItems = [
    "Dashboard",
    "Browse Items",
    "My Listings",
    "Requests",
    "Loans",
    "Damage Reports",
  ];

  return (
    <div className="neighborly-app">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">N</span>
          <span className="logo-text">Neighborly</span>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-navigation">
          {navigationItems.map((item) => (
            <button
              key={item}
              type="button"
              className={
                activePage === item
                  ? "navigation-link active"
                  : "navigation-link"
              }
              onClick={() => setActivePage(item)}
            >
              <span className="navigation-icon">○</span>
              <span>{item}</span>
            </button>
          ))}
        </nav>

        {/* Community information */}
        <div className="community-card">
          <span className="community-icon">⌂</span>

          <div>
            <small>Your community</small>
            <strong>Greenview Estate</strong>
          </div>
        </div>

        <button className="logout-button" type="button">
          Log out
        </button>
      </aside>

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
  {/* Welcome section */}
  <div className="welcome-row">
    <div className="welcome-message">
      <p className="current-date">{currentDate}</p>

      <h1>Welcome back, Wanja!</h1>

      <p className="welcome-description">
        Here is what is happening in your community today.
      </p>
    </div>

    <button className="primary-button" type="button">
      <span className="button-icon">+</span>
      Add New Item
    </button>
  </div>

  {/* Summary cards */}
  <section
    className="summary-grid"
    aria-label="Dashboard summary"
  >
    {summaryCards.map((card) => (
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
<section className="requests-panel">
  <div className="panel-heading">
    <div>
      <h2>Borrowing Requests</h2>
      <p>Review requests from neighbours who want to borrow your items.</p>
    </div>

    <button className="view-all-button" type="button">
      View All
    </button>
  </div>

  <div className="requests-list">
    {requests.map((request) => (
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
          <button className="decline-button" type="button">
            Decline
          </button>

          <button className="approve-button" type="button">
            Approve
          </button>
        </div>
      </article>
    ))}
  </div>
</section>

</section>
      </main>
    </div>
  );
}

export default Dashboard;
