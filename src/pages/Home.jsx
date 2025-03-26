import React, { useState, useEffect } from "react";
import api from "../api/api";
import HotelCard from "../components/HotelCard";
import RestaurantCard from "../components/RestaurantCard";
import AttractionCard from "../components/AttractionCard"; // Import AttractionCard component
import Map from "../components/Map"; 
import "./Home.css"; 

function Home() {
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [attractions, setAttractions] = useState([]); // New state for attractions
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
        setHotels(data);
      } else if (searchType === "restaurants") {
        data = await api.searchRestaurants(query);
        setRestaurants(data);
      } else if (searchType === "attractions") {
        data = await api.searchAttractions(query);
        setAttractions(data);
      }
  
      console.log("API Response:", data); 
  
      if (!Array.isArray(data)) {
        throw new Error("Invalid response from API");
      }
  
      if (data.length > 0) {
        setLocation([data[0].latitude || data[0].lat, data[0].longitude || data[0].lon]);
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
            <option value="attractions">Attractions</option> {/* Added Attractions */}
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
        ) : searchType === "restaurants" ? (
          restaurants.length > 0 ? (
            <div className="restaurant-grid">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard 
                  key={restaurant.id || `${restaurant.name}-${index}`} 
                  restaurant={{
                    ...restaurant,
                    id: restaurant.id || index, 
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
        ) : (
          attractions.length > 0 ? (
            <div className="attraction-grid">
              {attractions.map((attraction, index) => (
                <AttractionCard 
                  key={attraction.id || `${attraction.name}-${index}`} 
                  attraction={{
                    ...attraction,
                    id: attraction.id || index, 
                    images: attraction.images || [],
                    address: attraction.address || "No address available",
                    website: attraction.website || "#",
                  }} 
                />
              ))}
            </div>
          ) : (
            <p className="no-results">No attractions found. Try a different search.</p>
          )
        )}
      </div>

      {/* Right Side - Map */}
      <div className="map-container">
        <Map location={location} hotels={searchType === "hotels" ? hotels : searchType === "restaurants" ? restaurants : attractions} />
      </div>
    </div>
  );
}

export default Home;
