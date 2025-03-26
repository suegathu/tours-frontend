import React from "react";
import "./HotelCard.css"; // Import the CSS file

const HotelCard = ({ hotel, onMouseEnter, onMouseLeave }) => {
  // Generate Booking.com search URL dynamically
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + " " + hotel.address)}`;

  return (
    <div className="hotel-card" {...{ onMouseEnter, onMouseLeave}}>
      <img 
        src={hotel.image_url || "https://via.placeholder.com/150"} 
        alt={hotel.name} 
        className="hotel-image"
      />
      <div className="hotel-details">
        <h2 className="hotel-name">{hotel.name}</h2>
        <p className="hotel-address">{hotel.address}</p>
        <p className="hotel-price">Price per night: ${hotel.price_per_night}</p>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="hotel-book-btn">
          Book Now
        </a>
      </div>
    </div>
  );
};

export default HotelCard;
