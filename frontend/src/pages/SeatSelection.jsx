import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SeatSelection.css";

function SeatSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const busId = searchParams.get("busId");
  const journeyDate = searchParams.get("date");

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD BUS + BOOKED SEATS
  useEffect(() => {
    const loadSeatData = async () => {
      try {
        // Get bus details
        const busResponse = await fetch(
          "http://localhost:8080/api/buses"
        );

        if (!busResponse.ok) {
          throw new Error("Unable to fetch buses");
        }

        const buses = await busResponse.json();

        const selectedBus = buses.find(
          (item) => item.id === Number(busId)
        );

        setBus(selectedBus);

        // Get already booked seats
        if (selectedBus && journeyDate) {
          const seatResponse = await fetch(
            `http://localhost:8080/api/bookings/bus/${busId}/date/${journeyDate}/seats`
          );

          if (seatResponse.ok) {
            const bookedSeatData = await seatResponse.json();

            setBookedSeats(
              bookedSeatData.map((seat) => Number(seat))
            );
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading seat data:", error);
        setLoading(false);
      }
    };

    loadSeatData();
  }, [busId, journeyDate]);

  // SELECT / UNSELECT SEAT
  const handleSeatClick = (seatNumber) => {
    // SOLD OUT seat cannot be selected
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat !== seatNumber
        )
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seatNumber,
      ]);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Date not available";

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // LOADING
  if (loading) {
    return (
      <div className="seat-page">
        <div className="seat-loading">
          <div className="loading-circle"></div>

          <h2>Loading seat layout...</h2>

          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // BUS NOT FOUND
  if (!bus) {
    return (
      <div className="seat-page">
        <div className="seat-error">
          <div className="error-icon">🚌</div>

          <h2>Bus not found</h2>

          <p>
            We couldn't find the selected bus.
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

  // CREATE SEAT NUMBERS
  const seats = Array.from(
    { length: bus.totalSeats },
    (_, index) => index + 1
  );

  // TOTAL PRICE
  const totalAmount =
    selectedSeats.length * bus.price;

  return (
    <div className="seat-page">

      {/* HEADER */}

      <div className="seat-header">

        <span>SEAT SELECTION</span>

        <h1>Choose Your Seats</h1>

        <p>
          Select your preferred seats for the journey.
        </p>

      </div>


      {/* JOURNEY INFORMATION */}

      <div className="journey-card">

        <div className="journey-item">

          <span>BUS</span>

          <strong>
            {bus.busName}
          </strong>

          <small>
            Bus No. {bus.busNumber}
          </small>

        </div>


        <div className="journey-item">

          <span>ROUTE</span>

          <strong>
            {bus.fromCity} → {bus.toCity}
          </strong>

          <small>
            {bus.departureTime} - {bus.arrivalTime}
          </small>

        </div>


        <div className="journey-item date-item">

          <span>JOURNEY DATE</span>

          <strong>
            {formatDate(journeyDate)}
          </strong>

          <small>
            Your selected travel date
          </small>

        </div>


        <div className="journey-item">

          <span>FARE</span>

          <strong className="fare">
            ₹{bus.price}
          </strong>

          <small>
            Per seat
          </small>

        </div>

      </div>


      {/* MAIN SEAT AREA */}

      <div className="seat-layout-wrapper">

        <div className="seat-layout-card">

          <div className="seat-layout-header">

            <div>

              <h2>Select Seats</h2>

              <p>
                Tap a seat to select or unselect it.
              </p>

            </div>

            <div className="seat-count">
              {selectedSeats.length} selected
            </div>

          </div>


          {/* LEGEND */}

          <div className="seat-legend">

            <div className="legend-item">

              <span className="legend-seat available"></span>

              Available

            </div>


            <div className="legend-item">

              <span className="legend-seat selected"></span>

              Selected

            </div>


            <div className="legend-item">

              <span className="legend-seat sold-out"></span>

              Sold Out

            </div>

          </div>


          {/* BUS */}

          <div className="bus-interior">

            <div className="driver-area">

              <div className="steering">
                ◉
              </div>

              <span>Driver</span>

            </div>


            <div className="seat-grid">

              {seats.map((seat) => {

                const isSelected =
                  selectedSeats.includes(seat);

                const isBooked =
                  bookedSeats.includes(seat);

                return (

                  <button
                    key={seat}
                    className={`seat ${
                      isBooked
                        ? "sold-out"
                        : isSelected
                        ? "selected"
                        : ""
                    }`}
                    disabled={isBooked}
                    onClick={() =>
                      handleSeatClick(seat)
                    }
                  >

                    <span className="seat-number">
                      {seat}
                    </span>

                    {isBooked && (
                      <span className="sold-out-text">
                        SOLD
                      </span>
                    )}

                  </button>

                );

              })}

            </div>

          </div>

        </div>


        {/* BOOKING SUMMARY */}

        <div className="booking-summary">

          <div className="summary-header">

            <span>BOOKING SUMMARY</span>

            <h2>Your Selection</h2>

          </div>


          <div className="summary-route">

            <strong>
              {bus.fromCity}
            </strong>

            <span>→</span>

            <strong>
              {bus.toCity}
            </strong>

          </div>


          <div className="summary-date">

            <span>JOURNEY DATE</span>

            <strong>
              {formatDate(journeyDate)}
            </strong>

          </div>


          <div className="summary-row">

            <span>Bus</span>

            <strong>
              {bus.busName}
            </strong>

          </div>


          <div className="summary-row">

            <span>Seats</span>

            <strong>
              {selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "None selected"}
            </strong>

          </div>


          <div className="summary-row">

            <span>Price / Seat</span>

            <strong>
              ₹{bus.price}
            </strong>

          </div>


          <div className="summary-divider"></div>


          <div className="summary-total">

            <span>Total Amount</span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>


          {/* CONTINUE BUTTON */}

          <button
            className="continue-btn"
            disabled={
              selectedSeats.length === 0
            }
            onClick={() => {

              const token =
                localStorage.getItem("bmb_token");

              if (!token) {

                alert(
                  "Please login before booking a ticket."
                );

                navigate("/login");

                return;
              }

              navigate(
                `/passenger-details?busId=${bus.id}&seats=${selectedSeats.join(
                  ","
                )}&date=${encodeURIComponent(
                  journeyDate
                )}`
              );

            }}
          >

            Continue to Passenger Details

            <span>→</span>

          </button>

        </div>

      </div>

    </div>
  );
}

export default SeatSelection;