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
  const [activeLocation, setActiveLocation] = useState(undefined);

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

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a location to search");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let data = [];
      
      if (searchType === "hotels") {
        data = await api.searchHotels(query);
        // Reset other result types when switching search types
        setRestaurants([]);
        setAttractions([]);
        
        // Validate data before setting state
        if (Array.isArray(data)) {
          setHotels(data);
        } else {
          setHotels([]);
          throw new Error("Invalid hotel data received");
        }
      } 
      else if (searchType === "restaurants") {
        data = await api.searchRestaurants(query);
        // Reset other result types
        setHotels([]);
        setAttractions([]);
        
        // Validate data before setting state
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
          throw new Error("Invalid restaurant data received");
        }
      } 
      else if (searchType === "attractions") {
        data = await api.searchAttractions(query);
        // Reset other result types
        setHotels([]);
        setRestaurants([]);
        
        // Validate data before setting state
        if (Array.isArray(data)) {
          setAttractions(data);
        } else {
          setAttractions([]);
          throw new Error("Invalid attraction data received");
        }
      }

      // Update map center if we have results
      if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        // Handle different property names for coordinates
        const lat = parseFloat(firstItem.latitude || firstItem.lat);
        const lng = parseFloat(firstItem.longitude || firstItem.lon);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          setLocation([lat, lng]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Error fetching ${searchType}: ${error.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  // Prepare markers for map - only use current search type's data
  const getActiveMarkers = () => {
    switch (searchType) {
      case "hotels":
        return hotels;
      case "restaurants":
        return restaurants;
      case "attractions":
        return attractions;
      default:
        return [];
    }
  };

  const markers = getActiveMarkers();

  // Handle form submission on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
            onKeyPress={handleKeyPress}
            placeholder="Enter location..."
            className="search-input"
          />
          <button 
            onClick={handleSearch} 
            className="search-button" 
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Search Type Selection */}
        <div className="filters">
          <label>Search for:</label>
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            disabled={loading}
          >
            <option value="hotels">Hotels</option>
            <option value="restaurants">Restaurants</option>
            <option value="attractions">Attractions</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Results */}
        {loading ? (
          <div className="loading">Loading {searchType}...</div>
        ) : (
          <>
            {searchType === "hotels" && (
              <div className="hotel-grid">
                {hotels.length > 0 ? (
                  hotels.map((hotel, index) => (
                    <HotelCard 
                      key={hotel.id || `${hotel.name}-${index}`} 
                      hotel={hotel} 
                      onMouseEnter={() => setActiveLocation([
                        parseFloat(hotel.latitude), 
                        parseFloat(hotel.longitude)
                      ])} 
                      onMouseLeave={() => setActiveLocation(undefined)} 
                    />
                  ))
                ) : !loading && (
                  <p className="no-results">No hotels found. Try a different search.</p>
                )}
              </div>
            )}

            {searchType === "restaurants" && (
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
                      onMouseEnter={() => {
                        const lat = parseFloat(restaurant.latitude || restaurant.lat);
                        const lng = parseFloat(restaurant.longitude || restaurant.lon);
                        if (!isNaN(lat) && !isNaN(lng)) {
                          setActiveLocation([lat, lng]);
                        }
                      }}
                      onMouseLeave={() => setActiveLocation(undefined)}
                    />
                  ))
                ) : !loading && (
                  <p className="no-results">No restaurants found. Try a different search.</p>
                )}
              </div>
            )}

            {searchType === "attractions" && (
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
                      onMouseEnter={() => {
                        const lat = parseFloat(attraction.latitude || attraction.lat);
                        const lng = parseFloat(attraction.longitude || attraction.lon);
                        if (!isNaN(lat) && !isNaN(lng)) {
                          setActiveLocation([lat, lng]);
                        }
                      }}
                      onMouseLeave={() => setActiveLocation(undefined)}
                    />
                  ))
                ) : !loading && (
                  <p className="no-results">No attractions found. Try a different search.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Side - Map */}
      <div className="map-container">
        <Map
          hotels={searchType === "hotels" ? hotels : []}
          restaurants={searchType === "restaurants" ? restaurants : []}
          attractions={searchType === "attractions" ? attractions : []}
          activeLocation={activeLocation}
          location={location}
          markers={markers}
        />
      </div>
    </div>
  );
}

export default Home;
