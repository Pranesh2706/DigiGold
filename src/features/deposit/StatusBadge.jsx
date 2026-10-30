import { STATUS_META } from "./constants";

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: "info" };
  return <span className={`badge badge--${meta.tone}`}>{meta.label}</span>;
}
