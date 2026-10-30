import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Coins,
  ShieldCheck,
  Clock,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

import { getDeposits } from "../features/deposit/depositService";
import { PURITIES } from "../features/deposit/constants";
import StatusBadge from "../features/deposit/StatusBadge";
import "./Portfolio.css";

const DONUT_COLORS = ["#c9a24d", "#e8cf8f", "#8f6f2c", "#f3e4b8", "#6b5320"];

const grams = (n) => Number(n || 0).toFixed(3);
const toTime = (d) => new Date(d.createdAt || d.date || 0).getTime() || 0;

const findPurity = (value) =>
  PURITIES.find((item) => item.value === String(value));

/* Counts a number up once on load. Skipped when reduced motion is on. */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce || !target) {
      setValue(target);
      return undefined;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function Portfolio() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPortfolio = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const data = await getDeposits();
      setDeposits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Portfolio loading error:", err);
      setError(
        "We couldn't load your deposits. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const stats = useMemo(() => {
    const active = deposits.filter((d) => d.status !== "rejected");
    const weightOf = (list) =>
      list.reduce((sum, d) => sum + Number(d.weight || 0), 0);

    const credited = active.filter((d) => d.status === "credited");
    const pending = active.filter((d) => d.status !== "credited");

    const verifiedPureGold = credited.reduce((sum, d) => {
      if (d.verifiedPureGrams != null) {
        return sum + Number(d.verifiedPureGrams || 0);
      }
      const fineness = Number(findPurity(d.purity)?.fineness || 0);
      return sum + Number(d.weight || 0) * (fineness / 100);
    }, 0);

    const purityBreakdown = PURITIES.map((purity) => ({
      ...purity,
      weight: weightOf(active.filter((d) => String(d.purity) === purity.value)),
    })).filter((item) => item.weight > 0);

    return {
      totalWeight: weightOf(active),
      creditedWeight: weightOf(credited),
      pendingWeight: weightOf(pending),
      verifiedPureGold,
      totalDeposits: active.length,
      purityBreakdown,
    };
  }, [deposits]);

  const recentDeposits = useMemo(
    () => [...deposits].sort((a, b) => toTime(b) - toTime(a)).slice(0, 5),
    [deposits],
  );

  const animatedTotal = useCountUp(stats.totalWeight);

  const creditedShare = stats.totalWeight
    ? (stats.creditedWeight / stats.totalWeight) * 100
    : 0;
  const pendingShare = stats.totalWeight ? 100 - creditedShare : 0;

  const donut = useMemo(() => {
    let acc = 0;
    const parts = stats.purityBreakdown.map((item, i) => {
      const share = stats.totalWeight
        ? (item.weight / stats.totalWeight) * 100
        : 0;
      const from = acc;
      acc += share;
      return `${DONUT_COLORS[i % DONUT_COLORS.length]} ${from}% ${acc}%`;
    });
    return parts.length ? `conic-gradient(${parts.join(", ")})` : "none";
  }, [stats]);

  if (loading) {
    return (
      <div className="portfolio-page">
        <div
          className="portfolio-container portfolio-loading"
          role="status"
          aria-busy="true"
        >
          <RefreshCw className="portfolio-loader" size={28} />
          <p>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="portfolio-container">
        <header className="portfolio-header">
          <div>
            <h1>My portfolio</h1>
            <p>Track your gold deposits and verified holdings.</p>
          </div>

          <button
            className="portfolio-refresh"
            onClick={() => fetchPortfolio(true)}
            disabled={refreshing}
            aria-label="Refresh portfolio"
            type="button"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "portfolio-loader" : ""}
            />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </header>

        {error && (
          <div className="portfolio-error" role="alert">
            <AlertTriangle size={18} />
            <p>{error}</p>
            <button type="button" onClick={() => fetchPortfolio(true)}>
              Try again
            </button>
          </div>
        )}

        {/* HERO: total gold + verified/pending bar + purity donut */}
        <section className="portfolio-hero" aria-label="Total gold deposited">
          <div className="portfolio-hero-main">
            <span className="portfolio-hero-label">Total gold deposited</span>

            <h2 className="portfolio-hero-number">
              {grams(animatedTotal)} <small>g</small>
            </h2>

            <p className="portfolio-hero-sub">
              Across {stats.totalDeposits} deposit
              {stats.totalDeposits !== 1 ? "s" : ""}
            </p>

            <div
              className="gold-bar"
              role="img"
              aria-label={`${creditedShare.toFixed(0)}% credited, ${pendingShare.toFixed(0)}% pending`}
            >
              <div
                className="gold-bar-credited"
                style={{ width: `${creditedShare}%` }}
              />
              <div
                className="gold-bar-pending"
                style={{ width: `${pendingShare}%` }}
              />
            </div>

            <div className="gold-bar-legend">
              <span>
                <i className="dot dot--credited" />
                Credited {grams(stats.creditedWeight)} g
              </span>
              <span>
                <i className="dot dot--pending" />
                Pending {grams(stats.pendingWeight)} g
              </span>
            </div>
          </div>

          <div className="portfolio-hero-donut">
            {stats.purityBreakdown.length > 0 ? (
              <>
                <div
                  className="donut"
                  style={{ background: donut }}
                  role="img"
                  aria-label="Purity mix"
                >
                  <div className="donut-hole">
                    <Coins size={22} />
                  </div>
                </div>

                <ul className="donut-legend">
                  {stats.purityBreakdown.map((item, i) => (
                    <li key={item.value}>
                      <i
                        className="dot"
                        style={{
                          background: DONUT_COLORS[i % DONUT_COLORS.length],
                        }}
                      />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="donut-empty">
                <Coins size={30} />
              </div>
            )}
          </div>
        </section>

        <section className="portfolio-stats" aria-label="Key figures">
          <div className="portfolio-stat-card">
            <div className="portfolio-stat-icon verified">
              <ShieldCheck size={21} />
            </div>
            <span>Verified pure gold</span>
            <h3>{grams(stats.verifiedPureGold)} g</h3>
            <small>Based on credited deposits</small>
          </div>

          <div className="portfolio-stat-card">
            <div className="portfolio-stat-icon pending">
              <Clock size={21} />
            </div>
            <span>Pending gold</span>
            <h3>{grams(stats.pendingWeight)} g</h3>
            <small>Awaiting credit</small>
          </div>

          <div className="portfolio-stat-card">
            <div className="portfolio-stat-icon deposits">
              <TrendingUp size={21} />
            </div>
            <span>Active deposits</span>
            <h3>{stats.totalDeposits}</h3>
            <small>Rejected deposits are excluded</small>
          </div>
        </section>

        <div className="portfolio-content-grid">
          <section className="portfolio-panel">
            <div className="portfolio-panel-header">
              <div>
                <h2>Gold purity breakdown</h2>
                <p>Your deposited gold by purity</p>
              </div>
            </div>

            {stats.purityBreakdown.length > 0 ? (
              <div className="purity-list">
                {stats.purityBreakdown.map((item, i) => {
                  const percentage = stats.totalWeight
                    ? (item.weight / stats.totalWeight) * 100
                    : 0;

                  return (
                    <div className="purity-item" key={item.value}>
                      <div className="purity-info">
                        <div>
                          <strong>{item.label}</strong>
                          <span>{grams(item.weight)} g</span>
                        </div>
                        <small>{percentage.toFixed(1)}%</small>
                      </div>

                      <div className="purity-progress">
                        <div
                          className="purity-progress-fill"
                          style={{
                            width: `${percentage}%`,
                            background: DONUT_COLORS[i % DONUT_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="portfolio-empty">
                <Coins size={30} />
                <p>No gold deposits yet.</p>
                <Link to="/my-deposits" className="portfolio-cta">
                  Make your first deposit
                </Link>
              </div>
            )}
          </section>

          <section className="portfolio-panel">
            <div className="portfolio-panel-header">
              <div>
                <h2>Portfolio summary</h2>
                <p>Your gold deposit overview</p>
              </div>
            </div>

            <div className="insight-row">
              <span>Total deposited</span>
              <strong>{grams(stats.totalWeight)} g</strong>
            </div>
            <div className="insight-row">
              <span>Verified pure gold</span>
              <strong>{grams(stats.verifiedPureGold)} g</strong>
            </div>
            <div className="insight-row">
              <span>Pending deposits</span>
              <strong>{grams(stats.pendingWeight)} g</strong>
            </div>

            <div className="portfolio-note">
              <ShieldCheck size={18} />
              <p>
                Verified gold is calculated from credited deposits. These
                figures are demo records, not live custody or financial
                statements.
              </p>
            </div>
          </section>
        </div>

        <section className="portfolio-panel">
          <div className="portfolio-panel-header">
            <div>
              <h2>Recent deposit activity</h2>
              <p>Your latest gold deposit records</p>
            </div>

            <Link to="/my-deposits" className="portfolio-view-all">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>

          {recentDeposits.length > 0 ? (
            <div className="portfolio-table-wrap">
              <table className="portfolio-table">
                <caption className="sr-only">Your five latest deposits</caption>
                <thead>
                  <tr>
                    <th scope="col">Deposit ID</th>
                    <th scope="col">Gold type</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Purity</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentDeposits.map((deposit) => (
                    <tr key={deposit.id}>
                      <td className="portfolio-deposit-id">{deposit.id}</td>
                      <td>{deposit.goldType || "Gold"}</td>
                      <td>{grams(deposit.weight)} g</td>
                      <td>
                        {findPurity(deposit.purity)?.label ||
                          `${deposit.purity}K`}
                      </td>
                      <td>
                        <StatusBadge status={deposit.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="portfolio-empty">
              <Coins size={30} />
              <p>Your deposit activity will appear here.</p>
            </div>
          )}
        </section>

        <p className="portfolio-disclaimer">
          DigiGold portfolio values are based on locally stored demo deposit
          records. No live gold rate, payment, or physical gold verification is
          connected yet.
        </p>
      </div>
    </div>
  );
}

export default Portfolio;
