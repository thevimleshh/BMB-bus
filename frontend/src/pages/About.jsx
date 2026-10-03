import "./About.css";
function About() {
  return (
    <div className="simple-page">

      <div className="page-header">

        <span>ABOUT BMB</span>

        <h1>Book My Bus</h1>

        <p>
          A simple and convenient platform for booking
          bus tickets and planning your journey.
        </p>

      </div>


      <div className="about-container">

        <div className="about-card">

          <div className="about-logo">
            BMB
          </div>

          <div>

            <h2>Travel Smart. Travel Easy.</h2>

            <p>
              Book My Bus is designed to make bus ticket
              booking simple, convenient and user-friendly.
              Find routes, select your seats and manage
              your bookings from one place.
            </p>

          </div>

        </div>


        <div className="about-features">

          <div>
            <h3>Easy Booking</h3>
            <p>
              Search buses and book your journey easily.
            </p>
          </div>

          <div>
            <h3>Simple Experience</h3>
            <p>
              Clean and easy-to-use booking interface.
            </p>
          </div>

          <div>
            <h3>Secure Account</h3>
            <p>
              Your account is protected with authentication.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default About;