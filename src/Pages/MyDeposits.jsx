import { useEffect, useState } from "react";

import {
  Coins,
  CheckCircle2,
  Clock3,
  CalendarDays,
  Scale,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import StatusBadge from "../features/deposit/StatusBadge";
import { getDeposits } from "../features/deposit/depositService";
import DepositGold from "./DepositGold";
import DepositTracking from "./DepositTracking";

import "./MyDeposits.css";

const formatGrams = (value) => {
  return `${(Number(value) || 0).toFixed(4)} g`;
};

export default function MyDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  // FETCH DEPOSITS
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError("");

      const list = await getDeposits();

      setDeposits(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Deposit loading error:", err);
      setError("Unable to load your deposits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // STATISTICS
  const totalWeight = deposits.reduce(
    (sum, d) => sum + (Number(d.weight) || 0),
    0,
  );

  const verifiedGold = deposits.reduce(
    (sum, d) => sum + (Number(d.verifiedPureGrams) || 0),
    0,
  );

  const pendingCount = deposits.filter(
    (d) =>
      !["credited", "completed"].includes(String(d.status || "").toLowerCase()),
  ).length;

  // APPROXIMATE PURE GOLD ESTIMATE
  const getEstimatedPureGold = (deposit) => {
    if (deposit.estimatedPureGrams != null) {
      return formatGrams(deposit.estimatedPureGrams);
    }

    const karat = Number(String(deposit.purity).replace("K", ""));

    if (!karat || !deposit.weight) {
      return "Pending";
    }

    const estimated = (Number(deposit.weight) * karat) / 24;

    return formatGrams(estimated);
  };

  return (
    <div className="mydeposits-page">
      {/* HEADER */}
      <div className="md-header">
        <div>
          <span className="md-eyebrow">YOUR GOLD ACTIVITY</span>

          <h1>My Deposits</h1>

          <p>Manage and track your gold deposit requests.</p>
        </div>

        <button
          type="button"
          className="md-new-btn"
          onClick={() => setShowDeposit(true)}
        >
          + New Deposit
        </button>
      </div>

      {/* STATISTICS */}
      <div className="md-stats">
        <div className="md-stat-card">
          <div className="md-stat-icon gold">
            <Coins size={22} />
          </div>

          <span>Total Deposits</span>

          <h2>{deposits.length}</h2>

          <small>All deposit requests</small>
        </div>

        <div className="md-stat-card">
          <div className="md-stat-icon blue">
            <Scale size={22} />
          </div>

          <span>Total Gold Deposited</span>

          <h2>{formatGrams(totalWeight)}</h2>

          <small>Declared weight</small>
        </div>

        <div className="md-stat-card">
          <div className="md-stat-icon green">
            <CheckCircle2 size={22} />
          </div>

          <span>Verified Gold</span>

          <h2>{formatGrams(verifiedGold)}</h2>

          <small>Verified pure gold</small>
        </div>

        <div className="md-stat-card">
          <div className="md-stat-icon orange">
            <Clock3 size={22} />
          </div>

          <span>Pending Requests</span>

          <h2>{pendingCount}</h2>

          <small>Awaiting processing</small>
        </div>
      </div>

      {/* HISTORY HEADER */}
      <div className="md-history-header">
        <div>
          <h2>Deposit History</h2>

          <p>Your recent gold deposit activity</p>
        </div>

        <button
          className="md-refresh"
          onClick={fetchDeposits}
          disabled={loading}
        >
          <RefreshCw size={16} />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="md-empty">
          <p>Loading your deposits...</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="md-empty">
          <p>{error}</p>

          <button onClick={fetchDeposits}>Try Again</button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && deposits.length === 0 && (
        <div className="md-empty">
          <div className="md-empty-icon">
            <Coins size={30} />
          </div>

          <h3>No deposits yet</h3>

          <p>
            Your gold deposit history will appear here once you submit your
            first request.
          </p>

          <button className="md-new-btn" onClick={() => setShowDeposit(true)}>
            Start Your First Deposit
          </button>
        </div>
      )}

      {/* DEPOSIT LIST */}
      {!loading && !error && deposits.length > 0 && (
        <div className="md-list">
          {deposits.map((d) => (
            <article className="md-card" key={d.id}>
              {/* CARD HEADER */}
              <div className="md-card-top">
                <div className="md-card-title">
                  <div className="md-gold-icon">
                    <Coins size={23} />
                  </div>

                  <div>
                    <h3>Gold Deposit</h3>

                    <span>Request ID: {d.id}</span>
                  </div>
                </div>

                <StatusBadge status={d.status} />
              </div>

              {/* DATE */}
              <div className="md-card-date">
                <CalendarDays size={15} />

                {d.createdAt
                  ? new Date(d.createdAt).toLocaleDateString("en-IN")
                  : "Date unavailable"}
              </div>

              {/* DEPOSIT DETAILS */}
              <div className="md-details-grid">
                <div>
                  <span>Gold Type</span>

                  <strong>{d.goldType || d.type || "N/A"}</strong>
                </div>

                <div>
                  <span>Declared Weight</span>

                  <strong>{formatGrams(d.weight)}</strong>
                </div>

                <div>
                  <span>Purity</span>

                  <strong>{d.purity || "N/A"}</strong>
                </div>

                <div>
                  <span>Estimated Pure Gold</span>

                  <strong>{getEstimatedPureGold(d)}</strong>
                </div>

                <div>
                  <span>Collection Method</span>

                  <strong>{d.method || "N/A"}</strong>

                  {d.branch && <small>{d.branch}</small>}
                </div>

                <div>
                  <span>Verified Pure Gold</span>

                  <strong className="md-verified">
                    {d.verifiedPureGrams == null
                      ? "Pending verification"
                      : formatGrams(d.verifiedPureGrams)}
                  </strong>
                </div>
              </div>

              {/* APPOINTMENT DETAILS */}
              <div className="md-card-date">
                <CalendarDays size={15} />
                Appointment: {d.date || "N/A"} · {d.time || "N/A"}
              </div>

              {/* TRACK DEPOSIT BUTTON */}
              <div className="md-track-action">
                <button
                  type="button"
                  className="md-track-btn"
                  onClick={() => setSelectedDeposit(d)}
                >
                  Track Deposit
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* NEW DEPOSIT MODAL */}
      {showDeposit && (
        <DepositGold
          onClose={() => {
            setShowDeposit(false);
            fetchDeposits();
          }}
        />
      )}

      {/* DEPOSIT TRACKING MODAL */}
      {selectedDeposit && (
        <DepositTracking
          deposit={selectedDeposit}
          onClose={() => setSelectedDeposit(null)}
        />
      )}
    </div>
  );
}
