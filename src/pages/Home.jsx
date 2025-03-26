import React, { useState, useEffect } from "react";
import api from "../api/api";
import HotelCard from "../components/HotelCard";
import RestaurantCard from "../components/RestaurantCard";
import Map from "../components/Map"; 
import "./Home.css"; 

function Home() {
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState([0, 0]); 
  const [searchType, setSearchType] = useState("hotels");

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
      let data;
      if (searchType === "hotels") {
        data = await api.searchHotels(query);
      } else {
        data = await api.searchRestaurants(query);
      }
  
      console.log("API Response:", data); 
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid response from API");
      }
  
      if (searchType === "hotels") {
        setHotels(data);
      } else {
        setRestaurants(data);
      }
  
      if (data.length > 0) {
        setLocation([data[0].latitude, data[0].longitude]);
      }
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching data:", error);
    }
  
    setLoading(false);
  };
  

  return (
    <div className="home-layout">
      {/* Left Side - Search and List */}
      <div className="home-container">
        <h1 className="title">Search</h1>

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

        {/* Search Type Selection */}
        <div className="filters">
          <label>Search for:</label>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="hotels">Hotels</option>
            <option value="restaurants">Restaurants</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Results */}
        {searchType === "hotels" ? (
          hotels.length > 0 ? (
            <div className="hotel-grid">
              {hotels.map((hotel, index) => (
                <HotelCard key={hotel.id || `${hotel.name}-${index}`} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p className="no-results">No hotels found. Try a different search.</p>
          )
        ) : (
          restaurants.length > 0 ? (
            <div className="restaurant-grid">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard 
                key={restaurant.id || `${restaurant.name}-${index}`} 
                restaurant={{
                  ...restaurant,
                  id: restaurant.id || index, // Ensure there's an ID
                  images: restaurant.images || [],
                  address: restaurant.address || "No address available",
                  website: restaurant.website || "#",
                }} 
              />
              
              ))}
            </div>
          ) : (
            <p className="no-results">No restaurants found. Try a different search.</p>
          )
        )}
      </div>

      {/* Right Side - Map */}
      <div className="map-container">
        <Map location={location} hotels={searchType === "hotels" ? hotels : restaurants} />
      </div>
    </div>
  );
}

export default Home;
