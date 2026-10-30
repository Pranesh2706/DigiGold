const KEY = "digigold_trades";

/* Returns all saved buy/sell orders, newest first. */
export function getTrades() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("Could not read trades:", error);
    return [];
  }
}

/* Saves a demo buy/sell order. Returns the saved trade, or null on failure. */
export function addTrade({ side, grams, rate, total }) {
  try {
    const trade = {
      id: `TR-${Date.now().toString(36).toUpperCase()}`,
      side, // "buy" or "sell"
      grams,
      rate,
      total,
      status: "completed",
      date: new Date().toISOString(),
    };

    localStorage.setItem(KEY, JSON.stringify([trade, ...getTrades()]));
    return trade;
  } catch (error) {
    console.error("Could not save trade:", error);
    return null;
  }
}
