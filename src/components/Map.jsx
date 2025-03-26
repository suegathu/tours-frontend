import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css"; // Import styling

// Custom marker icons for different categories
const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const hotelIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/831/831276.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const attractionIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// Component to center the map when location updates
const MapCenter = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location && location.length === 2) {
      map.setView(location, 13);
    }
  }, [location, map]);

  return null;
};

/**
 * activeLocation: [ latitude, longitude ] || undefined
 */
const Map = ({ location, hotels = [], restaurants = [], attractions = [], activeLocation = undefined }) => {
  const hasResults = hotels.length || restaurants.length || attractions.length;

  function isActive({ latitude, longitude }) {
    if (!activeLocation) return false

    const [ activeLatitude, activeLongitude ] = activeLocation

    return latitude == activeLatitude && longitude == activeLongitude
  }

  return (
    <div className="map-wrapper">
      <MapContainer center={location} zoom={13} className="map">
        <MapCenter location={location} />
        
        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location Marker */}
        <Marker position={location} icon={userIcon}>
          <Popup>
            {hasResults ? "Your Location" : "No nearby places found. Try another search!"}
          </Popup>
        </Marker>

        {/* Nearby Hotels */}
        {hotels.map((hotel, index) =>
          hotel.latitude && hotel.longitude ? (
            <Marker 
              key={index} 
              position={[hotel.latitude, hotel.longitude]} 
              icon={hotelIcon}  
              opacity={isActive(hotel) ? 1 : 0.6} zIndexOffset={ isActive(hotel) ? 5 : 0 } 
            >
              <Popup>
                <strong>{hotel.name}</strong> <br />
                Rating: {hotel.rating || "N/A"} ⭐
              </Popup>
            </Marker>
          ) : null
        )}

        {/* Nearby Restaurants */}
        {restaurants.map((restaurant, index) =>
          restaurant.latitude && restaurant.longitude ? (
            <Marker key={index} position={[restaurant.latitude, restaurant.longitude]} icon={restaurantIcon}>
              <Popup>
                <strong>{restaurant.name}</strong> <br />
                Cuisine: {restaurant.cuisine || "Unknown"} <br />
                <a href={restaurant.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
              </Popup>
            </Marker>
          ) : null
        )}

        {/* Nearby Attractions */}
        {attractions.map((attraction, index) =>
          attraction.latitude && attraction.longitude ? (
            <Marker key={index} position={[attraction.latitude, attraction.longitude]} icon={attractionIcon}>
              <Popup>
                <strong>{attraction.name}</strong> <br />
                <a href={attraction.booking_url} target="_blank" rel="noopener noreferrer">Book on GetYourGuide</a>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
