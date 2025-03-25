import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const FlightDetailsPage = () => {
  const navigate = useNavigate();
  const { flightNumber } = useParams();
  const [flight, setFlight] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getFlights = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching flights for flight number:', flightNumber);

      // Ensure the API call is properly implemented
      const data = await api.fetchFlights();

      console.log('Received flights data:', data);

      // Add null check for data and data.flights
      if (!data || !data.flights) {
        throw new Error('Invalid flight data received');
      }

      const foundFlight = data.flights.find(
        f => f.flight_number.toString() === flightNumber.toString()
      );

      if (foundFlight) {
        console.log('Found matching flight:', foundFlight);
        setFlight(foundFlight);
      } else {
        console.warn('No matching flight found');
        setError('Flight not found');
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
      setError(err.message || 'An error occurred while fetching flight details');
    } finally {
      setIsLoading(false);
    }
  }, [flightNumber]);

  useEffect(() => {
    if (flightNumber) {
      getFlights();
    }
  }, [flightNumber, getFlights]);

  const handleBookFlight = () => {
    if (!flight) {
      console.error('No flight selected for booking');
      return;
    }

    console.log('Attempting to book flight:', flight);

    navigate('/book-flight', {
      state: {
        flight: flight,
        bookingTimestamp: new Date().toISOString()
      }
    });
  };

  if (isLoading) {
    return <div>Loading flight details...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <button 
          onClick={() => navigate('/flights')} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Flights
        </button>
      </div>
    );
  }

  if (!flight) {
    return (
      <div>
        No flight details available
        <button 
          onClick={() => navigate('/flights')} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Flights
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{flight.airline}</h1>
      <p><strong>Flight Number:</strong> {flight.flight_number}</p>
      <p><strong>Departure:</strong> {flight.departure_airport} at {flight.departure_time}</p>
      <p><strong>Arrival:</strong> {flight.arrival_airport} at {flight.arrival_time}</p>
      <p><strong>Status:</strong> {flight.status}</p>
      
      <a href="/book-flight">
      <button
        onClick={handleBookFlight}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Book Flight
      </button>
      </a>
    </div>
  );
};

export default FlightDetailsPage;