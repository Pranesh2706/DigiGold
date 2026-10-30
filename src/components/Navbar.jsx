import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home" },
  { to: "/buy-sell", label: "Buy / Sell" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/transactions", label: "Transactions" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo" onClick={close}>
          <span className="nav__logo-icon">◆</span> Digi<span>Gold</span>
        </Link>

        <nav className={`nav__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={close}
              className={({ isActive }) =>
                `nav__link ${isActive ? "is-active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <div className="nav__rate" title="Live gold rate (24K / gram)">
            <span className="nav__dot" /> ₹7,450/g
          </div>
          <Link to="/login" className="nav__btn" onClick={close}>
            Login
          </Link>
          <button
            className="nav__burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
