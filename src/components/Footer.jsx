import { Link } from "react-router-dom";
import { ArrowUp, Mail, MapPin, ShieldCheck } from "lucide-react";
import "./Footer.css";

/* Edit these details to show your real location in the footer. */
const OFFICE = {
  name: "DigiGold Office",
  lines: ["Your street address", "City, State - PIN code"],
  mapQuery: "Your street address, City, State",
};

const MAP_QUERY = encodeURIComponent(OFFICE.mapQuery);

export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span>◆</span> Digi<span>Gold</span>
          </Link>

          <p>
            Digital gold made simple. Deposit, buy, sell and track your holdings
            in one place.
          </p>

          <a href="mailto:support@digigold.com" className="footer__mail">
            <Mail size={16} />
            support@digigold.com
          </a>
        </div>

        <nav className="footer__col" aria-label="Explore">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/buy-sell">Buy / Sell</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/transactions">Transactions</Link>
        </nav>

        <nav className="footer__col" aria-label="Account and support">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-deposits">My deposits</Link>

          <h4 className="footer__col-gap">Support</h4>
          <Link to="/help">Help center</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of use</Link>
        </nav>

        <div className="footer__col footer__location">
          <h4>Visit us</h4>

          <address>
            <MapPin size={16} />
            <span>
              <strong>{OFFICE.name}</strong>
              {OFFICE.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </address>

          <iframe
            title={`Map showing ${OFFICE.name}`}
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </div>
      </div>

      <div className="footer__risk">
        <ShieldCheck size={18} />
        <p>
          DigiGold is a demo platform. Prices shown are illustrative, not live
          quotes. Gold prices are subject to market risk, so please read all
          terms before investing.
        </p>
      </div>

      <div className="footer__wordmark" aria-hidden="true">
        DigiGold
      </div>

      <div className="footer__bottom">
        <p>© {year} DigiGold. All rights reserved.</p>

        <button
          type="button"
          className="footer__top"
          onClick={backToTop}
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}
