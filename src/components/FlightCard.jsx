import React from "react";
import { Link } from "react-router-dom";

const FlightCard = ({ flight }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{flight.airline}</h2>
      <p>Flight: {flight.flight_number}</p>
      <p>Departure: {flight.departure_airport}</p>
      <p>Arrival: {flight.arrival_airport}</p>
      <p>Status: <span className="font-bold">{flight.status}</span></p>
      
      <Link to={`/flights/${flight.flight_number}`} className="block mt-2 text-blue-500">
        View Details
      </Link>
    </div>
  );
};

export default FlightCard;
