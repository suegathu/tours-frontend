
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Map.css"; // Import the CSS for styling

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = ({ location, hotels }) => {
  // Ensure we have a valid location before rendering the map
  if (!location || location.length !== 2 || location[0] === 0 && location[1] === 0) {
    return <div className="map-error">Loading map...</div>;
  }

  return (
    <div className="map-wrapper">
      <MapContainer center={location} zoom={13} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User location marker */}
        <Marker position={location} icon={customIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Nearby hotels as markers */}
        {hotels.length > 0 &&
          hotels.map((hotel, index) => (
            <Marker key={index} position={[hotel.latitude, hotel.longitude]} icon={customIcon}>
              <Popup>
                <strong>{hotel.name}</strong> <br />
                Rating: {hotel.rating || "N/A"} ⭐
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default Map;
