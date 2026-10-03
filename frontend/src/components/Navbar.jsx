import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {

  const [active, setActive] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();


  // =====================================================
  // NAVBAR LINKS
  // =====================================================

  const links = [
    {
      name: "Home",
      path: "/"
    },
    {
      name: "Routes",
      path: "/routes"
    },
    {
      name: "Offers",
      path: "/offers"
    },
    {
      name: "Loyalty Points",
      path: "/loyalty"
    },
    {
      name: "My Bookings",
      path: "/my-bookings"
    },
    {
      name: "About",
      path: "/about"
    }
  ];


  // =====================================================
  // CHECK LOGIN
  // =====================================================

  const checkLogin = () => {

    const token = localStorage.getItem("bmb_token");
    const email = localStorage.getItem("bmb_user_email");

    if (token && email) {

      setIsLoggedIn(true);
      setUserEmail(email);

    } else {

      setIsLoggedIn(false);
      setUserEmail("");

    }
  };


  // =====================================================
  // CHECK LOGIN WHEN PAGE / ROUTE CHANGES
  // =====================================================

  useEffect(() => {

    checkLogin();

  }, [location]);


  // =====================================================
  // STORAGE LISTENER
  // =====================================================

  useEffect(() => {

    window.addEventListener(
      "storage",
      checkLogin
    );

    return () => {

      window.removeEventListener(
        "storage",
        checkLogin
      );

    };

  }, []);


  // =====================================================
  // SET ACTIVE NAVBAR LINK
  // =====================================================

  useEffect(() => {

    const currentLink = links.find(
      (link) => link.path === location.pathname
    );

    if (currentLink) {

      setActive(currentLink.name);

    }

  }, [location.pathname]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("bmb_token");
    localStorage.removeItem("bmb_user_email");

    setIsLoggedIn(false);
    setUserEmail("");

    navigate("/login");
  };


  // =====================================================
  // DISPLAY NAME
  // =====================================================

  const getDisplayName = () => {

    if (!userEmail) {
      return "";
    }

    return userEmail
      .split("@")[0]
      .replace(/[._-]/g, " ");

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <nav className="navbar">


      {/* =================================================
          LOGO
      ================================================= */}

      <div className="logo">

        <div className="logo-box">
          BMB
        </div>

        <div>

          <h2>
            Book My Bus
          </h2>

          <span>
            TRAVEL SMART
          </span>

        </div>

      </div>


      {/* =================================================
          NAVIGATION LINKS
      ================================================= */}

      <div className="nav-links">

        {links.map((link) => (

          <Link
            key={link.name}
            to={link.path}
            className={
              active === link.name
                ? "active"
                : ""
            }
            onClick={() =>
              setActive(link.name)
            }
          >
            {link.name}
          </Link>

        ))}

      </div>


      {/* =================================================
          LOGIN / USER SECTION
      ================================================= */}

      {isLoggedIn ? (

        <div className="user-section">


          {/* USER NAME */}

          <div className="user-welcome">

            <span className="welcome-small">
              WELCOME BACK
            </span>

            <span className="welcome-name">
              {getDisplayName()} 👋
            </span>

          </div>


          {/* LOGOUT BUTTON */}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      ) : (


        /* =================================================
           LOGIN BUTTON
        ================================================= */

        <Link
          to="/login"
          className="login-btn"
        >
          Login / Sign Up
        </Link>

      )}

    </nav>

  );
}

export default Navbar;