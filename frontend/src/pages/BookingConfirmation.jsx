
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./BookingConfirmation.css";

const API_URL = "https://bmb-bus.onrender.com";

function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");

  const selectedSeats = seats ? seats.split(",") : [];

  const passenger = location.state?.passenger;
  const payment = location.state?.payment;

  // Pickup/drop data selected on the previous page
  const pickupStopId = location.state?.pickupStopId;
  const dropStopId = location.state?.dropStopId;

  const pickupStopName = location.state?.pickupStopName;
  const pickupCity = location.state?.pickupCity;
  const dropStopName = location.state?.dropStopName;
  const dropCity = location.state?.dropCity;

  const [bus, setBus] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  // Load bus details
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/buses`);

        if (!response.ok) {
          throw new Error(`Bus API error: ${response.status}`);
        }

        const buses = await response.json();

        const selectedBus = buses.find(
          (item) => Number(item.id) === Number(busId)
        );

        if (!selectedBus) {
          throw new Error("Selected bus not found.");
        }

        setBus(selectedBus);
      } catch (err) {
        console.error("Error loading bus:", err);
        setError(err.message || "Unable to load bus details.");
      } finally {
        setLoading(false);
      }
    };

    if (busId) {
      fetchBus();
    } else {
      setError("Bus ID is missing.");
      setLoading(false);
    }
  }, [busId]);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Save the booking
  const handleConfirmBooking = async () => {
    if (!passenger) {
      alert("Passenger details missing hain.");
      navigate("/routes");
      return;
    }

    if (!pickupStopId || !dropStopId) {
      setError(
        "Pickup/drop details nahi mile. Please booking process dobara shuru karein."
      );
      return;
    }

    if (!bus || selectedSeats.length === 0) {
      setError("Bus ya selected seats ki details missing hain.");
      return;
    }

    const token = localStorage.getItem("bmb_token");

    if (!token) {
      alert("Please login before confirming your booking.");
      navigate("/login");
      return;
    }

    const totalAmount =
      selectedSeats.length * Number(bus.price);

    const bookingData = {
      busId: Number(bus.id),
      journeyDate,
      passengerName: passenger.name,
      passengerAge: Number(passenger.age),
      passengerGender: passenger.gender,
      passengerPhone: passenger.phone,
      passengerEmail: passenger.email,
      seats: selectedSeats.join(","),
      totalAmount,

      paymentStatus: payment?.paymentStatus || "SUCCESS",
      paymentId: payment?.paymentId || "",
      paymentMethod: payment?.paymentMethod || "Online Payment",
      bookingStatus: "CONFIRMED",

      pickupStopId: Number(pickupStopId),
      dropStopId: Number(dropStopId),
    };

    try {
      setBookingLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Booking API error:", errorText);

        throw new Error(
          `Booking failed (${response.status}). Check backend logs.`
        );
      }

      const savedBooking = await response.json();

      setBooking({
        ...savedBooking,
        pickupStopName,
        pickupCity,
        dropStopName,
        dropCity,
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Unable to confirm booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-loading">
          <div className="confirmation-spinner"></div>
          <h2>Loading booking details...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-error">
          <h2>Bus details not found</h2>
          <p>{error || "Unable to find selected bus."}</p>
          <button onClick={() => navigate("/routes")}>
            Back to Routes
          </button>
        </div>
      </div>
    );
  }

  // Show confirmed ticket
  if (booking) {
    return (
      <div className="confirmation-page">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <span>BOOKING CONFIRMED</span>
          <h1>Your Ticket is Confirmed</h1>
          <p>Your BMB bus booking has been successfully saved.</p>
        </div>

        <div className="ticket-card">
          <div className="ticket-top">
            <div>
              <span>BOOKING ID</span>
              <strong>#{booking.id}</strong>
            </div>
            <div className="confirmed-badge">CONFIRMED</div>
          </div>

          <div className="ticket-route">
            <div>
              <span>FROM</span>
              <strong>{bus.fromCity}</strong>
              <small>{bus.departureTime}</small>
            </div>

            <div className="ticket-arrow">→</div>

            <div>
              <span>TO</span>
              <strong>{bus.toCity}</strong>
              <small>{bus.arrivalTime}</small>
            </div>
          </div>

          <div className="ticket-divider"></div>

          <div className="ticket-details">
            <div>
              <span>JOURNEY DATE</span>
              <strong>
                {formatDate(booking.journeyDate || journeyDate)}
              </strong>
            </div>

            <div>
              <span>BUS</span>
              <strong>{bus.busName}</strong>
            </div>

            <div>
              <span>BUS NUMBER</span>
              <strong>{bus.busNumber}</strong>
            </div>

            <div>
              <span>SEATS</span>
              <strong>{booking.seats}</strong>
            </div>

            <div>
              <span>PICKUP POINT</span>
              <strong>
                {pickupStopName} - {pickupCity}
              </strong>
            </div>

            <div>
              <span>DROP POINT</span>
              <strong>
                {dropStopName} - {dropCity}
              </strong>
            </div>

            <div>
              <span>PASSENGER</span>
              <strong>{booking.passengerName}</strong>
            </div>

            <div>
              <span>PHONE</span>
              <strong>{booking.passengerPhone}</strong>
            </div>

            <div>
              <span>EMAIL</span>
              <strong>{booking.passengerEmail}</strong>
            </div>

            <div>
              <span>PAYMENT STATUS</span>
              <strong>{booking.paymentStatus}</strong>
            </div>

            <div>
              <span>PAYMENT ID</span>
              <strong>{booking.paymentId}</strong>
            </div>

            <div>
              <span>TOTAL AMOUNT</span>
              <strong className="ticket-price">
                ₹{booking.totalAmount}
              </strong>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="print-ticket-btn"
            onClick={() => window.print()}
          >
            🖨 Print Ticket
          </button>

          <button
            className="my-bookings-btn"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings →
          </button>
        </div>
      </div>
    );
  }

  // Final review before saving the booking
  return (
    <div className="confirmation-page">
      <div className="confirmation-header">
        <span>FINAL STEP</span>
        <h1>Confirm Your Booking</h1>
        <p>Please review your journey and passenger details.</p>
      </div>

      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="card-title">
            <h2>Journey Details</h2>
          </div>

          <div className="confirmation-route">
            <div>
              <span>FROM</span>
              <strong>{bus.fromCity}</strong>
              <small>{bus.departureTime}</small>
            </div>

            <div className="confirmation-arrow">→</div>

            <div>
              <span>TO</span>
              <strong>{bus.toCity}</strong>
              <small>{bus.arrivalTime}</small>
            </div>
          </div>

          <div className="confirmation-info-grid">
            <div>
              <span>JOURNEY DATE</span>
              <strong>{formatDate(journeyDate)}</strong>
            </div>

            <div>
              <span>BUS</span>
              <strong>{bus.busName}</strong>
            </div>

            <div>
              <span>BUS NUMBER</span>
              <strong>{bus.busNumber}</strong>
            </div>

            <div>
              <span>SELECTED SEATS</span>
              <strong>{selectedSeats.join(", ")}</strong>
            </div>

            <div>
              <span>PICKUP POINT</span>
              <strong>
                {pickupStopName || "Not selected"}
                {pickupCity ? ` - ${pickupCity}` : ""}
              </strong>
            </div>

            <div>
              <span>DROP POINT</span>
              <strong>
                {dropStopName || "Not selected"}
                {dropCity ? ` - ${dropCity}` : ""}
              </strong>
            </div>
          </div>
        </div>

        <div className="confirmation-card">
          <div className="card-title">
            <h2>Passenger Details</h2>
          </div>

          {passenger ? (
            <div className="passenger-info-grid">
              <div>
                <span>FULL NAME</span>
                <strong>{passenger.name}</strong>
              </div>
              <div>
                <span>AGE</span>
                <strong>{passenger.age}</strong>
              </div>
              <div>
                <span>GENDER</span>
                <strong>{passenger.gender}</strong>
              </div>
              <div>
                <span>PHONE</span>
                <strong>{passenger.phone}</strong>
              </div>
              <div>
                <span>EMAIL</span>
                <strong>{passenger.email}</strong>
              </div>
            </div>
          ) : (
            <p className="missing-passenger">
              Passenger details are unavailable.
            </p>
          )}
        </div>

        <div className="confirmation-card">
          <div className="card-title">
            <h2>Payment Details</h2>
          </div>

          <div className="passenger-info-grid">
            <div>
              <span>PAYMENT STATUS</span>
              <strong>{payment?.paymentStatus || "Pending"}</strong>
            </div>

            <div>
              <span>PAYMENT METHOD</span>
              <strong>{payment?.paymentMethod || "Not available"}</strong>
            </div>
          </div>
        </div>

        <div className="fare-card">
          <div>
            <span>SEATS</span>
            <strong>{selectedSeats.length}</strong>
          </div>

          <div>
            <span>FARE / SEAT</span>
            <strong>₹{bus.price}</strong>
          </div>

          <div className="total-fare">
            <span>TOTAL AMOUNT</span>
            <strong>₹{selectedSeats.length * bus.price}</strong>
          </div>
        </div>

        {error && (
          <div className="booking-error">{error}</div>
        )}

        <button
          className="confirm-booking-btn"
          onClick={handleConfirmBooking}
          disabled={bookingLoading}
        >
          {bookingLoading
            ? "Confirming Booking..."
            : "Confirm & Book"}
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
