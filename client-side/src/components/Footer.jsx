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
            <li><Link to="/about">About / Our Mission</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/guidelines">Community Guidelines</Link></li>
            <li><Link to="/report">Report an Issue / Tool</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/liability">Liability & Damage Policy</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Stay Updated</h4>
          <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">X</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
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
