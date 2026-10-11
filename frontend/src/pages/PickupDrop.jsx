
import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./PickupDrop.css";
const API_URL = "https://bmb-bus.onrender.com";

function PickupDrop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const busId = searchParams.get("busId");
  const seats = searchParams.get("seats");
  const journeyDate = searchParams.get("date");

  const [bus, setBus] = useState(null);
  const [pickupStops, setPickupStops] = useState([]);
  const [dropStops, setDropStops] = useState([]);

  const [selectedPickup, setSelectedPickup] = useState("");
  const [selectedDrop, setSelectedDrop] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API response ko array mein convert karna
  const getStopsArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.stops)) {
      return data.stops;
    }

    if (Array.isArray(data?.content)) {
      return data.content;
    }

    return [];
  };

  // Bus, pickup aur drop points load karna
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        if (!busId) {
          throw new Error(
            "Bus ID missing hai. Please bus dobara select karo."
          );
        }

        const busUrl = `${API_URL}/api/buses`;

        const pickupUrl =
          `${API_URL}/api/buses/${encodeURIComponent(
            busId
          )}/stops?type=PICKUP`;

        const dropUrl =
          `${API_URL}/api/buses/${encodeURIComponent(
            busId
          )}/stops?type=DROP`;

        console.log("Selected Bus ID:", busId);
        console.log("Bus API:", busUrl);
        console.log("Pickup API:", pickupUrl);
        console.log("Drop API:", dropUrl);

        const [
          busResponse,
          pickupResponse,
          dropResponse,
        ] = await Promise.all([
          fetch(busUrl),
          fetch(pickupUrl),
          fetch(dropUrl),
        ]);

        console.log("Bus status:", busResponse.status);
        console.log(
          "Pickup status:",
          pickupResponse.status
        );
        console.log("Drop status:", dropResponse.status);

        if (!busResponse.ok) {
          throw new Error(
            `Bus API failed: HTTP ${busResponse.status}`
          );
        }

        if (!pickupResponse.ok) {
          throw new Error(
            `Pickup API failed: HTTP ${pickupResponse.status}`
          );
        }

        if (!dropResponse.ok) {
          throw new Error(
            `Drop API failed: HTTP ${dropResponse.status}`
          );
        }

        const buses = await busResponse.json();
        const pickupData = await pickupResponse.json();
        const dropData = await dropResponse.json();

        console.log("All buses:", buses);
        console.log("Pickup response:", pickupData);
        console.log("Drop response:", dropData);

        if (!Array.isArray(buses)) {
          throw new Error(
            "Bus API ka response expected list format mein nahi hai."
          );
        }

        const selectedBus = buses.find(
          (item) => Number(item.id) === Number(busId)
        );

        if (!selectedBus) {
          throw new Error(
            `Bus ID ${busId} nahi mili. Please bus dobara select karo.`
          );
        }

        const pickups = getStopsArray(pickupData);
        const drops = getStopsArray(dropData);

        console.log("Parsed pickup points:", pickups);
        console.log("Parsed drop points:", drops);

        if (cancelled) return;

        setBus(selectedBus);
        setPickupStops(pickups);
        setDropStops(drops);
      } catch (err) {
        console.error("Pickup/drop loading error:", err);

        if (!cancelled) {
          setError(err.message || "Unknown error occurred.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [busId]);

  // Stop ka ID alag data types mein ho sakta hai
  const getStopId = (stop) =>
    stop.id ?? stop.stopId;

  const getStopName = (stop) =>
    stop.stopName ??
    stop.name ??
    stop.pointName ??
    "Unnamed stop";

  const getStopCity = (stop) =>
    stop.city ??
    stop.cityName ??
    "";

  const getStopAddress = (stop) =>
    stop.address ??
    stop.location ??
    "";

  // Passenger Details page par jaana
  const handleContinue = () => {
    if (pickupStops.length === 0 || dropStops.length === 0) {
      alert(
        "Pickup/drop points load nahi hue. Please bus ke stop records check karvao."
      );
      return;
    }

    if (!selectedPickup || !selectedDrop) {
      alert("Please pickup aur drop dono points select karo.");
      return;
    }

    if (selectedPickup === selectedDrop) {
      alert("Pickup aur drop points alag select karo.");
      return;
    }

    const pickup = pickupStops.find(
      (stop) =>
        String(getStopId(stop)) === selectedPickup
    );

    const drop = dropStops.find(
      (stop) =>
        String(getStopId(stop)) === selectedDrop
    );

    if (!pickup || !drop) {
      alert("Selected pickup/drop point nahi mila.");
      return;
    }

    navigate(
      `/passenger-details?busId=${encodeURIComponent(
        busId
      )}&seats=${encodeURIComponent(
        seats || ""
      )}&date=${encodeURIComponent(
        journeyDate || ""
      )}`,
      {
        state: {
          pickupStopId: getStopId(pickup),
          dropStopId: getStopId(drop),

          pickupStopName: getStopName(pickup),
          pickupCity: getStopCity(pickup),
          pickupAddress: getStopAddress(pickup),

          dropStopName: getStopName(drop),
          dropCity: getStopCity(drop),
          dropAddress: getStopAddress(drop),
        },
      }
    );
  };

  // Loading screen
  if (loading) {
    return (
      <div className="pickup-page">
        <div className="pickup-card">
          <h2>Loading pickup and drop points...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error || !bus) {
    return (
      <div className="pickup-page">
        <div className="pickup-card">
          <h2>Unable to load journey</h2>
          <p>{error || "Bus details unavailable."}</p>

          <button onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pickup-page">
      <div className="pickup-header">
        <span>BOOK YOUR JOURNEY</span>

        <h1>Select Pickup & Drop Points</h1>

        <p>
          Passenger details bharne se pehle apne boarding
          aur destination points choose karo.
        </p>
      </div>

      <div className="pickup-card">
        {/* Bus summary */}
        <div className="pickup-bus-summary">
          <h2>{bus.busName}</h2>

          <p>
            {bus.fromCity} → {bus.toCity}
          </p>

          <div className="pickup-summary-row">
            <span>Bus Number</span>
            <strong>{bus.busNumber}</strong>
          </div>

          <div className="pickup-summary-row">
            <span>Departure</span>
            <strong>{bus.departureTime}</strong>
          </div>

          <div className="pickup-summary-row">
            <span>Arrival</span>
            <strong>{bus.arrivalTime}</strong>
          </div>

          <div className="pickup-summary-row">
            <span>Journey Date</span>
            <strong>{journeyDate || "Not selected"}</strong>
          </div>

          <div className="pickup-summary-row">
            <span>Selected Seats</span>
            <strong>{seats || "Not selected"}</strong>
          </div>
        </div>

        {/* Pickup and drop form */}
        <div className="pickup-form-section">
          <label htmlFor="pickupPoint">
            📍 Choose Pickup Point
          </label>

          <select
            id="pickupPoint"
            value={selectedPickup}
            onChange={(event) =>
              setSelectedPickup(event.target.value)
            }
            required
            disabled={pickupStops.length === 0}
          >
            <option value="">
              Select your boarding point
            </option>

            {pickupStops.map((stop, index) => {
              const stopId = getStopId(stop);

              return (
                <option
                  key={stopId ?? index}
                  value={String(stopId)}
                >
                  {getStopName(stop)}
                  {getStopCity(stop)
                    ? ` - ${getStopCity(stop)}`
                    : ""}
                  {getStopAddress(stop)
                    ? ` (${getStopAddress(stop)})`
                    : ""}
                </option>
              );
            })}
          </select>

          {pickupStops.length === 0 && (
            <p className="pickup-warning">
              Is bus ke liye pickup points nahi mile.
            </p>
          )}

          <label htmlFor="dropPoint">
            🏁 Choose Drop Point
          </label>

          <select
            id="dropPoint"
            value={selectedDrop}
            onChange={(event) =>
              setSelectedDrop(event.target.value)
            }
            required
            disabled={dropStops.length === 0}
          >
            <option value="">
              Select your destination point
            </option>

            {dropStops.map((stop, index) => {
              const stopId = getStopId(stop);

              return (
                <option
                  key={stopId ?? index}
                  value={String(stopId)}
                >
                  {getStopName(stop)}
                  {getStopCity(stop)
                    ? ` - ${getStopCity(stop)}`
                    : ""}
                  {getStopAddress(stop)
                    ? ` (${getStopAddress(stop)})`
                    : ""}
                </option>
              );
            })}
          </select>

          {dropStops.length === 0 && (
            <p className="pickup-warning">
              Is bus ke liye drop points nahi mile.
            </p>
          )}

          {/* Selected journey summary */}
          {selectedPickup && selectedDrop && (
            <div className="pickup-selection-summary">
              <strong>Your selected journey</strong>

              <p>
                Pickup:{" "}
                {getStopName(
                  pickupStops.find(
                    (stop) =>
                      String(getStopId(stop)) ===
                      selectedPickup
                  ) || {}
                )}
              </p>

              <p>
                Drop:{" "}
                {getStopName(
                  dropStops.find(
                    (stop) =>
                      String(getStopId(stop)) ===
                      selectedDrop
                  ) || {}
                )}
              </p>
            </div>
          )}

          <button
            type="button"
            className="pickup-continue-btn"
            onClick={handleContinue}
            disabled={
              pickupStops.length === 0 ||
              dropStops.length === 0
            }
          >
            Continue to Passenger Details →
          </button>

          <button
            type="button"
            className="pickup-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PickupDrop;
