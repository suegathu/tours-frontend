import React, { useState } from "react";
import api from "../api/api"; // API functions
import FlightCard from "./FlightCard"; // Flight Card Component
import "./FlightList.css"; // Import CSS

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Flights from Aviationstack API
  const fetchFlightsFromAviationStack = async () => {
    setLoading(true);
    setError("");

    if (!search.from || !search.to) {
      setError("Please enter both departure and destination.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.fetchFlightsFromAviationStack(search.from, search.to, search.date);
      console.log("Fetched Flights from AviationStack:", response);
      console.log("Flight Data:", JSON.data);

      if (response.flights && response.flights.length > 0) {
        setFlights(response.flights);
      } else {
        setFlights([]);
        setError("No flights found for this search.");
      }
    } catch (error) {
      console.error("Error fetching flights from AviationStack:", error);
      setError("Failed to fetch flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-container">
      {/* Search Bar */}
      <div className="search-box">
        <input
          type="text"
          placeholder="From (e.g., Nairobi)"
          className="search-input"
          value={search.from}
          onChange={(e) => setSearch({ ...search, from: e.target.value })}
        />
        <input
          type="text"
          placeholder="To (e.g., London)"
          className="search-input"
          value={search.to}
          onChange={(e) => setSearch({ ...search, to: e.target.value })}
        />
        <input
          type="date"
          className="search-input"
          value={search.date}
          onChange={(e) => setSearch({ ...search, date: e.target.value })}
        />
        <button className="search-button" onClick={fetchFlightsFromAviationStack}>
          🔍 Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Flight Results */}
      <div className="flights-container">
        {loading ? (
          <p className="loading-message">Fetching flights...</p>
        ) : flights.length > 0 ? (
          flights.map((flight, index) => <FlightCard key={index} flight={flight} />)
        ) : (
          <p className="no-flights">No flights found</p>
        )}
      </div>
    </div>
  );
};

export default FlightList;
