import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
        "https://bmb-bus.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      // Save JWT token
      localStorage.setItem("bmb_token", data.token);

      localStorage.setItem(
        "bmb_user_email",
        form.email
      );

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      setMessage(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

      <div className="login-left">

        <div className="login-brand">
          <div className="login-logo">B</div>

          <div>
            <h1>BMB</h1>
            <span>BOOK MY BUS</span>
          </div>
        </div>

        <div className="login-content">

          <span className="login-tag">
            WELCOME BACK
          </span>

          <h2>
            Your journey
            <br />
            continues <span>here.</span>
          </h2>

          <p>
            Login to your BMB account and manage
            your bus bookings from one place.
          </p>

          <div className="login-features">

            <div>
              <span>✓</span>
              <p>Book your bus easily</p>
            </div>

            <div>
              <span>✓</span>
              <p>View your bookings</p>
            </div>

            <div>
              <span>✓</span>
              <p>Secure JWT authentication</p>
            </div>

          </div>

        </div>

        <div className="login-footer">
          © 2026 BMB — Book My Bus
        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">

          <div className="mobile-login-logo">

            <div className="login-logo">
              B
            </div>

            <div>
              <h1>BMB</h1>
              <span>BOOK MY BUS</span>
            </div>

          </div>


          <div className="login-heading">

            <span>
              ACCOUNT LOGIN
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Enter your credentials to continue.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label>
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="login-field">

              <label>
                PASSWORD
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>


            {message && (
              <div
                className={`login-message ${
                  message.includes("successful")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="login-signup">

            <span>
              Don't have an account?
            </span>

            <Link to="/signup">
              Create Account
            </Link>

          </div>


          <div className="login-security">

            <span>🔒</span>

            <p>
              Your login is protected by JWT authentication.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;