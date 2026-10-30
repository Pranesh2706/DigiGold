import { createContext, useContext, useMemo } from "react";

// DEMO DATA. Replace with GET /api/gold/price when the backend is ready.
const DEMO_PRICE = { buyPrice: 7450, sellPrice: 7210, isDemo: true };

const GoldPriceContext = createContext(null);

export function GoldPriceProvider({ children }) {
  const value = useMemo(() => DEMO_PRICE, []);
  return (
    <GoldPriceContext.Provider value={value}>
      {children}
    </GoldPriceContext.Provider>
  );
}

export function useGoldPrice() {
  const ctx = useContext(GoldPriceContext);
  if (!ctx)
    throw new Error("useGoldPrice must be used inside GoldPriceProvider");
  return ctx;
}
