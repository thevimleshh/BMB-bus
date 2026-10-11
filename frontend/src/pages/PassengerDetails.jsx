
import { useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./PassengerDetails.css";

const API_URL = "https://bmb-bus.onrender.com";

function PassengerDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Pickup and drop details from PickupDrop page
  const pickupDrop = location.state || {};

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");

  const selectedSeats = seats
    ? seats.split(",").filter(Boolean)
    : [];

  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPassenger((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    if (!date) return "";

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    console.log("Passenger form submitted");
    console.log("Bus ID:", busId);
    console.log("Selected seats:", selectedSeats);
    console.log("Journey date:", journeyDate);
    console.log("API URL:", `${API_URL}/api/buses`);

    // Validate URL parameters
    if (!busId || selectedSeats.length === 0) {
      alert("Bus ID or selected seats are missing. Please select your bus and seats again.");
      return;
    }

    // Validate pickup/drop details
    if (
      pickupDrop.pickupStopId == null ||
      pickupDrop.dropStopId == null
    ) {
      alert("Pickup and drop details are missing. Please select them again.");

      navigate(
        `/pickup-drop?busId=${encodeURIComponent(
          busId
        )}&seats=${encodeURIComponent(
          seats || ""
        )}&date=${encodeURIComponent(
          journeyDate || ""
        )}`
      );

      return;
    }

    setLoading(true);

    try {
      // Fetch buses from local Spring Boot backend
      const response = await fetch(`${API_URL}/api/buses`);

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Bus API failed with HTTP status ${response.status}`
        );
      }

      const buses = await response.json();

      console.log("Bus API response:", buses);

      if (!Array.isArray(buses)) {
        throw new Error("Bus API did not return a list of buses");
      }

      const selectedBus = buses.find(
        (item) => Number(item.id) === Number(busId)
      );

      if (!selectedBus) {
        alert("Bus details not found. Please select your bus again.");
        return;
      }

      const price = Number(selectedBus.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Invalid bus ticket price");
      }

      const totalAmount = selectedSeats.length * price;

      console.log("Total amount:", totalAmount);

      // Preserve all details for Payment and Booking Confirmation
      navigate(
        `/payment?busId=${encodeURIComponent(
          busId
        )}&seats=${encodeURIComponent(
          selectedSeats.join(",")
        )}&date=${encodeURIComponent(
          journeyDate || ""
        )}&amount=${encodeURIComponent(totalAmount)}`,
        {
          state: {
            passenger: {
              ...passenger,
              age: Number(passenger.age),
            },

            pickupStopId: pickupDrop.pickupStopId,
            dropStopId: pickupDrop.dropStopId,

            pickupStopName: pickupDrop.pickupStopName,
            pickupCity: pickupDrop.pickupCity,
            pickupAddress: pickupDrop.pickupAddress || "",

            dropStopName: pickupDrop.dropStopName,
            dropCity: pickupDrop.dropCity,
            dropAddress: pickupDrop.dropAddress || "",
          },
        }
      );
    } catch (error) {
      console.error("PassengerDetails error:", error);

      alert(
        `Unable to load bus details: ${error.message}. Check the browser console for details.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passenger-page">
      <div className="passenger-header">
        <span>PASSENGER DETAILS</span>

        <h1>Confirm Your Details</h1>

        <p>
          Enter passenger information to continue with your booking.
        </p>
      </div>

      {/* JOURNEY SUMMARY */}
      <div className="passenger-journey-summary">
        <div>
          <span>JOURNEY DATE</span>
          <strong>{formatDate(journeyDate)}</strong>
        </div>

        <div>
          <span>SELECTED SEATS</span>
          <strong>{selectedSeats.join(", ")}</strong>
        </div>
      </div>

      {/* PASSENGER FORM */}
      <div className="passenger-container">
        <form
          className="passenger-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section">
            <h2>Passenger Information</h2>

            <p>
              Please enter the details of the passenger.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="passenger-name">FULL NAME</label>

            <input
              id="passenger-name"
              type="text"
              name="name"
              placeholder="Enter passenger name"
              value={passenger.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="passenger-age">AGE</label>

              <input
                id="passenger-age"
                type="number"
                name="age"
                placeholder="Enter age"
                min="1"
                max="120"
                value={passenger.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passenger-gender">GENDER</label>

              <select
                id="passenger-gender"
                name="gender"
                value={passenger.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="passenger-phone">PHONE NUMBER</label>

            <input
              id="passenger-phone"
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={passenger.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passenger-email">EMAIL ADDRESS</label>

            <input
              id="passenger-email"
              type="email"
              name="email"
              placeholder="Enter email address"
              value={passenger.email}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="continue-passenger-btn"
            disabled={loading}
          >
            {loading
              ? "Loading bus details..."
              : "Continue to Payment →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PassengerDetails;
