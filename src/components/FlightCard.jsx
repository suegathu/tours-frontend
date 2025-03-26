import React from "react";
import "./FlightCard.css"; // Style for flight cards

const FlightCard = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <h3>{flight.airline}</h3>
        <span className={`status ${flight.status.toLowerCase()}`}>{flight.status}</span>
      </div>
      <div className="flight-details">
        <p><strong>{flight.departure_airport}</strong> ✈ {flight.arrival_airport}</p>
        <p>Departure: {new Date(flight.departure_time).toLocaleString()}</p>
        <p>Arrival: {new Date(flight.arrival_time).toLocaleString()}</p>
        <p><strong>Price:</strong> ${flight.price || "N/A"}</p>
      </div>
      <button className="book-btn">Book Now</button>
    </div>
  );
};

export default FlightCard;
