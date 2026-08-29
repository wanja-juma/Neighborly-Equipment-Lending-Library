import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Browse Items",
    path: "/items",
  },
  {
    name: "My Listings",
    path: "/listings",
  },
  {
    name: "Requests",
    path: "/requests",
  },
  {
    name: "Loans",
    path: "/loans",
  },
  {
    name: "Damage Reports",
    path: "/damage-reports",
  },
];

function DashboardLayout() {
  return (
    <div className="neighborly-app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">N</span>
          <span className="logo-text">Neighborly</span>
        </div>

        <nav className="sidebar-navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "navigation-link active"
                  : "navigation-link"
              }
            >
              <span className="navigation-icon">○</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

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

      <Outlet />
    </div>
  );
}

export default DashboardLayout;