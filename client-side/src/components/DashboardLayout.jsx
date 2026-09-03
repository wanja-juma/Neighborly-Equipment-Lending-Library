import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

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
  {
    name: "Settings",
    path: "/settings",
  },
  {
    name: "Profile",
    path: "/profile",
  },
];


function DashboardLayout() {
  const {
    logout,
  } = useAuth();

  const navigate =
    useNavigate();


  const handleLogout = () => {
    logout();

    navigate(
      "/auth",
      {
        replace: true,
      }
    );
  };


  return (
    <div className="neighborly-app">

      <aside className="sidebar">

        <div className="logo">
          <span className="logo-icon">
            N
          </span>

          <span className="logo-text">
            Neighborly
          </span>
        </div>


        <nav className="sidebar-navigation">

          {navigationItems.map(
            (item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({
                  isActive,
                }) =>
                  isActive
                    ? "navigation-link active"
                    : "navigation-link"
                }
              >
                <span className="navigation-icon">
                  ○
                </span>

                <span>
                  {item.name}
                </span>
              </NavLink>
            )
          )}


          <span
            className="
              navigation-link
              navigation-link-disabled
            "
            title="Open an approved outgoing request and click Pay Now to make a payment."
          >
            <span className="navigation-icon">
              ○
            </span>

            <span>
              Payments
            </span>
          </span>

        </nav>


        <div className="community-card">
          <span className="community-icon">
            ⌂
          </span>

          <div>
            <small>
              Your community
            </small>

            <strong>
              Greenview Estate
            </strong>
          </div>
        </div>


        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Log out
        </button>

      </aside>

      <Outlet />

    </div>
  );
}


export default DashboardLayout;