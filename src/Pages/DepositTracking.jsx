import { CalendarDays, Clock3, PackageCheck, X } from "lucide-react";
import { STATUS_META } from "../features/deposit/constants";
import "./DepositTracking.css";

export default function DepositTracking({ deposit, onClose }) {
  if (!deposit) return null;

  const history = Array.isArray(deposit.history)
    ? [...deposit.history].reverse()
    : [];

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentMeta = STATUS_META[deposit.status] || {
    label: deposit.status || "Unknown",
    tone: "info",
  };

  return (
    <div className="tracking-overlay" onClick={onClose}>
      <section
        className="tracking-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="tracking-close"
          onClick={onClose}
          aria-label="Close tracking"
        >
          <X size={20} />
        </button>

        <div className="tracking-heading">
          <span className="tracking-eyebrow">DIGIGOLD • DEPOSIT TRACKING</span>
          <h2>Track your deposit</h2>
          <p>Follow the progress of your gold deposit request.</p>
        </div>

        <div className="tracking-summary">
          <div className="tracking-summary-icon">
            <PackageCheck size={25} />
          </div>

          <div>
            <span>Deposit reference</span>
            <h3>{deposit.id || "Reference unavailable"}</h3>
          </div>

          <span className={`badge badge--${currentMeta.tone}`}>
            {currentMeta.label}
          </span>
        </div>

        <div className="tracking-details">
          <div>
            <span>Gold type</span>
            <strong>{deposit.goldType || deposit.type || "—"}</strong>
          </div>

          <div>
            <span>Weight</span>
            <strong>
              {deposit.weight != null ? `${deposit.weight} g` : "—"}
            </strong>
          </div>

          <div>
            <span>Purity</span>
            <strong>{deposit.purity || "—"}</strong>
          </div>

          <div>
            <span>Deposit method</span>
            <strong>{deposit.method || "—"}</strong>
          </div>
        </div>

        <div className="tracking-timeline-heading">
          <h3>Deposit journey</h3>
          <span>{history.length} recorded update(s)</span>
        </div>

        {history.length > 0 ? (
          <div className="tracking-timeline">
            {history.map((item, index) => {
              const meta = STATUS_META[item.status] || {
                label: item.status || "Status update",
                tone: "info",
              };

              return (
                <div className="tracking-event" key={`${item.status}-${index}`}>
                  <div className="tracking-event-marker">
                    <span />
                  </div>

                  <div className="tracking-event-content">
                    <h4>{meta.label}</h4>
                    <p>
                      {item.description ||
                        "Your deposit request status was updated."}
                    </p>

                    <span className="tracking-event-date">
                      <CalendarDays size={13} />
                      {formatDate(item.at || item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="tracking-empty">
            <Clock3 size={24} />
            <h4>No tracking updates yet</h4>
            <p>Your deposit updates will appear here when recorded.</p>
          </div>
        )}

        <p className="tracking-note">
          Tracking information reflects updates currently recorded in DigiGold.
          It does not independently confirm physical gold receipt or
          verification.
        </p>

        <button className="tracking-done-btn" onClick={onClose}>
          Close tracking
        </button>
      </section>
    </div>
  );
}
