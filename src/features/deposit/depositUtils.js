import { PURITIES } from "./constants";

const round4 = (n) => Math.round(n * 10000) / 10000;

// Preview only. The credited quantity is decided after verification at the branch.
export function estimatePureGold(weight, purity) {
  const p = PURITIES.find((x) => x.value === purity);
  const w = Number(weight);
  if (!p || !w || w <= 0) return 0;
  return round4((w * p.fineness) / 100);
}

export const formatGrams = (g) => `${Number(g).toFixed(4)} g`;

export const formatINR = (n) =>
  `₹${Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}
