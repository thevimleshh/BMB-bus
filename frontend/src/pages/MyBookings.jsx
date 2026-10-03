import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/bookings", {
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("bmb_token")}`
  }
}).then(
        (response) => {
          if (!response.ok) {
            throw new Error("Unable to fetch bookings");
          }

          return response.json();
        }
      ),

      fetch("http://localhost:8080/api/buses").then(
        (response) => {
          if (!response.ok) {
            throw new Error("Unable to fetch buses");
          }

          return response.json();
        }
      ),
    ])
      .then(([bookingData, busData]) => {
        setBookings(bookingData);
        setBuses(busData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, []);

  const getBus = (busId) => {
    return buses.find(
      (bus) => bus.id === busId
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const dateObject = new Date(
      date + "T00:00:00"
    );

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="my-bookings-page">

        <div className="bookings-loading">

          <div className="booking-spinner"></div>

          <h2>Loading your bookings...</h2>

          <p>
            Please wait a moment.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="my-bookings-page">

      {/* HEADER */}

      <div className="my-bookings-header">

        <span>YOUR JOURNEYS</span>

        <h1>My Bookings</h1>

        <p>
          View and manage all your BMB bus bookings.
        </p>

      </div>


      {/* BOOKINGS */}

      <div className="bookings-container">

        {bookings.length === 0 ? (

          <div className="no-bookings">

            <div className="no-bookings-icon">
              🎫
            </div>

            <h2>No bookings yet</h2>

            <p>
              You haven't made any bus bookings yet.
            </p>

            <button
              onClick={() => navigate("/routes")}
            >
              Explore Bus Routes →
            </button>

          </div>

        ) : (

          bookings.map((booking) => {

            const bus = getBus(booking.busId);

            return (
              <div
                className="booking-card"
                key={booking.id}
              >

                {/* CARD TOP */}

                <div className="booking-card-top">

                  <div>

                    <span>BOOKING ID</span>

                    <strong>
                      #{booking.id}
                    </strong>

                  </div>

                  <div className="booking-status">
                    CONFIRMED
                  </div>

                </div>


                {/* ROUTE */}

                {bus && (
                  <div className="booking-route">

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


                    <div className="booking-arrow">
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
                )}


                <div className="booking-divider"></div>


                {/* DETAILS */}

                <div className="booking-details">

                  <div className="booking-highlight">

                    <span>
                      JOURNEY DATE
                    </span>

                    <strong>
                      {formatDate(
                        booking.journeyDate
                      )}
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
                      BUS
                    </span>

                    <strong>
                      {bus
                        ? bus.busName
                        : "Bus"}
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
                      AMOUNT
                    </span>

                    <strong className="booking-price">
                      ₹{booking.totalAmount}
                    </strong>

                  </div>

                </div>


                {/* BOTTOM */}

                <div className="booking-bottom">

                  <span>
                    Booked #{booking.id}
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/booking-details?id=${booking.id}`
                      )
                    }
                  >
                    View Details →
                  </button>

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}

export default MyBookings;