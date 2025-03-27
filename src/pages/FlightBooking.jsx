import React, { useState } from "react";
import axios from "axios";
import "./FlightBooking.css"; // Import CSS for styling

const FlightBooking = ({ flight }) => {
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setBookingSuccess(null);

    if (!passengerName || !email) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/book-flight/", {
        flight: flight.id,
        passenger_name: passengerName,
        email: email,
      });

      if (response.data.success) {
        setBookingSuccess("Flight booked successfully!");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error booking flight:", error);
      setError("Failed to book flight. Please try again.");
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Flight: {flight.flight_number}</h2>
      <p>
        {flight.departure_airport} ➝ {flight.arrival_airport}
      </p>
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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FlightBooking;
