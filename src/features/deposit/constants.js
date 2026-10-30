export const GOLD_TYPES = [
  { value: "jewellery", label: "Jewellery" },
  { value: "coin", label: "Coin" },
  { value: "bar", label: "Bar" },
];

export const PURITIES = [
  { value: "24", label: "24K (99.9%)", fineness: 99.9 },
  { value: "22", label: "22K (91.6%)", fineness: 91.6 },
  { value: "18", label: "18K (75.0%)", fineness: 75.0 },
  { value: "14", label: "14K (58.5%)", fineness: 58.5 },
];

export const METHODS = [
  {
    value: "branch",
    label: "Visit a branch",
    desc: "Bring your gold to a DigiGold branch for testing and deposit.",
  },
  {
    value: "pickup",
    label: "Doorstep pickup",
    desc: "Our executive collects your gold from your address.",
  },
];

// DEMO DATA. Replace with GET /api/branches.
export const BRANCHES = [
  { id: "main", name: "Main Branch" },
  { id: "city-center", name: "City Center Branch" },
];

export const TIME_SLOTS = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

export const MIN_WEIGHT_G = 1;
export const MAX_WEIGHT_G = 1000;

export const STATUS_FLOW = [
  "requested",
  "scheduled",
  "received",
  "testing",
  "credited",
];

export const STATUS_META = {
  requested: { label: "Requested", tone: "info" },
  scheduled: { label: "Scheduled", tone: "info" },
  received: { label: "Gold received", tone: "info" },
  testing: { label: "Under testing", tone: "warn" },
  credited: { label: "Credited", tone: "success" },
  on_hold: { label: "On hold", tone: "warn" },
  rejected: { label: "Rejected", tone: "danger" },
};
