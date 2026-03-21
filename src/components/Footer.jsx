import { Link } from "react-router-dom"
import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        {/* TOP SECTION */}
        <div className="footer-top">
          <div className="footer-col brand">
            <div className="logo">
              ₹ FinPlay<span className="highlight">Bharat</span>
            </div>
            <p className="tagline">
              Transforming financial literacy through gamification for India's youth.
            </p>
            <div className="social-links">
              <span className="social-icon">𝕏</span>
              <span className="social-icon">in</span>
              <span className="social-icon">📷</span>
              <span className="social-icon">📺</span>
              <span className="social-icon">🐙</span>
            </div>
          </div>

          <div className="footer-col">
            <h3>Product</h3>
            <ul>
              <li><Link to="/#features">Features</Link></li>
              <li><Link to="/updates">Updates</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/partners">Partners</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* LEGAL SECTION */}
        <div className="footer-legal">
          <h3>Legal</h3>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/gdpr">GDPR</Link>
          </div>
        </div>

        {/* DISCLAIMER BOX */}
        <div className="disclaimer-box">
          <div className="warning-icon">⚠️</div>
          <p>
            FinPlay Bharat is an educational platform for financial literacy. 
            We provide Gamified financial Knowledge, investment planning, or "How to handle money". 
            All simulations use virtual (Currency/Credits) for learning purposes only.
          </p>
        </div>

        {/* BOTTOM CREDITS */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2026 FinPlay Bharat. Made with ❤️ for India's youth.
          </p>
          <div className="partners-info">
             Supported by Atal Innovation Mission | NITI Aayog
          </div>
          <p className="managed-by">
            Developed & Managed By Eklavya | Dhairya | Jainish | Mahir
          </p>
        </div>
      </div>
    </footer>
  )
}
