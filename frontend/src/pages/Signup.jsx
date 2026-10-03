import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Signup failed");
      }

      setMessage("Account created successfully!");

      setForm({
        name: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-left">
        <div className="signup-brand">
          <div className="signup-logo">B</div>

          <div>
            <h1>BMB</h1>
            <span>BOOK MY BUS</span>
          </div>
        </div>

        <div className="signup-content">
          <span className="signup-tag">WELCOME TO BMB</span>

          <h2>
            Your journey
            <br />
            starts <span>here.</span>
          </h2>

          <p>
            Create your BMB account and make your bus
            booking experience simple, fast and convenient.
          </p>

          <div className="signup-features">
            <div>
              <span>✓</span>
              <p>Easy bus booking</p>
            </div>

            <div>
              <span>✓</span>
              <p>Secure account</p>
            </div>

            <div>
              <span>✓</span>
              <p>Manage your bookings</p>
            </div>
          </div>
        </div>

        <div className="signup-footer">
          © 2026 BMB — Book My Bus
        </div>
      </div>

      <div className="signup-right">

        <div className="signup-card">

          <div className="mobile-logo">
            <div className="signup-logo">B</div>
            <div>
              <h1>BMB</h1>
              <span>BOOK MY BUS</span>
            </div>
          </div>

          <div className="signup-heading">
            <span>CREATE ACCOUNT</span>

            <h2>Join BMB</h2>

            <p>
              Create your account to start booking buses.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="signup-field">
              <label>FULL NAME</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <label>EMAIL ADDRESS</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <label>PASSWORD</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            {message && (
              <div
                className={`signup-message ${
                  message.includes("successfully")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="signup-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="signup-login">
            <span>Already have an account?</span>

            <Link to="/login">
              Login
            </Link>
          </div>

          <div className="signup-security">
            <span>🔒</span>
            <p>Your account is securely protected.</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;