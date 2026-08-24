import { useState } from 'react';
import { House, Wrench, Info, LayoutDashboard, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoggedInUser, logoutUser } from '../mockAuth.js';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(getLoggedInUser());
  const navigate = useNavigate();

  function handleLogout() {
    // Added: remove the logged-in user from localStorage
    logoutUser();

    // Added: update the Navbar immediately after logout
    setUser(null);

    // Added: return the user to the home page
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <House size={26} />
        <span>Neighborly</span>
      </div>

      <div className="navbar__links">
        <Link to="/">
          <House size={18} />
          Home
        </Link>

        <Link to="/about">
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
        {!user ? (
          <>
            {/* Added: Login/Register only appear when nobody is logged in */}
            <Link to="/auth" className="navbar__login">
              <LogIn size={18} />
              Login
            </Link>

            <Link to="/auth" className="navbar__register">
              <UserPlus size={18} />
              Register
            </Link>
          </>
        ) : (
          /* Added: Logout replaces Login/Register after authentication */
          <button
            type="button"
            className="navbar__login"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;