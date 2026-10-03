import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Routes.css";

function Routes() {

  const [buses, setBuses] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

  const [searchClicked, setSearchClicked] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();


  // =====================================================
  // GET BUSES FROM BACKEND
  // =====================================================

  useEffect(() => {

    fetch("http://localhost:8080/api/buses")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch buses");
        }

        return response.json();

      })

      .then((data) => {

        setBuses(data);

      })

      .catch((error) => {

        console.error(
          "Error fetching buses:",
          error
        );

      });

  }, []);


  // =====================================================
  // READ SEARCH DATA FROM HOME PAGE
  // =====================================================

  useEffect(() => {

    const urlFrom = searchParams.get("from");
    const urlTo = searchParams.get("to");
    const urlDate = searchParams.get("date");

    if (urlFrom || urlTo || urlDate) {

      setFrom(urlFrom || "");
      setTo(urlTo || "");
      setJourneyDate(urlDate || "");

      if (urlFrom && urlTo && urlDate) {
        setSearchClicked(true);
      }

    }

  }, [searchParams]);


  // =====================================================
  // GROUP BUSES INTO ROUTES
  // =====================================================

  const groupedRoutes = {};

  buses.forEach((bus) => {

    const key =
      `${bus.fromCity}-${bus.toCity}`;

    if (!groupedRoutes[key]) {

      groupedRoutes[key] = {

        from: bus.fromCity,

        to: bus.toCity,

        buses: [],

      };

    }

    groupedRoutes[key].buses.push(bus);

  });


  const routes =
    Object.values(groupedRoutes);


  // =====================================================
  // FILTER ROUTES
  // =====================================================

  const filteredRoutes = routes.filter((route) => {

    const fromMatch =
      from.trim() === "" ||
      route.from
        .toLowerCase()
        .includes(from.toLowerCase());

    const toMatch =
      to.trim() === "" ||
      route.to
        .toLowerCase()
        .includes(to.toLowerCase());

    return fromMatch && toMatch;

  });


  // =====================================================
  // SEARCH BUTTON
  // =====================================================

  const handleSearch = () => {

    if (!from.trim() ||
        !to.trim() ||
        !journeyDate) {

      alert(
        "Please enter FROM, TO and Journey Date."
      );

      return;
    }

    setSearchClicked(true);

  };


  // =====================================================
  // VIEW BUSES
  // =====================================================

  const handleViewBuses = (route) => {

    navigate(
      `/buses?from=${encodeURIComponent(
        route.from
      )}&to=${encodeURIComponent(
        route.to
      )}&date=${encodeURIComponent(
        journeyDate
      )}`
    );

  };


  return (

    <div className="routes-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="routes-header">

        <span>
          EXPLORE DESTINATIONS
        </span>

        <h1>
          Popular Bus Routes
        </h1>

        <p>
          Find buses by source, destination and journey date.
        </p>

      </div>


      {/* =================================================
          SEARCH SECTION
      ================================================= */}

      <div className="route-search">


        {/* FROM */}

        <div className="route-input">

          <label>
            FROM
          </label>

          <input
            type="text"
            placeholder="Enter source city"
            value={from}
            onChange={(e) => {

              setFrom(e.target.value);

              setSearchClicked(false);

            }}
          />

        </div>


        {/* TO */}

        <div className="route-input">

          <label>
            TO
          </label>

          <input
            type="text"
            placeholder="Enter destination"
            value={to}
            onChange={(e) => {

              setTo(e.target.value);

              setSearchClicked(false);

            }}
          />

        </div>


        {/* DATE */}

        <div className="route-input">

          <label>
            JOURNEY DATE
          </label>

          <input
            type="date"
            value={journeyDate}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) => {

              setJourneyDate(e.target.value);

              setSearchClicked(false);

            }}
          />

        </div>


        {/* SEARCH */}

        <button
          className="search-buses-btn"
          onClick={handleSearch}
        >
          🔍 Search Buses
        </button>

      </div>


      {/* =================================================
          SEARCH RESULT HEADING
      ================================================= */}

      {searchClicked && (

        <div className="routes-result-heading">

          <span>
            AVAILABLE ROUTES
          </span>

          <h2>
            {from} → {to}
          </h2>

          <p>
            Journey Date:{" "}
            <strong>
              {journeyDate}
            </strong>
          </p>

        </div>

      )}


      {/* =================================================
          ROUTES GRID
      ================================================= */}

      <div className="routes-grid">

        {searchClicked &&
          filteredRoutes.map(
            (route, index) => {

              const startingFare =
                Math.min(
                  ...route.buses.map(
                    (bus) => bus.price
                  )
                );


              return (

                <div
                  className="route-card"
                  key={index}
                >


                  {/* ROUTE */}

                  <div className="route-top">

                    <div className="city">

                      <span>
                        FROM
                      </span>

                      <h2>
                        {route.from}
                      </h2>

                    </div>


                    <div className="route-arrow">
                      →
                    </div>


                    <div className="city">

                      <span>
                        TO
                      </span>

                      <h2>
                        {route.to}
                      </h2>

                    </div>

                  </div>


                  <div className="route-divider"></div>


                  {/* DETAILS */}

                  <div className="route-bottom">


                    <div>

                      <span>
                        AVAILABLE
                      </span>

                      <strong>
                        {route.buses.length}{" "}
                        {route.buses.length === 1
                          ? "Bus"
                          : "Buses"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        STARTING FROM
                      </span>

                      <strong>
                        ₹{startingFare}
                      </strong>

                    </div>


                  </div>


                  {/* VIEW BUSES */}

                  <button
                    className="view-buses-btn"
                    onClick={() =>
                      handleViewBuses(route)
                    }
                  >
                    View Buses →
                  </button>


                </div>

              );

            }
          )}

      </div>


      {/* =================================================
          NO ROUTES
      ================================================= */}

      {searchClicked &&
        filteredRoutes.length === 0 && (

          <div className="no-routes">

            <h3>
              No routes found
            </h3>

            <p>
              Try another FROM or TO city.
            </p>

          </div>

        )}

    </div>

  );

}

export default Routes;