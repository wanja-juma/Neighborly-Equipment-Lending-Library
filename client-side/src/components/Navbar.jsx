import {
  House,
  Wrench,
  Info,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const {
    currentUser,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  const firstName =
  currentUser?.profile?.first_name ||
  currentUser?.firstName ||
  currentUser?.first_name ||
  "";

const lastName =
  currentUser?.profile?.last_name ||
  currentUser?.lastName ||
  currentUser?.last_name ||
  "";

const fullName =
  currentUser?.name ||
  [firstName, lastName]
    .filter(Boolean)
    .join(" ") ||
  currentUser?.email ||
  "Member";

const userInitials =
  [firstName, lastName]
    .filter(Boolean)
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() ||
  fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ||
  "U";

  return (
    <nav className="navbar">
      <Link
        className="navbar__logo"
        to="/"
      >
        <House size={26} />
        <span>Neighborly</span>
      </Link>

      <div className="navbar__links">

      <Link // this makes the home navbar link scroll to the top of the page when clicked (made hand in hand with the about feature).
        to="/"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <House size={18} />
        Home
      </Link>

        <Link to="/#about">
          <Info size={18} />
          About
        </Link>

        <Link to="/browse-tools">
          <Wrench size={18} />
          Browse Tools
        </Link>

       <Link to="/dashboard">
  <LayoutDashboard size={18} />
  Dashboard
</Link>
      </div>

      <div className="navbar__actions">
        {currentUser ? (
          <div className="navbar-user">
            <span className="navbar-user-avatar">
              {userInitials || "U"}
            </span>

            <div className="navbar-user-details">
              <strong>
  {fullName}
</strong>

              <small>
                {currentUser.role || "Member"}
              </small>
            </div>

            <button
              className="navbar-logout-button"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        ) : (
          <div className="navbar-auth-links">
            <Link
              className="navbar__login"
              to="/auth?mode=login"
            >
              <LogIn size={18} />
              Login
            </Link>

            <Link
              className="navbar__register"
              to="/auth?mode=register"
            >
              <UserPlus size={18} />
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;