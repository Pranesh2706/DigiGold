import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Search,
  Download,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getDeposits } from "../features/deposit/depositService";
import { PURITIES } from "../features/deposit/constants";
import StatusBadge from "../features/deposit/StatusBadge";
import { getTrades } from "../features/trade/tradeService";
import "./Transactions.css";

const PAGE_SIZE = 8;

const TYPES = {
  deposit: { label: "Deposit", icon: Coins },
  buy: { label: "Buy", icon: ArrowDownLeft },
  sell: { label: "Sell", icon: ArrowUpRight },
};

const SORTS = {
  newest: "Newest first",
  oldest: "Oldest first",
  heaviest: "Heaviest first",
};

const findPurity = (value) =>
  PURITIES.find((item) => item.value === String(value));

const toTime = (t) => new Date(t.date || 0).getTime() || 0;

const formatDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

/* Turns a deposit record into a transaction row. */
const fromDeposit = (d) => ({
  id: d.id,
  type: "deposit",
  goldType: d.goldType || "Gold",
  grams: Number(d.weight || 0),
  purity: d.purity,
  status: d.status,
  date: d.createdAt || d.date,
  amount: null,
});

/* Turns a saved buy/sell order into a transaction row. */
async function getTradeTransactions() {
  return getTrades().map((t) => ({
    id: t.id,
    type: t.side === "sell" ? "sell" : "buy",
    goldType: "Digital gold",
    grams: Number(t.grams || 0),
    purity: "24",
    status: t.status || "completed",
    date: t.date,
    amount: Number(t.total || 0),
  }));
}

