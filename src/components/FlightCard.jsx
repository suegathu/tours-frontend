import React from "react";
import "./FlightCard.css";

const FlightCard = ({ flight }) => {
  const { airline, departure_airport, arrival_airport, departure_time, arrival_time, price } = flight;

  // Convert date to YYYY-MM-DD format
  const flightDate = new Date(departure_time).toISOString().split("T")[0];

  // Airline booking links with pre-filled departure, destination, and date
  const airlineLinks = {
    "Kenya Airways": `https://www.kenya-airways.com/en-ke/book/book-a-flight?origin=${departure_airport}&destination=${arrival_airport}&departureDate=${flightDate}`,
    "Jambojet": `https://www.jambojet.com/book-a-flight?from=${departure_airport}&to=${arrival_airport}&date=${flightDate}`,
    "Fly540": `https://www.fly540.com/bookings?from=${departure_airport}&to=${arrival_airport}&departDate=${flightDate}`,
    "Safarilink Aviation": `https://www.flysafarilink.com/flights?origin=${departure_airport}&destination=${arrival_airport}&date=${flightDate}`,
    "Skyward Express": `https://www.skywardexpress.co.ke/book-flight?origin=${departure_airport}&destination=${arrival_airport}&departureDate=${flightDate}`,
  "American Airlines": `https://www.aa.com/booking/find-flights?origin=${departure_airport}&destination=${arrival_airport}&departDate=${flightDate}`,
    "Delta Airlines": `https://www.delta.com/flight-search/search?origin=${departure_airport}&destination=${arrival_airport}&departDate=${flightDate}`,
    "United Airlines": `https://www.united.com/en-us/book-a-flight?from=${departure_airport}&to=${arrival_airport}&date=${flightDate}`,
    "Emirates": `https://www.emirates.com/book/${departure_airport}-${arrival_airport}/${flightDate}/`,
    "Qatar Airways": `https://www.qatarairways.com/en-us/book/find-your-flight.html?from=${departure_airport}&to=${arrival_airport}&date=${flightDate}`,
    "British Airways": `https://www.britishairways.com/travel/book/public/en_gb?origin=${departure_airport}&destination=${arrival_airport}&departureDate=${flightDate}`,

  };

  // Fallback to Google Flights if no direct airline booking URL is available
  const bookingURL = airlineLinks[airline] || `https://www.google.com/flights?hl=en#flt=${departure_airport}.${arrival_airport}.${flightDate};e:1`;

  return (
    <div className="flight-card">
      <div className="flight-header">
        <h3>{airline}</h3>
      </div>
      <div className="flight-details">
        <p><strong>{departure_airport}</strong> ✈ {arrival_airport}</p>
        <p><strong>Departure:</strong> {new Date(departure_time).toLocaleString()}</p>
        <p><strong>Arrival:</strong> {arrival_time ? new Date(arrival_time).toLocaleString() : "N/A"}</p>
        <p><strong>Estimated Price:</strong> {price ? `$${price}` : `Not Available`}</p>
      </div>
      <a href={bookingURL} target="_blank" rel="noopener noreferrer">
        <button className="book-btn">Visit website to book</button>
      </a>
    </div>
  );
};

export default FlightCard;
