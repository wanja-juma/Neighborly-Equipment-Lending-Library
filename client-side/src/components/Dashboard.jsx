import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");

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
          <h1>{activePage}</h1>
          <p>Manage your community lending activities.</p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
