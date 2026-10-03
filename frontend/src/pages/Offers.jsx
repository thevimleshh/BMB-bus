import { useNavigate } from "react-router-dom";
import "./Offers.css";

function Offers() {

  const navigate = useNavigate();

  return (
    <div className="simple-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <span>
          BOOK MY BUS
        </span>

        <h1>
          Exclusive Offers
        </h1>

        <p>
          Save more on your bus journeys with BMB offers.
        </p>

      </div>


      {/* =================================================
          OFFERS
      ================================================= */}

      <div className="offers-grid">


        {/* =================================================
            OFFER 1
        ================================================= */}

        <div className="offer-card">

          <div className="offer-icon">
            🎟️
          </div>

          <h2>
            First Booking
          </h2>

          <p>
            Get exciting benefits on your first bus booking.
          </p>

          <button
            onClick={() => navigate("/routes")}
          >
            Book Now →
          </button>

        </div>


        {/* =================================================
            OFFER 2
        ================================================= */}

        <div className="offer-card">

          <div className="offer-icon">
            💰
          </div>

          <h2>
            Travel & Save
          </h2>

          <p>
            Enjoy better prices on selected bus routes.
          </p>

          <button
            onClick={() => navigate("/routes")}
          >
            Explore Routes →
          </button>

        </div>


        {/* =================================================
            OFFER 3
        ================================================= */}

        <div className="offer-card">

          <div className="offer-icon">
            🔥
          </div>

          <h2>
            Special Deals
          </h2>

          <p>
            Check out our latest travel deals and offers.
          </p>

          <button
            onClick={() => navigate("/routes")}
          >
            View Deals →
          </button>

        </div>


      </div>

    </div>
  );
}

export default Offers;