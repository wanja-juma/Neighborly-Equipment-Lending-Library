import { House, Wrench, Info, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
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

        <Link to="/tools">
          <Wrench size={18} />
          Browse Tools
        </Link>

        <Link to="/about">
          <Info size={18} />
          About
        </Link>

        <Link to="/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
      </div>

      <div className="navbar__actions">
        <Link to="/login" className="navbar__login">
          <LogIn size={18} />
          Login
        </Link>

        <Link to="/register" className="navbar__register">
          <UserPlus size={18} />
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;