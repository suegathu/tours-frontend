import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';

const FlightBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    flight_number: location.state?.flight?.flight_number || '',
    seat_preference: '',
    special_requests: ''
  });

  // State for booking process
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setIsBooking(true);
    setBookingError(null);

    try {
      // Call API to book flight
      const response = await api.createFlightBooking(formData);

      if (response.success) {
        // Navigate to confirmation page
        navigate('/booking-confirmation', {
          state: {
            bookingDetails: response.booking,
            flight: location.state?.flight
          }
        });
      } else {
        // Handle booking failure
        setBookingError(response.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError('An unexpected error occurred. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  // If no flight is selected, redirect or show error
  if (!location.state?.flight) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">No flight selected. Please select a flight first.</p>
        <button 
          onClick={() => navigate('/flights')} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Flights
        </button>
      </div>
    );
  }

  const { flight } = location.state;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Book Your Flight</h1>
      
      {/* Flight Details Preview */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
        <p><strong>Airline:</strong> {flight.airline}</p>
        <p><strong>Flight Number:</strong> {flight.flight_number}</p>
        <p><strong>Departure:</strong> {flight.departure_airport} at {flight.departure_time}</p>
        <p><strong>Arrival:</strong> {flight.arrival_airport} at {flight.arrival_time}</p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Additional Preferences */}
        <div>
          <label className="block mb-2">Seat Preference</label>
          <select
            name="seat_preference"
            value={formData.seat_preference}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Seat Preference</option>
            <option value="window">Window</option>
            <option value="aisle">Aisle</option>
            <option value="middle">Middle</option>
          </select>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block mb-2">Special Requests</label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Any special requests or needs?"
            rows="3"
          />
        </div>

        {/* Error Handling */}
        {bookingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {bookingError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isBooking}
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {isBooking ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default FlightBooking;