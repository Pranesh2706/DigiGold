import { useState } from "react";
import { Link } from "react-router-dom";

import { Check, Coins, ShieldCheck, TrendingUp } from "lucide-react";

import { addTrade } from "../features/trade/tradeService";

import "./BuySell.css";

const GOLD_RATE = 7450; // Demo price per gram
const GST_RATE = 0.03; // Illustrative GST calculation
const MIN_AMOUNT = 100;
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

const inr = (n) =>
  `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function BuySell() {
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("5000");
  const [success, setSuccess] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [lastTradeId, setLastTradeId] = useState("");

  const isBuy = mode === "buy";
  const numericAmount = Math.max(0, Number(amount) || 0);

  const gst = isBuy ? numericAmount * GST_RATE : 0;
  const total = isBuy ? numericAmount + gst : numericAmount;
  const goldGrams = numericAmount / GOLD_RATE;

  const tooLow = numericAmount < MIN_AMOUNT;
  const showError = amount !== "" && tooLow;

  const resetResult = () => {
    setSuccess(false);
    setSaveFailed(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetResult();
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    resetResult();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tooLow || success) return;

    // Frontend demo only. No actual payment or gold transaction.
    const trade = addTrade({
      side: mode,
      grams: goldGrams,
      rate: GOLD_RATE,
      total,
    });

    if (trade) {
      setLastTradeId(trade.id);
      setSuccess(true);
      setSaveFailed(false);
    } else {
      setSuccess(false);
      setSaveFailed(true);
    }
  };

  return (
    <div className="trade-page">
      {/* HEADER BAND */}
      <section className="trade-band">
        <div className="trade-container trade-header">
          <div className="trade-header__text">
            <h1>Buy and sell gold</h1>
            <p>
              Place a demo order in seconds. Every order is saved to your
              transactions.
            </p>
          </div>

          <div className="rate-card">
            <span className="rate-label">
              <i />
              Demo gold rate
            </span>
            <strong>
              ₹{GOLD_RATE.toLocaleString("en-IN")}
              <small>/g</small>
            </strong>
            <span className="rate-note">
              Illustrative price, not a live quote
            </span>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="trade-container trade-main">
        <form className="trade-layout" onSubmit={handleSubmit}>
          {/* LEFT: order input */}
          <section className="trade-card" aria-label="Order details">
            <div
              className="trade-tabs"
              role="tablist"
              aria-label="Order type"
              data-mode={mode}
            >
              <span className="trade-tabs__thumb" aria-hidden="true" />

              <button
                type="button"
                role="tab"
                aria-selected={isBuy}
                className={isBuy ? "is-active" : ""}
                onClick={() => handleModeChange("buy")}
              >
                Buy gold
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={!isBuy}
                className={!isBuy ? "is-active" : ""}
                onClick={() => handleModeChange("sell")}
              >
                Sell gold
              </button>
            </div>

            <label className="trade-label" htmlFor="trade-amount">
              {isBuy ? "Investment amount" : "Selling amount"}
            </label>

            <div className={`amount-input ${showError ? "has-error" : ""}`}>
              <span>₹</span>
              <input
                id="trade-amount"
                type="number"
                inputMode="decimal"
                min="0"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                aria-describedby="amount-hint"
                aria-invalid={showError}
              />
            </div>

            <p
              id="amount-hint"
              className={`amount-hint ${showError ? "is-error" : ""}`}
              role={showError ? "alert" : undefined}
            >
              {showError
                ? `The minimum amount is ₹${MIN_AMOUNT}.`
                : `Minimum ₹${MIN_AMOUNT}`}
            </p>

            <div
              className="quick-amounts"
              role="group"
              aria-label="Quick amounts"
            >
              {QUICK_AMOUNTS.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => handleAmountChange(String(value))}
                  className={Number(amount) === value ? "selected" : ""}
                  aria-pressed={Number(amount) === value}
                >
                  ₹{value.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <div className="gold-receive">
              <div className="ingot" aria-hidden="true">
                <span>24K</span>
              </div>

              <div>
                <span className="gold-receive__label">
                  {isBuy
                    ? "You will receive approximately"
                    : "Gold you are selling"}
                </span>
                <strong className="gold-receive__value">
                  {goldGrams.toFixed(4)} <small>grams</small>
                </strong>
                <span className="gold-receive__rate">
                  at ₹{GOLD_RATE.toLocaleString("en-IN")} per gram
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT: summary */}
          <aside className="trade-side">
            <div className={`trade-summary ${mode}`}>
              <h2>Order summary</h2>

              <dl>
                <div>
                  <dt>Order type</dt>
                  <dd>{isBuy ? "Buy" : "Sell"}</dd>
                </div>
                <div>
                  <dt>Gold price</dt>
                  <dd>₹{GOLD_RATE.toLocaleString("en-IN")}/g</dd>
                </div>
                <div>
                  <dt>Gold quantity</dt>
                  <dd>{goldGrams.toFixed(4)} g</dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd>{inr(numericAmount)}</dd>
                </div>
                {isBuy && (
                  <div>
                    <dt>GST (illustrative 3%)</dt>
                    <dd>{inr(gst)}</dd>
                  </div>
                )}
              </dl>

              <div className="summary-total">
                <span>{isBuy ? "Total payable" : "Estimated value"}</span>
                <strong>{inr(total)}</strong>
              </div>

              {success ? (
                <div className="trade-success" role="status">
                  <div className="trade-success__head">
                    <span className="trade-success__tick">
                      <Check size={16} />
                    </span>
                    <div>
                      <strong>Demo order saved</strong>
                      <span>{lastTradeId}</span>
                    </div>
                  </div>

                  <p>No real payment or gold transaction has taken place.</p>

                  <div className="trade-success__actions">
                    <Link to="/transactions" className="trade-link">
                      View transactions
                    </Link>
                    <button
                      type="button"
                      className="trade-link trade-link--ghost"
                      onClick={resetResult}
                    >
                      New order
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={`trade-submit ${mode}`}
                  type="submit"
                  disabled={tooLow}
                >
                  {isBuy ? "Place buy order" : "Place sell order"}
                </button>
              )}

              {saveFailed && (
                <p className="trade-error" role="alert">
                  We couldn't save this demo order. Check that browser storage
                  is allowed and try again.
                </p>
              )}

              <p className="trade-disclaimer">
                This is a frontend demo. Prices, GST and calculations are
                illustrative, not live financial quotes.
              </p>
            </div>

            <ul className="trade-trust">
              <li>
                <ShieldCheck size={18} />
                <span>No real payment is taken</span>
              </li>
              <li>
                <TrendingUp size={18} />
                <span>Orders appear in your transactions</span>
              </li>
              <li>
                <Coins size={18} />
                <span>Start with as little as ₹{MIN_AMOUNT}</span>
              </li>
            </ul>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default BuySell;