const formatAmount = (value) =>
  value == null
    ? "-"
    : `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

function Transactions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [deposits, trades] = await Promise.all([
        getDeposits(),
        getTradeTransactions(),
      ]);

      const depositRows = Array.isArray(deposits)
        ? deposits.map(fromDeposit)
        : [];

      setRows([...depositRows, ...(Array.isArray(trades) ? trades : [])]);
    } catch (err) {
      console.error("Transactions loading error:", err);
      setError(
        "We couldn't load your transactions. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [type, status, sort, query]);

  const statuses = useMemo(
    () => [...new Set(rows.map((r) => r.status).filter(Boolean))],
    [rows],
  );

  const counts = useMemo(() => {
    const c = { all: rows.length, deposit: 0, buy: 0, sell: 0 };
    rows.forEach((r) => {
      if (c[r.type] !== undefined) c[r.type] += 1;
    });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = rows.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (status !== "all" && r.status !== status) return false;
      if (q && !`${r.id} ${r.goldType}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sort === "oldest") return toTime(a) - toTime(b);
      if (sort === "heaviest") return b.grams - a.grams;
      return toTime(b) - toTime(a);
    });
  }, [rows, type, status, query, sort]);

  const totalGrams = filtered.reduce((sum, r) => sum + r.grams, 0);
  const creditedCount = filtered.filter((r) => r.status === "credited").length;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const exportCsv = () => {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const header = [
      "Date",
      "ID",
      "Type",
      "Gold type",
      "Grams",
      "Amount (INR)",
      "Purity",
      "Status",
    ];
    const lines = filtered.map((r) =>
      [
        formatDate(r.date),
        r.id,
        TYPES[r.type]?.label || r.type,
        r.goldType,
        r.grams.toFixed(3),
        r.amount == null ? "" : r.amount.toFixed(2),
        findPurity(r.purity)?.label || `${r.purity}K`,
        r.status,
      ]
        .map(esc)
        .join(","),
    );

    const blob = new Blob([[header.map(esc).join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "digigold-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setType("all");
    setStatus("all");
    setQuery("");
  };

  if (loading) {
    return (
      <div className="tx-page">
        <div className="tx-container tx-loading" role="status" aria-busy="true">
          <RefreshCw className="tx-spin" size={28} />
          <p>Loading your transactions...</p>
        </div>
      </div>
    );
  }

  const hasFilters = type !== "all" || status !== "all" || query !== "";

  return (
    <div className="tx-page">
      <div className="tx-container">
        <header className="tx-header">
          <div>
            <h1>Transactions</h1>
            <p>Every deposit and trade on your account, in one list.</p>
          </div>

          <div className="tx-header-actions">
            <button
              type="button"
              className="tx-btn"
              onClick={exportCsv}
              disabled={filtered.length === 0}
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              type="button"
              className="tx-btn"
              onClick={() => load(true)}
              disabled={refreshing}
              aria-label="Refresh transactions"
            >
              <RefreshCw size={16} className={refreshing ? "tx-spin" : ""} />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </header>

        {error && (
          <div className="tx-error" role="alert">
            <AlertTriangle size={18} />
            <p>{error}</p>
            <button type="button" onClick={() => load(true)}>
              Try again
            </button>
          </div>
        )}

        <section
          className="tx-summary"
          aria-label="Summary of shown transactions"
        >
          <div>
            <span>Transactions shown</span>
            <strong>{filtered.length}</strong>
          </div>
          <div>
            <span>Total gold</span>
            <strong>{totalGrams.toFixed(3)} g</strong>
          </div>
          <div>
            <span>Credited</span>
            <strong>{creditedCount}</strong>
          </div>
        </section>

        <section className="tx-panel">
          <div className="tx-toolbar">
            <div className="tx-chips" role="group" aria-label="Filter by type">
              {["all", "deposit", "buy", "sell"].map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`tx-chip ${type === key ? "is-active" : ""}`}
                  aria-pressed={type === key}
                  onClick={() => setType(key)}
                >
                  {key === "all" ? "All" : TYPES[key].label}
                  <span>{counts[key]}</span>
                </button>
              ))}
            </div>

            <div className="tx-controls">
              <label className="tx-search">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search by ID or gold type"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search transactions"
                />
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort transactions"
              >
                {Object.entries(SORTS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {visible.length > 0 ? (
            <>
              <div className="tx-table-wrap">
                <table className="tx-table">
                  <caption className="tx-sr">Your transactions</caption>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">ID</th>
                      <th scope="col">Type</th>
                      <th scope="col">Gold type</th>
                      <th scope="col" className="tx-num">
                        Weight
                      </th>
                      <th scope="col" className="tx-num">
                        Amount
                      </th>
                      <th scope="col">Purity</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visible.map((r) => {
                      const meta = TYPES[r.type] || TYPES.deposit;
                      const Icon = meta.icon;

                      return (
                        <tr key={`${r.type}-${r.id}`}>
                          <td>{formatDate(r.date)}</td>
                          <td className="tx-id">{r.id}</td>
                          <td>
                            <span className={`tx-type tx-type--${r.type}`}>
                              <Icon size={14} />
                              {meta.label}
                            </span>
                          </td>
                          <td>{r.goldType}</td>
                          <td className="tx-num">{r.grams.toFixed(3)} g</td>
                          <td className="tx-num">{formatAmount(r.amount)}</td>
                          <td>
                            {findPurity(r.purity)?.label || `${r.purity}K`}
                          </td>
                          <td>
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <nav className="tx-pager" aria-label="Pagination">
                <span>
                  Page {safePage} of {pageCount}
                </span>

                <div>
                  <button
                    type="button"
                    className="tx-btn"
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="tx-btn"
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage === pageCount}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </nav>
            </>
          ) : (
            <div className="tx-empty">
              <Coins size={30} />
              {rows.length === 0 ? (
                <>
                  <p>No transactions yet.</p>
                  <Link to="/my-deposits" className="tx-cta">
                    Make your first deposit
                  </Link>
                </>
              ) : (
                <>
                  <p>No transactions match your filters.</p>
                  {hasFilters && (
                    <button
                      type="button"
                      className="tx-cta"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        <p className="tx-disclaimer">
          Transactions are based on locally stored demo records. No live gold
          rate or payment is connected yet.
        </p>
      </div>
    </div>
  );
}

export default Transactions;
