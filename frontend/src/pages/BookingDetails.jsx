import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./BookingDetails.css";

function BookingDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState(null);
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bmb_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!bookingId) {
      setError("Booking ID is missing.");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`https://bmb-bus.onrender.com/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch booking details.");
        }

        return response.json();
      }),

      fetch("https://bmb-bus.onrender.com/api/buses").then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch bus details.");
        }

        return response.json();
      }),
    ])
      .then(([bookingData, busData]) => {
        setBooking(bookingData);

        const selectedBus = busData.find(
          (bus) => Number(bus.id) === Number(bookingData.busId)
        );

        setBus(selectedBus || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Booking details error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [bookingId, navigate]);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-loading">
          <div className="details-spinner"></div>
          <h2>Loading booking details...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-details-page">
        <div className="booking-details-error">
          <div className="error-icon">⚠️</div>

          <h2>Unable to load booking</h2>

          <p>{error || "Booking not found."}</p>

          <button onClick={() => navigate("/my-bookings")}>
            ← Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-details-page">

      <div className="booking-details-header">
        <button
          className="details-back-btn"
          onClick={() => navigate("/my-bookings")}
        >
          ← Back to My Bookings
        </button>

        <span>BOOKING DETAILS</span>

        <h1>Booking #{booking.id}</h1>

        <p>Your complete BMB journey and passenger details.</p>
      </div>

      <div className="booking-details-container">

        {/* Booking Status */}

        <div className="details-status-card">

          <div>
            <span>BOOKING STATUS</span>
            <strong className="confirmed-status">
              {booking.bookingStatus || "CONFIRMED"}
            </strong>
          </div>

          <div>
            <span>PAYMENT STATUS</span>
            <strong className="payment-status">
              {booking.paymentStatus || "SUCCESS"}
            </strong>
          </div>

          <div>
            <span>PAYMENT ID</span>
            <strong>
              {booking.paymentId || "Not available"}
            </strong>
          </div>

        </div>


        {/* Journey Details */}

        <div className="details-card">

          <div className="details-card-title">
            <span>🚌</span>
            <div>
              <h2>Journey Details</h2>
              <p>Your bus and travel information</p>
            </div>
          </div>

          {bus && (
            <>
              <div className="details-route">

                <div className="details-city">
                  <span>FROM</span>
                  <h2>{bus.fromCity}</h2>
                  <strong>{bus.departureTime}</strong>
                </div>

                <div className="details-route-line">
                  <span>🚌</span>
                  <div>──────────── →</div>
                </div>

                <div className="details-city">
                  <span>TO</span>
                  <h2>{bus.toCity}</h2>
                  <strong>{bus.arrivalTime}</strong>
                </div>

              </div>

              <div className="details-divider"></div>

              <div className="journey-info-grid">

                <div>
                  <span>BUS NAME</span>
                  <strong>{bus.busName}</strong>
                </div>

                <div>
                  <span>BUS NUMBER</span>
                  <strong>{bus.busNumber}</strong>
                </div>

                <div>
                  <span>JOURNEY DATE</span>
                  <strong>{formatDate(booking.journeyDate)}</strong>
                </div>

                <div>
                  <span>SEAT NUMBER</span>
                  <strong>{booking.seats}</strong>
                </div>

              </div>
            </>
          )}

          {!bus && (
            <div className="bus-not-found">
              Bus information is currently unavailable.
            </div>
          )}

        </div>


        {/* Passenger Details */}

        <div className="details-card">

          <div className="details-card-title">
            <span>👤</span>
            <div>
              <h2>Passenger Details</h2>
              <p>Information provided during booking</p>
            </div>
          </div>

          <div className="passenger-info-grid">

            <div>
              <span>PASSENGER NAME</span>
              <strong>{booking.passengerName}</strong>
            </div>

            <div>
              <span>AGE</span>
              <strong>{booking.passengerAge}</strong>
            </div>

            <div>
              <span>GENDER</span>
              <strong>{booking.passengerGender}</strong>
            </div>

            <div>
              <span>PHONE</span>
              <strong>{booking.passengerPhone}</strong>
            </div>

            <div>
              <span>EMAIL</span>
              <strong>{booking.passengerEmail}</strong>
            </div>

          </div>

        </div>


        {/* Payment Summary */}

        <div className="payment-summary-card">

          <div>
            <span>TOTAL AMOUNT PAID</span>
            <h2>₹{booking.totalAmount}</h2>
          </div>

          <div className="payment-success">
            ✓ Payment Successful
          </div>

        </div>


        {/* Bottom Buttons */}

        <div className="details-actions">

          <button
            className="back-bookings-btn"
            onClick={() => navigate("/my-bookings")}
          >
            ← My Bookings
          </button>

          <button
            className="print-ticket-btn"
            onClick={() => window.print()}
          >
            🖨️ Print Ticket
          </button>

        </div>

      </div>

    </div>
  );
}

export default BookingDetails;