import React, { useState, useEffect } from "react";
import api from "../api/api";
import HotelCard from "../components/HotelCard";
import RestaurantCard from "../components/RestaurantCard";
import AttractionCard from "../components/AttractionCard";
import Map from "../components/Map"; 
import "./Home.css"; 

function Home() {
  const [query, setQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState([0, 0]);
  const [searchType, setSearchType] = useState("hotels"); 
  const [activeLocation, setActiveLocation] = useState(undefined); // [number, number] || undefined

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  useEffect(() => {
    console.log(JSON.stringify({ activeLocation }))
  }, [activeLocation])

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      let data = [];
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
        setLocation([
          data[0].latitude || data[0].lat || location[0],
          data[0].longitude || data[0].lon || location[1],
        ]);
      }
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  // Select correct data for markers
  const markers = [...hotels, ...restaurants, ...attractions];

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
            <option value="attractions">Attractions</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Results */}
        {searchType === "hotels" ? (
          <div className="hotel-grid">
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <HotelCard 
                  key={hotel.id || `${hotel.name}-${index}`} 
                  hotel={hotel} 
                  onMouseEnter={() => { setActiveLocation([ hotel.latitude, hotel.longitude ]) }} 
                  onMouseLeave={() => { setActiveLocation(undefined) }} />
              ))
            ) : (
              <p className="no-results">No hotels found. Try a different search.</p>
            )}
          </div>
        ) : searchType === "restaurants" ? (
          <div className="restaurant-grid">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant, index) => (
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
              ))
            ) : (
              <p className="no-results">No restaurants found. Try a different search.</p>
            )}
          </div>
        ) : (
          <div className="attraction-grid">
            {attractions.length > 0 ? (
              attractions.map((attraction, index) => (
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
              ))
            ) : (
              <p className="no-results">No attractions found. Try a different search.</p>
            )}
          </div>
        )}
      </div>

      {/* Right Side - Map */}
      <div className="map-container">
        <Map {...{ hotels, restaurants, attractions, activeLocation, location, markers }} />
      </div>
    </div>
  );
}

export default Home;
