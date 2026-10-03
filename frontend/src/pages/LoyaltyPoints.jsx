import "./LoyaltyPoints.css";
function LoyaltyPoints() {
  return (
    <div className="simple-page">

      <div className="page-header">

        <span>
          BOOK MY BUS
        </span>

        <h1>
          Loyalty Points
        </h1>

        <p>
          Earn points on your journeys and enjoy more benefits with BMB.
        </p>

      </div>


      <div className="loyalty-card">

        <div className="points-icon">
          ⭐
        </div>

        <h2>
          Your BMB Points
        </h2>

        <div className="points-number">
          0
        </div>

        <p>
          Start booking buses to earn loyalty points.
        </p>

        <button
          onClick={() => {
            window.location.href = "/routes";
          }}
        >
          Explore Routes
        </button>

      </div>

    </div>
  );
}

export default LoyaltyPoints;