import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

const FlightDetailsPage = () => {
  const { flightNumber } = useParams();
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFlights = async () => {
      try {
        setIsLoading(true);
        const data = await api.fetchFlights();
        
        const foundFlight = data.flights.find(f => f.flight_number === flightNumber);
        
        if (foundFlight) {
          setFlight(foundFlight);
        } else {
          setError('Flight not found');
        }
      } catch (err) {
        console.error('Error in getFlights:', err);
        setError('An error occurred while fetching flight details');
      } finally {
        setIsLoading(false);
      }
    };
  
    getFlights();
  }, [flightNumber]);

  if (isLoading) {
    return <p>Loading flight details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!flight) {
    return <p>No flight details available</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{flight.airline}</h1>
      <p><strong>Flight Number:</strong> {flight.flight_number}</p>
      <p><strong>Departure:</strong> {flight.departure_airport} at {flight.departure_time}</p>
      <p><strong>Arrival:</strong> {flight.arrival_airport} at {flight.arrival_time}</p>
      <p><strong>Status:</strong> {flight.status}</p>
      
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Book Flight</button>
    </div>
  );
};

export default FlightDetailsPage;