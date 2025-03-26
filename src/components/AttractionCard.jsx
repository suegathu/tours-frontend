import React from "react";
import "./AttractionCard.css";

const getBookingLink = (attraction) => {
  if (!attraction.name) return "#";

  const encodedName = encodeURIComponent(attraction.name);
  const encodedCity = attraction.address?.city ? encodeURIComponent(attraction.address.city) : "";

  return `https://www.getyourguide.com/s/?q=${encodedName}&searchSource=1&city=${encodedCity}`;
};

function AttractionCard({ attraction }) {
  const bookingUrl = getBookingLink(attraction);

  return (
    <div className="attraction-card">
      <img 
        src={attraction.image || attraction.image_url || "https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-water-park-attraction-and-pool-landing-header-vector-png-image_11903539.png"} 
        alt={attraction.name} 
        className="attraction-image"
      />

      <div className="attraction-details">
        <h3 className="attraction-name">{attraction.name}</h3>
        <p className="attraction-address">{attraction.address?.full || "Location not available"}</p>
      </div>

      <div className="button-group">
        <a href={`/attractions/${attraction.id}`} className="view-button">
          View Details
        </a>
        
        {bookingUrl !== "#" && (
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="book-button">
            Book on GetYourGuide
          </a>
        )}
      </div>
    </div>
  );
}

export default AttractionCard;
