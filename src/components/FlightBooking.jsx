import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FlightBooking.css";
import { API_BASE_URL } from "../api/api";

const FlightBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengers: 1,
    flightClass: "Economy",
  });
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const flightId = queryParams.get("flight_id");
    const from = queryParams.get("from");
    const to = queryParams.get("to");
    const date = queryParams.get("date");
    const airline = queryParams.get("airline");
    const price = queryParams.get("price");

    if (flightId && from && to) {
      setFlightDetails({
        id: flightId,
        departure_airport: from,
        arrival_airport: to,
        date: date,
        airline: airline,
        price: price
      });
      setLoading(false);
    } else {
      setError("Missing flight information. Please go back and try again.");
      setLoading(false);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!flightDetails) {
      setError("Flight details missing. Please try again.");
      return;
    }

    try {
      setLoading(true);
      // Build the booking data to send to the backend
      const bookingPayload = {
        flight_id: flightDetails.id,
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        passengers: bookingData.passengers,
        flight_class: bookingData.flightClass,
      };

      // Make POST request to your deployed backend (on Render)
      const response = await axios.post(`${API_BASE_URL}/api/book-flight/`, bookingPayload);

      if (response.data && response.data.booking_id) {
        alert("Flight booked successfully! Booking ID: " + response.data.booking_id);
        navigate("/"); // Navigate to home or booking confirmation page
      }
    } catch (error) {
      console.error("Error booking flight:", error);
      setError("Failed to book flight. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading flight details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-container">
      <h1>Book Your Flight</h1>
      
      {flightDetails && (
        <div className="flight-summary">
          <h2>Flight Details</h2>
          <div className="summary-details">
            <p><strong>Airline:</strong> {flightDetails.airline}</p>
            <p><strong>From:</strong> {flightDetails.departure_airport}</p>
            <p><strong>To:</strong> {flightDetails.arrival_airport}</p>
            <p><strong>Date:</strong> {flightDetails.date}</p>
            <p><strong>Base Price:</strong> ${flightDetails.price}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <h2>Passenger Information</h2>
        
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={bookingData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={bookingData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={bookingData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={bookingData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="passengers">Number of Passengers</label>
          <select
            id="passengers"
            name="passengers"
            value={bookingData.passengers}
            onChange={handleInputChange}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="flightClass">Class</label>
          <select
            id="flightClass"
            name="flightClass"
            value={bookingData.flightClass}
            onChange={handleInputChange}
          >
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First">First Class</option>
          </select>
        </div>

        <div className="total-price">
          <p><strong>Total Price:</strong> ${flightDetails ? (flightDetails.price * bookingData.passengers * (bookingData.flightClass === "Economy" ? 1 : bookingData.flightClass === "Business" ? 1.5 : 2)).toFixed(2) : 0}</p>
        </div>
        
        <button type="submit" className="submit-btn">Complete Booking</button>
      </form>
    </div>
  );
};

export default FlightBooking;
