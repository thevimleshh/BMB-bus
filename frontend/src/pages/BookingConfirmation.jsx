import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./BookingConfirmation.css";

function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");

  const selectedSeats = seats ? seats.split(",") : [];

  // Passenger details coming from Passenger Details page
  const passenger = location.state?.passenger;

  // Payment details coming from Payment page
  const payment = location.state?.payment;

  const [bus, setBus] = useState(null);
  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/buses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch buses");
        }

        return response.json();
      })
      .then((data) => {
        const selectedBus = data.find(
          (item) => Number(item.id) === Number(busId)
        );

        if (!selectedBus) {
          setError("Bus details not found.");
        }

        setBus(selectedBus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bus:", error);

        setError("Unable to load bus details.");
        setLoading(false);
      });
  }, [busId]);


  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };


  const handleConfirmBooking = async () => {
    if (!passenger) {
      alert("Passenger details are missing.");

      navigate("/passenger-details");

      return;
    }

    if (!bus) {
      alert("Bus details are missing.");

      return;
    }

    const token = localStorage.getItem("bmb_token");

    if (!token) {
      alert("Please login before confirming your booking.");

      navigate("/login");

      return;
    }

    setBookingLoading(true);
    setError("");


    const totalAmount =
      selectedSeats.length * bus.price;


    const bookingData = {
      busId: bus.id,

      journeyDate: journeyDate,

      passengerName: passenger.name,

      passengerAge: Number(passenger.age),

      passengerGender: passenger.gender,

      passengerPhone: passenger.phone,

      passengerEmail: passenger.email,

      seats: selectedSeats.join(","),

      totalAmount: totalAmount,

      paymentStatus:
        payment?.paymentStatus || "SUCCESS",

      paymentId:
        payment?.paymentId ||
        "BMB-PAY-" + Date.now(),
        paymentMethod:
  payment?.paymentMethod || "Online Payment",

      bookingStatus: "CONFIRMED",
    };


    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(bookingData),
        }
      );


      if (!response.ok) {
        const errorText = await response.text();

        console.error("Booking API error:", errorText);

        throw new Error("Booking failed");
      }


      const data = await response.json();

      setBooking(data);

    } catch (error) {
      console.error("Booking error:", error);

      setError(
        "Unable to confirm booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };


  /* ===============================
     LOADING
  =============================== */

  if (loading) {
    return (
      <div className="confirmation-page">

        <div className="confirmation-loading">

          <div className="confirmation-spinner"></div>

          <h2>
            Loading booking details...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

      </div>
    );
  }


  /* ===============================
     BUS NOT FOUND
  =============================== */

  if (!bus) {
    return (
      <div className="confirmation-page">

        <div className="confirmation-error">

          <h2>
            Bus details not found
          </h2>

          <p>
            {error || "Unable to find selected bus."}
          </p>

          <button
            onClick={() => navigate("/routes")}
          >
            Back to Routes
          </button>

        </div>

      </div>
    );
  }


  /* ===============================
     BOOKING SUCCESS
  =============================== */

  if (booking) {
    return (
      <div className="confirmation-page">

        <div className="success-header">

          <div className="success-icon">
            ✓
          </div>

          <span>
            BOOKING CONFIRMED
          </span>

          <h1>
            Your Ticket is Confirmed
          </h1>

          <p>
            Your BMB bus booking has been successfully confirmed.
          </p>

        </div>


        <div className="ticket-card">

          <div className="ticket-top">

            <div>

              <span>
                BOOKING ID
              </span>

              <strong>
                #{booking.id}
              </strong>

            </div>

            <div className="confirmed-badge">
              CONFIRMED
            </div>

          </div>


          <div className="ticket-route">

            <div>

              <span>
                FROM
              </span>

              <strong>
                {bus.fromCity}
              </strong>

              <small>
                {bus.departureTime}
              </small>

            </div>


            <div className="ticket-arrow">
              →
            </div>


            <div>

              <span>
                TO
              </span>

              <strong>
                {bus.toCity}
              </strong>

              <small>
                {bus.arrivalTime}
              </small>

            </div>

          </div>


          <div className="ticket-divider"></div>


          <div className="ticket-details">

            <div>

              <span>
                JOURNEY DATE
              </span>

              <strong>
                {formatDate(booking.journeyDate)}
              </strong>

            </div>


            <div>

              <span>
                BUS
              </span>

              <strong>
                {bus.busName}
              </strong>

            </div>


            <div>

              <span>
                BUS NUMBER
              </span>

              <strong>
                {bus.busNumber}
              </strong>

            </div>


            <div>

              <span>
                SEATS
              </span>

              <strong>
                {booking.seats}
              </strong>

            </div>


            <div>

              <span>
                PASSENGER
              </span>

              <strong>
                {booking.passengerName}
              </strong>

            </div>


            <div>

              <span>
                PHONE
              </span>

              <strong>
                {booking.passengerPhone}
              </strong>

            </div>


            <div>

              <span>
                EMAIL
              </span>

              <strong>
                {booking.passengerEmail}
              </strong>

            </div>


            <div>

              <span>
                PAYMENT STATUS
              </span>

              <strong>
                {booking.paymentStatus}
              </strong>

            </div>


            <div>

              <span>
                PAYMENT ID
              </span>

              <strong>
                {booking.paymentId}
              </strong>

            </div>


            <div>

              <span>
                TOTAL PAID
              </span>

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


  /* ===============================
     CONFIRM DETAILS
  =============================== */

  return (
    <div className="confirmation-page">

      <div className="confirmation-header">

        <span>
          FINAL STEP
        </span>

        <h1>
          Confirm Your Booking
        </h1>

        <p>
          Please review your journey and passenger details.
        </p>

      </div>


      <div className="confirmation-container">


        {/* JOURNEY CARD */}

        <div className="confirmation-card">

          <div className="card-title">

            <h2>
              Journey Details
            </h2>

          </div>


          <div className="confirmation-route">

            <div>

              <span>
                FROM
              </span>

              <strong>
                {bus.fromCity}
              </strong>

              <small>
                {bus.departureTime}
              </small>

            </div>


            <div className="confirmation-arrow">
              →
            </div>


            <div>

              <span>
                TO
              </span>

              <strong>
                {bus.toCity}
              </strong>

              <small>
                {bus.arrivalTime}
              </small>

            </div>

          </div>


          <div className="confirmation-info-grid">

            <div className="highlight-info">

              <span>
                JOURNEY DATE
              </span>

              <strong>
                {formatDate(journeyDate)}
              </strong>

            </div>


            <div>

              <span>
                BUS
              </span>

              <strong>
                {bus.busName}
              </strong>

            </div>


            <div>

              <span>
                BUS NUMBER
              </span>

              <strong>
                {bus.busNumber}
              </strong>

            </div>


            <div>

              <span>
                SELECTED SEATS
              </span>

              <strong>
                {selectedSeats.join(", ")}
              </strong>

            </div>

          </div>

        </div>


        {/* PASSENGER CARD */}

        <div className="confirmation-card">

          <div className="card-title">

            <h2>
              Passenger Details
            </h2>

          </div>


          {passenger ? (

            <div className="passenger-info-grid">

              <div>

                <span>
                  FULL NAME
                </span>

                <strong>
                  {passenger.name}
                </strong>

              </div>


              <div>

                <span>
                  AGE
                </span>

                <strong>
                  {passenger.age}
                </strong>

              </div>


              <div>

                <span>
                  GENDER
                </span>

                <strong>
                  {passenger.gender}
                </strong>

              </div>


              <div>

                <span>
                  PHONE
                </span>

                <strong>
                  {passenger.phone}
                </strong>

              </div>


              <div>

                <span>
                  EMAIL
                </span>

                <strong>
                  {passenger.email}
                </strong>

              </div>

            </div>

          ) : (

            <p className="missing-passenger">
              Passenger details are unavailable.
            </p>

          )}

        </div>


        {/* PAYMENT CARD */}

        <div className="confirmation-card">

          <div className="card-title">

            <h2>
              Payment Details
            </h2>

          </div>


          <div className="passenger-info-grid">

            <div>

              <span>
                PAYMENT STATUS
              </span>

              <strong>
                {payment?.paymentStatus || "SUCCESS"}
              </strong>

            </div>


            <div>

              <span>
                PAYMENT METHOD
              </span>

              <strong>
                {payment?.paymentMethod || "Online Payment"}
              </strong>

            </div>

          </div>

        </div>


        {/* FARE CARD */}

        <div className="fare-card">

          <div>

            <span>
              SEATS
            </span>

            <strong>
              {selectedSeats.length}
            </strong>

          </div>


          <div>

            <span>
              FARE / SEAT
            </span>

            <strong>
              ₹{bus.price}
            </strong>

          </div>


          <div className="total-fare">

            <span>
              TOTAL AMOUNT
            </span>

            <strong>
              ₹{selectedSeats.length * bus.price}
            </strong>

          </div>

        </div>


        {error && (

          <div className="booking-error">
            {error}
          </div>

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