
import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");
  const amount = searchParams.get("amount");

  // Passenger and pickup/drop data from previous page
  const {
    passenger,
    pickupStopId,
    dropStopId,
    pickupStopName,
    pickupCity,
    pickupAddress,
    dropStopName,
    dropCity,
    dropAddress,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!passenger) {
      alert("Passenger details nahi mile. Please booking dobara shuru karo.");
      navigate("/routes");
      return;
    }

    if (!pickupStopId || !dropStopId) {
      alert("Pickup/drop details missing hain. Please booking dobara shuru karo.");
      navigate("/routes");
      return;
    }

    if (paymentMethod === "upi" && !upiId.trim()) {
      alert("Please enter your UPI ID.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
        alert("Please enter complete card details.");
        return;
      }
    }

    if (paymentMethod === "netbanking" && !bank) {
      alert("Please select your bank.");
      return;
    }

    setProcessing(true);

    // DEMO ONLY: This simulates payment; it does not charge money.
    setTimeout(() => {
      const payment = {
        paymentStatus: "SUCCESS",
        paymentId: "BMB-DEMO-" + Date.now(),
        paymentMethod:
          paymentMethod === "upi"
            ? "UPI"
            : paymentMethod === "card"
            ? "Card"
            : "Net Banking",
      };

      setProcessing(false);

      navigate(
        `/booking-confirmation?busId=${encodeURIComponent(
          busId || ""
        )}&seats=${encodeURIComponent(
          seats || ""
        )}&date=${encodeURIComponent(
          journeyDate || ""
        )}&amount=${encodeURIComponent(
          amount || ""
        )}`,
        {
          state: {
            passenger,
            payment,

            // Forward the selected pickup/drop information
            pickupStopId,
            dropStopId,
            pickupStopName,
            pickupCity,
            pickupAddress,
            dropStopName,
            dropCity,
            dropAddress,
          },
        }
      );
    }, 1500);
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <button
          className="payment-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <span>PAYMENT</span>
        <h1>Complete Your Payment</h1>
        <p>Review your amount and choose a payment method.</p>
      </div>

      <div className="payment-container">
        <div className="payment-amount-card">
          <div>
            <span>TOTAL AMOUNT</span>
            <h2>₹{amount || "0"}</h2>
          </div>

          <div className="secure-badge">
            🔒 Demo Checkout
          </div>
        </div>

        <div className="payment-card">
          <div className="payment-card-heading">
            <h2>Choose Payment Method</h2>
            <p>Select your preferred option.</p>
          </div>

          <div className="payment-methods">
            <button
              type="button"
              className={
                paymentMethod === "upi"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => setPaymentMethod("upi")}
            >
              <span className="method-icon">📱</span>
              <div>
                <strong>UPI</strong>
                <small>Google Pay, PhonePe, Paytm</small>
              </div>
            </button>

            <button
              type="button"
              className={
                paymentMethod === "card"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => setPaymentMethod("card")}
            >
              <span className="method-icon">💳</span>
              <div>
                <strong>Credit / Debit Card</strong>
                <small>Demo form only</small>
              </div>
            </button>

            <button
              type="button"
              className={
                paymentMethod === "netbanking"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => setPaymentMethod("netbanking")}
            >
              <span className="method-icon">🏦</span>
              <div>
                <strong>Net Banking</strong>
                <small>Demo form only</small>
              </div>
            </button>
          </div>

          {paymentMethod === "upi" && (
            <div className="payment-form">
              <label htmlFor="upiId">UPI ID</label>
              <input
                id="upiId"
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
              />
              <p className="payment-hint">
                Demo only. No actual payment will be made.
              </p>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="payment-form">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                maxLength="19"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
              />

              <div className="card-row">
                <div>
                  <label htmlFor="expiry">Expiry</label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    type="password"
                    placeholder="•••"
                    maxLength="3"
                    value={cvv}
                    onChange={(event) => setCvv(event.target.value)}
                  />
                </div>
              </div>

              <p className="payment-hint">
                Demo only. Do not enter real card details.
              </p>
            </div>
          )}

          {paymentMethod === "netbanking" && (
            <div className="payment-form">
              <label htmlFor="bank">Select Bank</label>
              <select
                id="bank"
                value={bank}
                onChange={(event) => setBank(event.target.value)}
              >
                <option value="">Select your bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
                <option value="BOB">Bank of Baroda</option>
              </select>
            </div>
          )}
        </div>

        <div className="payment-security">
          <span>ℹ️</span>
          <div>
            <strong>Demo payment mode</strong>
            <p>
              This button simulates a successful payment for testing.
              It does not contact a payment gateway or charge money.
            </p>
          </div>
        </div>

        <button
          className="pay-now-btn"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing
            ? "Processing..."
            : `Continue — ₹${amount || "0"}`}
        </button>
      </div>
    </div>
  );
}

export default Payment;
