import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const Map = ({ location, hotels, restaurants, attractions }) => {
  // Ensure we have a valid location before rendering the map
  if (!location || location.length !== 2 || (location[0] === 0 && location[1] === 0)) {
    return <div className="map-error">Loading map...</div>;
  }

  return (
    <div className="map-wrapper">
      <MapContainer center={location} zoom={13} className="map">
        {/* OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location Marker */}
        <Marker position={location} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Nearby Hotels */}
        {hotels?.map((hotel, index) => (
          <Marker key={index} position={[hotel.latitude, hotel.longitude]} icon={hotelIcon}>
            <Popup>
              <strong>{hotel.name}</strong> <br />
              Rating: {hotel.rating || "N/A"} ⭐
            </Popup>
          </Marker>
        ))}

        {/* Nearby Restaurants */}
        {restaurants?.map((restaurant, index) => (
          <Marker key={index} position={[restaurant.latitude, restaurant.longitude]} icon={restaurantIcon}>
            <Popup>
              <strong>{restaurant.name}</strong> <br />
              Cuisine: {restaurant.cuisine || "Unknown"} <br />
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
            </Popup>
          </Marker>
        ))}

        {/* Nearby Attractions */}
        {attractions?.map((attraction, index) => (
          <Marker key={index} position={[attraction.latitude, attraction.longitude]} icon={attractionIcon}>
            <Popup>
              <strong>{attraction.name}</strong> <br />
              <a href={attraction.booking_url} target="_blank" rel="noopener noreferrer">Book on GetYourGuide</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
