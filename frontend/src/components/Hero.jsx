import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [passengers, setPassengers] = useState("1");


  // =====================================================
  // SWAP SOURCE AND DESTINATION
  // =====================================================

  const handleSwap = () => {

    const oldFrom = from;

    setFrom(to);
    setTo(oldFrom);

  };


  // =====================================================
  // SEARCH BUSES
  // =====================================================

  const handleSearch = () => {

    if (!from.trim()) {
      alert("Please enter your source.");
      return;
    }

    if (!to.trim()) {
      alert("Please enter your destination.");
      return;
    }

    if (!travelDate) {
      alert("Please select your travel date.");
      return;
    }


    // Send search details to Routes page

    navigate(
      `/routes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(travelDate)}&passengers=${passengers}`
    );

  };


  return (

    <section className="hero">

      <div className="hero-content">


        {/* =================================================
            HERO TEXT
        ================================================= */}

        <div className="hero-text">

          <span className="small-heading">
            TRAVEL SMART • TRAVEL EASY
          </span>

          <h1>
            Your Journey,
            <br />
            <span>Our Responsibility.</span>
          </h1>

          <p>
            Book bus tickets easily, find the best routes,
            choose your favourite seats and travel comfortably
            with BMB.
          </p>

        </div>


        {/* =================================================
            BOOKING CARD
        ================================================= */}

        <div className="booking-card">


          <div className="booking-title">

            <h2>
              Where do you want to go?
            </h2>

            <p>
              Search buses and plan your journey easily
            </p>

          </div>


          {/* =================================================
              FROM / TO
          ================================================= */}

          <div className="location-row">


            {/* FROM */}

            <div className="input-box">

              <label>
                FROM
              </label>

              <input
                type="text"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                placeholder="Enter source"
              />

            </div>


            {/* SWAP */}

            <button
              type="button"
              className="swap-btn"
              title="Swap locations"
              onClick={handleSwap}
            >
              ⇄
            </button>


            {/* TO */}

            <div className="input-box">

              <label>
                TO
              </label>

              <input
                type="text"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                placeholder="Enter destination"
              />

            </div>

          </div>


          {/* =================================================
              DATE / PASSENGERS
          ================================================= */}

          <div className="details-row">


            {/* DATE */}

            <div className="input-box">

              <label>
                TRAVEL DATE
              </label>

              <input
                type="date"
                value={travelDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setTravelDate(e.target.value)
                }
              />

            </div>


            {/* PASSENGERS */}

            <div className="input-box">

              <label>
                PASSENGERS
              </label>

              <select
                value={passengers}
                onChange={(e) =>
                  setPassengers(e.target.value)
                }
              >

                <option value="1">
                  1 Passenger
                </option>

                <option value="2">
                  2 Passengers
                </option>

                <option value="3">
                  3 Passengers
                </option>

                <option value="4">
                  4 Passengers
                </option>

                <option value="5">
                  5 Passengers
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              SEARCH BUTTON
          ================================================= */}

          <button
            type="button"
            className="search-btn"
            onClick={handleSearch}
          >
            Search Buses →
          </button>


        </div>

      </div>

    </section>

  );
}

export default Hero;