import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./BusList.css";

function BusList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const journeyDate = searchParams.get("date");

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://bmb-bus.onrender.com/api/buses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch buses");
        }

        return response.json();
      })
      .then((data) => {

        const filteredBuses = data.filter((bus) => {

          const fromMatch =
            bus.fromCity?.toLowerCase() === from?.toLowerCase();

          const toMatch =
            bus.toCity?.toLowerCase() === to?.toLowerCase();

          return fromMatch && toMatch;
        });

        setBuses(filteredBuses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching buses:", error);
        setLoading(false);
      });
  }, [from, to]);

  const handleSelectBus = (bus) => {
    navigate(
      `/seat-selection?busId=${bus.id}&date=${encodeURIComponent(
        journeyDate || ""
      )}`
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bus-list-page">
        <div className="bus-loading">
          <h2>Finding available buses...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bus-list-page">

      <div className="bus-list-header">

        <button
          className="back-btn"
          onClick={() => navigate("/routes")}
        >
          ← Back to Routes
        </button>

        <span>AVAILABLE BUSES</span>

        <h1>
          {from} → {to}
        </h1>

        <div className="journey-date">
          <span>JOURNEY DATE</span>

          <strong>
            {formatDate(journeyDate)}
          </strong>
        </div>

        <p>
          {buses.length}{" "}
          {buses.length === 1 ? "bus" : "buses"} available
          for your journey
        </p>

      </div>

      <div className="bus-list-container">

        {buses.map((bus) => (

          <div className="bus-card" key={bus.id}>

            <div className="bus-main-info">

              <div className="bus-name-section">

                <div className="bus-icon">
                  🚌
                </div>

                <div>
                  <h2>{bus.busName}</h2>

                  <p>
                    Bus No. {bus.busNumber}
                  </p>
                </div>

              </div>

              <div className="bus-route-time">

                <div className="time-box">

                  <strong>
                    {bus.departureTime}
                  </strong>

                  <span>
                    {bus.fromCity}
                  </span>

                </div>

                <div className="time-line">
                  ───────── →
                </div>

                <div className="time-box">

                  <strong>
                    {bus.arrivalTime}
                  </strong>

                  <span>
                    {bus.toCity}
                  </span>

                </div>

              </div>

            </div>

            <div className="bus-divider"></div>

            <div className="bus-details">

              <div className="bus-detail">

                <span>
                  JOURNEY DATE
                </span>

                <strong>
                  {formatDate(journeyDate)}
                </strong>

              </div>

              <div className="bus-detail">

                <span>
                  SEATS
                </span>

                <strong>
                  {bus.totalSeats}
                </strong>

              </div>

              <div className="bus-detail">

                <span>
                  FARE
                </span>

                <strong className="bus-price">
                  ₹{bus.price}
                </strong>

              </div>

              <button
                className="select-bus-btn"
                onClick={() => handleSelectBus(bus)}
              >
                Select Bus →
              </button>

            </div>

          </div>

        ))}

        {buses.length === 0 && (

          <div className="no-buses">

            <div className="no-buses-icon">
              🚌
            </div>

            <h2>
              No buses available
            </h2>

            <p>
              There are no buses available
              for this route right now.
            </p>

            <button
              onClick={() => navigate("/routes")}
            >
              Explore Other Routes
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default BusList;