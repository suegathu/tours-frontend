import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./FlightBooking.css"; 
import { API_BASE_URL } from "../api/api";

const FlightBooking = () => {
  const { id } = useParams(); 
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Fetch Flight Details
  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/flights/flights/${id}/`);
        setFlight(response.data);
      } catch (err) {
        setError("Failed to load flight details.");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
    fetchFlightDetails();
  }, [id]);

  // Handle Flight Booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setBookingSuccess(null);

    if (!passengerName || !email) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/book-flight/`, {
        flight: id,
        passenger_name: passengerName,
        email: email,
      });

      if (response.data.success) {
        setBookingSuccess("Flight booked successfully! Check your email for confirmation.");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error booking flight:", err);
      setError("Failed to book flight. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      {loading ? (
        <p>Loading flight details...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2>Book Flight: {flight.flight_number}</h2>
          <p>{flight.departure_airport} ➝ {flight.arrival_airport}</p>
          <p>Price: ${flight.price}</p>

          <form onSubmit={handleBooking} className="booking-form">
            <input
              type="text"
              placeholder="Passenger Name"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="book-button">
              Confirm Booking
            </button>
          </form>

          {bookingSuccess && <p className="success-message">{bookingSuccess}</p>}
        </>
      )}
    </div>
  );
};

export default FlightBooking;
