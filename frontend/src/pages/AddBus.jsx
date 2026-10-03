import { useState } from "react";
import "./AddBus.css";

function AddBus() {
  const [bus, setBus] = useState({
    busNumber: "",
    busName: "",
    fromCity: "",
    toCity: "",
    departureTime: "",
    arrivalTime: "",
    journeyDate: "",
    price: "",
    totalSeats: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBus({
      ...bus,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Step 1: Add bus
      const busResponse = await fetch(
        "http://localhost:8080/api/buses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            busNumber: bus.busNumber,
            busName: bus.busName,
            fromCity: bus.fromCity,
            toCity: bus.toCity,
            departureTime: bus.departureTime,
            arrivalTime: bus.arrivalTime,
            price: Number(bus.price),
            totalSeats: Number(bus.totalSeats)
          })
        }
      );

      if (!busResponse.ok) {
        throw new Error("Failed to add bus");
      }

      const savedBus = await busResponse.json();

      console.log("Bus added:", savedBus);

      // Step 2: Add bus schedule
      const scheduleResponse = await fetch(
        "http://localhost:8080/api/bus-schedules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            busId: savedBus.id,
            journeyDate: bus.journeyDate,
            availableSeats: Number(bus.totalSeats)
          })
        }
      );

      if (!scheduleResponse.ok) {
        throw new Error(
          "Bus was added, but journey schedule could not be saved."
        );
      }

      const savedSchedule = await scheduleResponse.json();

      console.log("Schedule added:", savedSchedule);

      alert("Bus and journey date added successfully!");

      setBus({
        busNumber: "",
        busName: "",
        fromCity: "",
        toCity: "",
        departureTime: "",
        arrivalTime: "",
        journeyDate: "",
        price: "",
        totalSeats: ""
      });

    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to add bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bus-page">

      <div className="add-bus-header">
        <div className="add-bus-header-icon">
          🚌
        </div>

        <div>
          <span>BUS MANAGEMENT</span>
          <h1>Add New Bus</h1>
          <p>
            Add a bus and schedule its journey for a specific date.
          </p>
        </div>
      </div>

      <div className="add-bus-container">

        <form
          className="add-bus-card"
          onSubmit={handleSubmit}
        >

          <div className="form-section">
            <div className="section-number">01</div>

            <div>
              <h2>Bus Information</h2>
              <p>Enter the basic details of the bus.</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>BUS NUMBER</label>

              <input
                type="text"
                name="busNumber"
                placeholder="e.g. BMB1021"
                value={bus.busNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>BUS NAME</label>

              <input
                type="text"
                name="busName"
                placeholder="e.g. BMB Express"
                value={bus.busName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>FROM CITY</label>

              <input
                type="text"
                name="fromCity"
                placeholder="e.g. Mumbai"
                value={bus.fromCity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>TO CITY</label>

              <input
                type="text"
                name="toCity"
                placeholder="e.g. Nashik"
                value={bus.toCity}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <div className="section-number">02</div>

            <div>
              <h2>Journey Schedule</h2>
              <p>Set the travel date and departure timings.</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>JOURNEY DATE</label>

              <input
                type="date"
                name="journeyDate"
                value={bus.journeyDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>DEPARTURE TIME</label>

              <input
                type="time"
                name="departureTime"
                value={bus.departureTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>ARRIVAL TIME</label>

              <input
                type="time"
                name="arrivalTime"
                value={bus.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-divider"></div>

          <div className="form-section">
            <div className="section-number">03</div>

            <div>
              <h2>Pricing & Seats</h2>
              <p>Set the ticket fare and total available seats.</p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">
              <label>TICKET PRICE</label>

              <div className="input-with-symbol">
                <span>₹</span>

                <input
                  type="number"
                  name="price"
                  placeholder="424"
                  min="1"
                  value={bus.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>TOTAL SEATS</label>

              <input
                type="number"
                name="totalSeats"
                placeholder="45"
                min="1"
                value={bus.totalSeats}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="schedule-note">
            <div className="note-icon">✓</div>

            <div>
              <strong>Journey schedule</strong>
              <p>
                The selected date and total seats will be saved
                separately as this bus's journey schedule.
              </p>
            </div>
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="clear-btn"
              onClick={() =>
                setBus({
                  busNumber: "",
                  busName: "",
                  fromCity: "",
                  toCity: "",
                  departureTime: "",
                  arrivalTime: "",
                  journeyDate: "",
                  price: "",
                  totalSeats: ""
                })
              }
              disabled={loading}
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="add-bus-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Adding Bus...
                </>
              ) : (
                <>
                  Add Bus
                  <span>→</span>
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddBus;