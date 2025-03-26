import axios from 'axios'
const API_BASE_URL = "http://localhost:8000";

const api = {
  searchHotels: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hotels/search_locations/?query=${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return { error: "Failed to fetch hotels" };
    }
  },

  fetchRestaurants: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return { error: "Failed to fetch restaurants" };
    }
  },

  createReservation: async (reservationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/reservations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating reservation:", error);
      return { error: "Failed to create reservation" };
    }
  },
  searchRestaurants: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/?query=${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return { error: "Failed to fetch restaurants" };
    }
  },
  fetchFlights: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/flights/`);
      
      // Log the response to understand its structure
      console.log('Flight API Response:', response);
      
      // Directly return response.data, which contains the flights array
      return { flights: response.data };
    } catch (error) {
      console.error("Error fetching flights:", error);
      
      // Provide more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
      
      return { flights: [] };
    }
  },
  createFlightBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/book-flight/`, bookingData);
      return { 
        success: true, 
        booking: response.data.booking,
        message: response.data.message
      };
    } catch (error) {
      console.error("Error creating flight booking:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Booking failed' 
      };
    }
  },
};

export default api;