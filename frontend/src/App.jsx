import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route
} from "react-router-dom";


// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";


// =====================================================
// PAGES
// =====================================================

import Routes from "./pages/Routes";
import AddBus from "./pages/AddBus";
import BusList from "./pages/BusList";

import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Offers from "./pages/Offers";
import LoyaltyPoints from "./pages/LoyaltyPoints";
import About from "./pages/About";
import BookingDetails from "./pages/BookingDetails";
import Payment from "./pages/Payment";

// =====================================================
// MAIN CSS
// =====================================================

import "./App.css";


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>


      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          ALL ROUTES
      ================================================= */}

      <RouterRoutes>


        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
            </>
          }
        />


        {/* =================================================
            BUS ROUTES
        ================================================= */}

        <Route
          path="/routes"
          element={<Routes />}
        />


        {/* =================================================
            ADD BUS
        ================================================= */}

        <Route
          path="/add-bus"
          element={<AddBus />}
        />


        {/* =================================================
            BUS LIST
        ================================================= */}

        <Route
          path="/buses"
          element={<BusList />}
        />


        {/* =================================================
            OFFERS
        ================================================= */}

        <Route
          path="/offers"
          element={<Offers />}
        />


        {/* =================================================
            LOYALTY POINTS
        ================================================= */}

        <Route
          path="/loyalty"
          element={<LoyaltyPoints />}
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* =================================================
            SIGN UP
        ================================================= */}

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            SEAT SELECTION
        ================================================= */}

        <Route
          path="/seat-selection"
          element={<SeatSelection />}
        />


        {/* =================================================
            PASSENGER DETAILS
        ================================================= */}

        <Route
          path="/passenger-details"
          element={<PassengerDetails />}
        />


        {/* =================================================
            BOOKING CONFIRMATION
        ================================================= */}

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />


        {/* =================================================
            MY BOOKINGS
        ================================================= */}

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />
        <Route
  path="/booking-details"
  element={<BookingDetails />}
/>
<Route path="/payment" element={<Payment />} />


      </RouterRoutes>

    </BrowserRouter>
  );
}


export default App;