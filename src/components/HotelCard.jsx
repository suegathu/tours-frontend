import React from "react";
import "./HotelCard.css"; // Import the CSS file

const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card">
      <img 
        src={hotel.image_url || "https://via.placeholder.com/150"} 
        alt={hotel.name} 
        className="hotel-image"
      />
      <div className="hotel-details">
        <h2 className="hotel-name">{hotel.name}</h2>
        <p className="hotel-address">{hotel.address}</p>
        <p className="hotel-price">Price per night: ${hotel.price_per_night}</p>
        <a href={hotel.booking_link} target="_blank" rel="noopener noreferrer" className="hotel-book-btn">
          Book Now
        </a>
      </div>
    </div>
  );
};

export default HotelCard;
