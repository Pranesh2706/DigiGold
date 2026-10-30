import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  PackageCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import StatusBadge from "../features/deposit/StatusBadge";
import { STATUS_FLOW, STATUS_META } from "../features/deposit/constants";
import {
  getDeposits,
  updateDepositStatus,
} from "../features/deposit/depositService";

import "./AdminDeposits.css";

const STATUS_OPTIONS = [...STATUS_FLOW, "on_hold", "rejected"];

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getDeposits();
      setDeposits(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Admin deposit loading error:", err);
      setError("Unable to load deposit requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const matchesSearch = [
        deposit.id,
        deposit.goldType,
        deposit.method,
        deposit.branch,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus =
        filterStatus === "all" || deposit.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [deposits, search, filterStatus]);

  const handleStatusChange = async (deposit, newStatus) => {
    if (!newStatus || newStatus === deposit.status) return;

    const confirmed = window.confirm(
      `Change deposit ${deposit.id} to "${STATUS_META[newStatus]?.label}"?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(deposit.id);
      setError("");
      setNotice("");

      await updateDepositStatus(deposit.id, newStatus);
      await fetchDeposits();

      setNotice(`Deposit ${deposit.id} status updated successfully.`);
    } catch (err) {
      console.error("Status update error:", err);
      setError(err.message || "Unable to update deposit status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalDeposits = deposits.length;

  const pendingDeposits = deposits.filter((deposit) =>
    ["requested", "scheduled", "received", "testing"].includes(deposit.status),
  ).length;

  const creditedDeposits = deposits.filter(
    (deposit) => deposit.status === "credited",
  ).length;

  const attentionDeposits = deposits.filter((deposit) =>
    ["on_hold", "rejected"].includes(deposit.status),
  ).length;

  return (
    <main className="admin-deposits-page">
      <header className="ad-header">
        <div>
          <span className="ad-eyebrow">DIGIGOLD ADMINISTRATION</span>
          <h1>Deposit Management</h1>
          <p>Review deposit requests and manage their recorded status.</p>
        </div>

        <button
          type="button"
          className="ad-refresh-btn"
          onClick={fetchDeposits}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      {/* OVERVIEW */}
      <section className="ad-stats">
        <article className="ad-stat-card">
          <div className="ad-stat-icon">
            <PackageCheck size={21} />
          </div>
          <span>Total requests</span>
          <strong>{totalDeposits}</strong>
          <small>All deposit submissions</small>
        </article>

        <article className="ad-stat-card">
          <div className="ad-stat-icon pending">
            <Clock3 size={21} />
          </div>
          <span>In progress</span>
          <strong>{pendingDeposits}</strong>
          <small>Awaiting next stage</small>
        </article>

        <article className="ad-stat-card">
          <div className="ad-stat-icon success">
            <CheckCircle2 size={21} />
          </div>
          <span>Credited</span>
          <strong>{creditedDeposits}</strong>
          <small>Marked as credited</small>
        </article>

        <article className="ad-stat-card">
          <div className="ad-stat-icon attention">
            <AlertCircle size={21} />
          </div>
          <span>Attention</span>
          <strong>{attentionDeposits}</strong>
          <small>On hold or rejected</small>
        </article>
      </section>

      {/* REQUESTS */}
      <section className="ad-content">
        <div className="ad-content-heading">
          <div>
            <h2>Deposit Requests</h2>
            <p>Search, review and update deposit records.</p>
          </div>

          <span className="ad-result-count">
            {filteredDeposits.length} result(s)
          </span>
        </div>

        <div className="ad-toolbar">
          <label className="ad-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search deposit ID, gold type, branch..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            className="ad-filter"
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option value={status} key={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </div>

        {notice && (
          <div className="ad-notice" role="status">
            {notice}
          </div>
        )}

        {error && (
          <div className="ad-error" role="alert">
            {error}
            <button type="button" onClick={fetchDeposits}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="ad-empty">Loading deposit requests...</div>
        ) : filteredDeposits.length === 0 ? (
          <div className="ad-empty">
            <PackageCheck size={30} />
            <h3>No deposit requests found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Deposit</th>
                  <th>Gold details</th>
                  <th>Appointment</th>
                  <th>Current status</th>
                  <th>Update status</th>
                </tr>
              </thead>

              <tbody>
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td>
                      <strong>{deposit.id}</strong>
                      <small>
                        {deposit.createdAt
                          ? new Date(deposit.createdAt).toLocaleDateString(
                              "en-IN",
                            )
                          : "Date unavailable"}
                      </small>
                    </td>

                    <td>
                      <strong>
                        {deposit.goldType || deposit.type || "Gold"}
                      </strong>
                      <small>
                        {deposit.weight ?? "—"} g · {deposit.purity || "—"}
                      </small>
                    </td>

                    <td>
                      <span className="ad-appointment">
                        <CalendarDays size={14} />
                        {deposit.date || "Not scheduled"}
                      </span>
                      <small>{deposit.time || deposit.method || "—"}</small>
                    </td>

                    <td>
                      <StatusBadge status={deposit.status} />
                    </td>

                    <td>
                      <select
                        className="ad-status-select"
                        value={deposit.status || "requested"}
                        disabled={updatingId === deposit.id}
                        onChange={(event) =>
                          handleStatusChange(deposit, event.target.value)
                        }
                        aria-label={`Update status for ${deposit.id}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option value={status} key={status}>
                            {STATUS_META[status].label}
                          </option>
                        ))}
                      </select>

                      {updatingId === deposit.id && (
                        <small className="ad-updating">Updating...</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="ad-demo-note">
          Demo admin panel: status changes are saved in this browser's local
          storage. They do not represent real-world gold receipt, testing or
          credit confirmation.
        </p>
      </section>
    </main>
  );
}
