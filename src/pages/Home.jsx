import React, { useState, useEffect } from "react";
import api from "../api/api";
import HotelCard from "../components/HotelCard";
import Map from "../components/Map"; // Import the Map component
import "./Home.css"; // Import CSS for styling

function Home() {
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [location, setLocation] = useState([0, 0]); // Default location

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.searchHotels(query);

      if (!Array.isArray(data)) throw new Error("Invalid response from API");

      setHotels(data);

      // Set map location based on first result if available
      if (data.length > 0) {
        setLocation([data[0].latitude, data[0].longitude]);
      }
    } catch (error) {
      setError("Error fetching hotels. Please try again.");
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const filterHotels = (hotelsList) => {
    return hotelsList.filter((hotel) => {
      const rating = hotel.rating || 0;
      if (ratingFilter === "low" && rating > 3.5) return false;
      if (ratingFilter === "mid" && (rating <= 3.5 || rating > 4.5)) return false;
      if (ratingFilter === "high" && rating <= 4.5) return false;
      return true;
    });
  };

  return (
    <div className="home-layout">
      {/* Left Side - Search and Hotel List */}
      <div className="home-container">
        <h1 className="title">Search Hotels</h1>

        {/* Search Input */}
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter location..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <label>Rating:</label>
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="low">Up to 3.5</option>
            <option value="mid">3.5 - 4.5</option>
            <option value="high">4.5 and above</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Hotel Cards */}
        {hotels.length > 0 ? (
          <div className="hotel-grid">
            {filterHotels(hotels).map((hotel) => (
              <HotelCard key={hotel.name} hotel={hotel} />
            ))}
          </div>
        ) : (
          <p className="no-results">No hotels found. Try a different search.</p>
        )}
      </div>

      {/* Right Side - Map */}
      <div className="map-container">
        <Map location={location} hotels={hotels} />
      </div>
    </div>
  );
}

export default Home;
