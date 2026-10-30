import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import {
  ShieldCheck,
  TrendingUp,
  Wallet,
  Clock3,
  Coins,
  Smartphone,
  ChartNoAxesCombined,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import BuySell from "./Pages/BuySell";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import MyDeposits from "./Pages/MyDeposits";
import AdminDeposits from "./Pages/AdminDeposits";
import Portfolio from "./Pages/Portfolio";
import Transactions from "./Pages/Transactions";

import heroImg from "./assets/img1.jpg";

import "./App.css";

function Home() {
  return (
    <div className="dg-home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__text">
          <span className="hero__tag">Digital gold deposits</span>

          <h1>Your gold, kept in plain sight.</h1>

          <p>
            Submit a deposit, follow every status update, and see your holdings
            in one clear portfolio.
          </p>

          <div className="hero__actions">
            <Link to="/buy-sell" className="btn btn--primary">
              Explore gold
            </Link>

            <Link to="/my-deposits" className="btn btn--ghost">
              My deposits
            </Link>
          </div>

          <div className="hero__trust">
            <div>
              <ShieldCheck size={18} />
              <span>Transparent tracking</span>
            </div>

            <div>
              <Clock3 size={18} />
              <span>Convenient access</span>
            </div>
          </div>
        </div>

        <div className="hero__img">
          <img src={heroImg} alt="Gold investment with DigiGold" />

          <div className="hero__tracker" aria-label="Sample deposit status">
            <div className="tracker__head">
              <span>Sample deposit</span>
              <b>In review</b>
            </div>

            <div className="tracker__weight">
              12.500 g <small>22K</small>
            </div>

            <div className="tracker__bar" aria-hidden="true">
              <i />
            </div>

            <ol className="tracker__steps">
              <li className="is-done">Submitted</li>
              <li className="is-done">Reviewed</li>
              <li>Credited</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="dg-features">
        <div className="dg-section-heading">
          <h2>Everything about your gold, in one place.</h2>
          <p>
            DigiGold keeps your deposits, statuses and holdings organised, so
            you always know where things stand.
          </p>
        </div>

        <div className="bento">
          <article className="bento__card bento__card--portfolio">
            <div className="bento__icon">
              <ChartNoAxesCombined size={24} />
            </div>

            <h3>See your whole portfolio at a glance</h3>
            <p>
              Total gold deposited, verified pure gold and a breakdown by
              purity, all in one view.
            </p>

            <div className="bento__viz" aria-hidden="true">
              <div className="donut" />
              <ul className="viz-legend">
                <li>
                  <i style={{ background: "#e5ca8d" }} />
                  24K
                </li>
                <li>
                  <i style={{ background: "#c9a45c" }} />
                  22K
                </li>
                <li>
                  <i style={{ background: "#7c5c22" }} />
                  18K
                </li>
              </ul>
              <span className="viz-note">Illustration</span>
            </div>
          </article>

          <article className="bento__card bento__card--manage">
            <div className="bento__icon">
              <Coins size={24} />
            </div>
            <h3>Gold management</h3>
            <p>
              Keep every gold deposit record organised, from weight and purity
              to deposit method.
            </p>
          </article>

          <article className="bento__card">
            <div className="bento__icon">
              <ShieldCheck size={24} />
            </div>
            <h3>Clear tracking</h3>
            <p>Follow each recorded update on your deposit.</p>
          </article>

          <article className="bento__card">
            <div className="bento__icon">
              <Wallet size={24} />
            </div>
            <h3>Easy access</h3>
            <p>Your activity and account details, one tap away.</p>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="dg-how">
        <div className="dg-section-heading">
          <h2>Three steps from sign-up to tracking.</h2>
          <p>A simple process designed around your convenience.</p>
        </div>

        <ol className="dg-steps">
          <li className="dg-step">
            <div className="dg-step-top">
              <span className="dg-step-number">1</span>
              <div className="dg-step-icon">
                <Smartphone size={24} />
              </div>
            </div>
            <h3>Create your account</h3>
            <p>Register and open your personal DigiGold dashboard.</p>
          </li>

          <li className="dg-step">
            <div className="dg-step-top">
              <span className="dg-step-number">2</span>
              <div className="dg-step-icon">
                <Coins size={24} />
              </div>
            </div>
            <h3>Submit a deposit</h3>
            <p>
              Enter your gold details and choose your preferred deposit method.
            </p>
          </li>

          <li className="dg-step">
            <div className="dg-step-top">
              <span className="dg-step-number">3</span>
              <div className="dg-step-icon">
                <TrendingUp size={24} />
              </div>
            </div>
            <h3>Track your progress</h3>
            <p>Watch the status updates recorded for your deposit request.</p>
          </li>
        </ol>
      </section>

      {/* CTA */}
      <section className="dg-cta-wrap">
        <div className="dg-cta">
          <div>
            <h2>Start with your first deposit.</h2>
            <p>Create your DigiGold account and explore the platform.</p>
          </div>

          <Link to="/register" className="btn btn--primary">
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}

function Page({ title }) {
  return (
    <div className="app">
      <h2>{title}</h2>
      <Link to="/" className="btn btn--primary">
        Back to home
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/buy-sell" element={<BuySell />} />
        <Route path="/my-deposits" element={<MyDeposits />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/transactions" element={<Transactions />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/deposits" element={<AdminDeposits />} />

        <Route
          path="/new-deposit"
          element={<Page title="Please create deposits from My Deposits" />}
        />

        <Route path="/help" element={<Page title="Help center" />} />
        <Route path="/privacy" element={<Page title="Privacy policy" />} />
        <Route path="/terms" element={<Page title="Terms of use" />} />

        <Route path="*" element={<Page title="Page not found" />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
