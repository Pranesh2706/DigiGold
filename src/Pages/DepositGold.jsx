import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDeposit } from "../features/deposit/depositService";
import "./DepositGold.css";

const initialForm = {
  goldType: "Jewellery",
  purity: "22K",
  weight: "",
  quantity: "1",
  method: "Branch Visit",
  branch: "",
  date: "",
  time: "",
  notes: "",
};

function DepositGold({ onClose }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateDetails = () => {
    if (!form.weight || Number(form.weight) <= 0) {
      setError("Please enter a valid gold weight.");
      return false;
    }

    if (!form.quantity || Number(form.quantity) < 1) {
      setError("Please enter a valid quantity.");
      return false;
    }

    if (!form.branch.trim()) {
      setError("Please enter your preferred branch.");
      return false;
    }

    if (!form.date || !form.time) {
      setError("Please select your appointment date and time.");
      return false;
    }

    if (form.date < new Date().toLocaleDateString("en-CA")) {
      setError("Please select today or a future date.");
      return false;
    }

    setError("");
    return true;
  };

  const handleReview = () => {
    if (validateDetails()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setError("Please accept the declaration before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const deposit = await createDeposit({
        ...form,
        weight: Number(form.weight),
        quantity: Number(form.quantity),
      });

      setSuccess(deposit);
    } catch (err) {
      setError(
        err.message || "Unable to submit your deposit. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDeposits = () => {
    onClose();
    navigate("/#my-deposits");
  };

  return (
    <div
      className="deposit-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="deposit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deposit-modal-title"
      >
        <button
          type="button"
          className="deposit-modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close deposit form"
        >
          ✕
        </button>

        {success ? (
          <div className="deposit-success">
            <div className="success-icon">✓</div>

            <span className="deposit-eyebrow">REQUEST SUBMITTED</span>

            <h1>Your deposit request is in!</h1>

            <p>
              Your gold deposit request has been successfully submitted. Our
              team will review your appointment details.
            </p>

            <div className="success-reference">
              <span>Deposit Reference</span>
              <strong>{success.id}</strong>
            </div>

            <button
              className="deposit-primary-btn"
              onClick={handleViewDeposits}
            >
              View My Deposits →
            </button>

            <button className="deposit-back-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="deposit-heading">
              <span className="deposit-eyebrow">DIGIGOLD SERVICES</span>
              <h1 id="deposit-modal-title">Deposit Your Gold</h1>
              <p>
                Turn your physical gold into a digitally tracked deposit. Start
                by sharing your gold details below.
              </p>
            </div>

            <div className="deposit-progress">
              <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                <span>01</span>
                <p>Gold Details</p>
              </div>

              <div className="progress-line"></div>

              <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                <span>02</span>
                <p>Review & Submit</p>
              </div>
            </div>

            <div className="deposit-card">
              {error && <div className="deposit-error">{error}</div>}

              {step === 1 && (
                <>
                  <div className="form-section">
                    <h2>01. Gold Information</h2>
                    <p>Tell us about the gold you want to deposit.</p>

                    <label>Gold Type</label>

                    <div className="gold-type-options">
                      {["Jewellery", "Gold Coin", "Gold Bar"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          className={`gold-type-option ${
                            form.goldType === type ? "selected" : ""
                          }`}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              goldType: type,
                            }))
                          }
                        >
                          <span className="gold-option-icon">✦</span>
                          {type}
                        </button>
                      ))}
                    </div>

                    <div className="deposit-grid">
                      <div className="form-field">
                        <label htmlFor="purity">Gold Purity</label>
                        <select
                          id="purity"
                          name="purity"
                          value={form.purity}
                          onChange={updateForm}
                        >
                          <option value="18K">18K</option>
                          <option value="22K">22K</option>
                          <option value="24K">24K</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label htmlFor="weight">Approx. Weight (grams)</label>
                        <input
                          id="weight"
                          name="weight"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="e.g. 10.5"
                          value={form.weight}
                          onChange={updateForm}
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="quantity">Number of Items</label>
                        <input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          placeholder="e.g. 2"
                          value={form.quantity}
                          onChange={updateForm}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  <div className="form-section">
                    <h2>02. Verification Appointment</h2>
                    <p>Choose how you would like to get your gold verified.</p>

                    <div className="deposit-grid">
                      <div className="form-field">
                        <label htmlFor="method">Verification Method</label>
                        <select
                          id="method"
                          name="method"
                          value={form.method}
                          onChange={updateForm}
                        >
                          <option value="Branch Visit">Visit a Branch</option>
                          <option value="Pickup">Request Pickup</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label htmlFor="branch">
                          {form.method === "Pickup"
                            ? "Pickup Location / Address"
                            : "Preferred Branch"}
                        </label>
                        <input
                          id="branch"
                          name="branch"
                          placeholder={
                            form.method === "Pickup"
                              ? "Enter your pickup address"
                              : "Enter your preferred branch"
                          }
                          value={form.branch}
                          onChange={updateForm}
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="date">Appointment Date</label>
                        <input
                          id="date"
                          name="date"
                          type="date"
                          min={new Date().toLocaleDateString("en-CA")}
                          value={form.date}
                          onChange={updateForm}
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="time">Preferred Time</label>
                        <select
                          id="time"
                          name="time"
                          value={form.time}
                          onChange={updateForm}
                        >
                          <option value="">Select a time</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="notes">Additional Notes (Optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        placeholder="Any additional information..."
                        value={form.notes}
                        onChange={updateForm}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="deposit-primary-btn"
                    onClick={handleReview}
                  >
                    Review Deposit Details →
                  </button>
                </>
              )}

              {step === 2 && (
                <div className="review-section">
                  <h2>Review Your Deposit</h2>
                  <p>Please verify your information before submitting.</p>

                  <div className="review-group">
                    <span>Gold Type</span>
                    <strong>{form.goldType}</strong>
                  </div>

                  <div className="review-group">
                    <span>Purity</span>
                    <strong>{form.purity}</strong>
                  </div>

                  <div className="review-group">
                    <span>Approximate Weight</span>
                    <strong>{form.weight} grams</strong>
                  </div>

                  <div className="review-group">
                    <span>Number of Items</span>
                    <strong>{form.quantity}</strong>
                  </div>

                  <div className="review-group">
                    <span>Verification Method</span>
                    <strong>{form.method}</strong>
                  </div>

                  <div className="review-group">
                    <span>Branch / Location</span>
                    <strong>{form.branch}</strong>
                  </div>

                  <div className="review-group">
                    <span>Appointment</span>
                    <strong>
                      {form.date} · {form.time}
                    </strong>
                  </div>

                  <div className="deposit-notice">
                    <strong>Important:</strong> The weight and purity entered
                    here are preliminary details. Final accepted weight and
                    purity must be determined through physical verification.
                  </div>

                  <label className="deposit-consent">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    I confirm that the information provided is accurate.
                  </label>

                  <div className="review-actions">
                    <button
                      type="button"
                      className="deposit-back-btn"
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                    >
                      ← Edit Details
                    </button>

                    <button
                      type="button"
                      className="deposit-primary-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Deposit Request →"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="deposit-footer-note">
              Demo only — no physical gold is collected or credited through this
              frontend.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DepositGold;
