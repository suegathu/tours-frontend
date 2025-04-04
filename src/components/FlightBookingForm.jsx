import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/api";

const FlightBookingForm = () => {
  const { flightId } = useParams();
  const [seatNumber, setSeatNumber] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const bookFlight = () => {
    axios
      .post(
        `${API_BASE_URL}/booking/book-flight/`,
        { flight_id: flightId, seat_number: seatNumber },
        { headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMjU2NjYyLCJpYXQiOjE3NDMyNTQ4NjIsImp0aSI6ImY1ZTQ0MjJiMDEzYzQ0NmJiN2Q3M2RhNDg1OThjZDY4IiwidXNlcl9pZCI6MX0.gLLQCcVVkkVT5mcbOY3G-QMEXuUGBElLhPwBeqxOkbE` } }
      )
      .then((res) => {
        setMessage("Booking Confirmed!");
        setTimeout(() => navigate(`/confirm-flight/${res.data.booking_id}`), 2000);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Book Flight</h1>
      <input 
        type="text" 
        placeholder="Enter Seat Number" 
        onChange={(e) => setSeatNumber(e.target.value)}
        className="border p-2 rounded"
      />
      <button 
        onClick={bookFlight} 
        className="bg-green-500 text-white px-4 py-2 rounded ml-2">
        Confirm Booking
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default FlightBookingForm;
