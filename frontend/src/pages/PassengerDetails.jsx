import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PassengerDetails.css";

function PassengerDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");

  const selectedSeats = seats ? seats.split(",") : [];

  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [bus, setBus] = useState(null);

  const handleChange = (e) => {
    setPassenger({
      ...passenger,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/buses"
      );

      if (!response.ok) {
        throw new Error("Unable to fetch bus details");
      }

      const buses = await response.json();

      const selectedBus = buses.find(
        (item) => Number(item.id) === Number(busId)
      );

      if (!selectedBus) {
        alert("Bus details not found.");
        return;
      }

      setBus(selectedBus);

      const totalAmount =
        selectedSeats.length * selectedBus.price;

      navigate(
        `/payment?busId=${encodeURIComponent(
          busId || ""
        )}&seats=${encodeURIComponent(
          seats || ""
        )}&date=${encodeURIComponent(
          journeyDate || ""
        )}&amount=${encodeURIComponent(
          totalAmount
        )}`,
        {
          state: {
            passenger: passenger,
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Unable to continue. Please try again.");
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

          <strong>
            {formatDate(journeyDate)}
          </strong>
        </div>

        <div>
          <span>SELECTED SEATS</span>

          <strong>
            {selectedSeats.join(", ")}
          </strong>
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

            <label>FULL NAME</label>

            <input
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

              <label>AGE</label>

              <input
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

              <label>GENDER</label>

              <select
                name="gender"
                value={passenger.gender}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>


          <div className="form-group">

            <label>PHONE NUMBER</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={passenger.phone}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>EMAIL ADDRESS</label>

            <input
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
          >
            Confirm Details →
          </button>

        </form>

      </div>

    </div>
  );
}

export default PassengerDetails;