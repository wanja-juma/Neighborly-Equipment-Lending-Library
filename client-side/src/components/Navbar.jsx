import { House, Wrench, Info, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <House size={26} />
        <span>Neighborly</span>
      </div>

      <div className="navbar__links">
        <a href="/">
          <House size={18} />
          Home
        </a>

        <a href="/tools">
          <Wrench size={18} />
          Browse Tools
        </a>

        <a href="/about">
          <Info size={18} />
          About
        </a>

        <a href="/dashboard">
          <LayoutDashboard size={18} />
          Dashboard
        </a>
      </div>

      <div className="navbar__actions">
        <a href="/login" className="navbar__login">
          <LogIn size={18} />
          Login
        </a>

        <a href="/register" className="navbar__register">
          <UserPlus size={18} />
          Register
        </a>
      </div>
    </nav>
  );
}

export default Navbar;