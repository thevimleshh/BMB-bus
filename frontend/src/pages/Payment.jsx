import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");
  const amount = searchParams.get("amount");

  const passenger = location.state?.passenger;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!passenger) {
      alert("Passenger details not found. Please go back.");
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

    setProcessing(true);

    // Simulated payment
    setTimeout(() => {
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
            payment: {
              paymentStatus: "SUCCESS",
              paymentId: "BMB-PAY-" + Date.now(),
              paymentMethod:
                paymentMethod === "upi"
                  ? "UPI"
                  : paymentMethod === "card"
                  ? "Card"
                  : "Net Banking",
            },
          },
        }
      );
    }, 1800);
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

        <span>SECURE PAYMENT</span>

        <h1>Complete Your Payment</h1>

        <p>
          Securely pay for your BMB bus booking.
        </p>

      </div>

      <div className="payment-container">

        {/* Amount */}

        <div className="payment-amount-card">

          <div>
            <span>TOTAL AMOUNT</span>
            <h2>₹{amount || "0"}</h2>
          </div>

          <div className="secure-badge">
            🔒 Secure Payment
          </div>

        </div>


        {/* Payment Methods */}

        <div className="payment-card">

          <div className="payment-card-heading">
            <h2>Choose Payment Method</h2>
            <p>Select your preferred payment option.</p>
          </div>


          <div className="payment-methods">

            <button
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
                <small>Visa, Mastercard, RuPay</small>
              </div>
            </button>


            <button
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
                <small>All major banks</small>
              </div>
            </button>

          </div>


          {/* UPI */}

          {paymentMethod === "upi" && (
            <div className="payment-form">

              <label>UPI ID</label>

              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />

              <p className="payment-hint">
                Enter your UPI ID to continue.
              </p>

            </div>
          )}


          {/* Card */}

          {paymentMethod === "card" && (
            <div className="payment-form">

              <label>Card Number</label>

              <input
                type="text"
                maxLength="19"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value)
                }
              />

              <div className="card-row">

                <div>
                  <label>Expiry</label>

                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label>CVV</label>

                  <input
                    type="password"
                    placeholder="•••"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value)
                    }
                  />
                </div>

              </div>

            </div>
          )}


          {/* Net Banking */}

          {paymentMethod === "netbanking" && (
            <div className="payment-form">

              <label>Select Bank</label>

              <select>
                <option>Select your bank</option>
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Bank of Baroda</option>
              </select>

            </div>
          )}

        </div>


        {/* Security */}

        <div className="payment-security">

          <span>🔒</span>

          <div>
            <strong>Your payment is secure</strong>

            <p>
              BMB protects your payment information
              using secure payment processing.
            </p>
          </div>

        </div>


        {/* Pay Button */}

        <button
          className="pay-now-btn"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing
            ? "Processing Payment..."
            : `Pay ₹${amount || "0"}`}
        </button>

      </div>

    </div>
  );
}

export default Payment;