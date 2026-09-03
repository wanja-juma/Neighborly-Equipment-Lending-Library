import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Neighborly</h4>
          <p className="footer-tagline">Borrow better, together.</p>
          <p className="footer-community">Serving your street & estate community</p>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/browse-tools">Browse Tools</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Account</h4>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/listings">My Listings</Link></li>
            <li><Link to="/requests">Requests</Link></li>
            <li><Link to="/loans">Loans</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><Link to="/damage-reports">Report an Issue / Tool</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/liability">Liability & Damage Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Stay Updated</h4>
          <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">X</a>
            <a href="#" aria-label="Instagram">IG</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Neighborly. All rights reserved.</p>
        <p className="footer-credits">Built by the Neighborly team — Moringa School project</p>
      </div>
    </footer>
  );
}

export default Footer;
