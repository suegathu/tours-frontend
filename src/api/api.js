import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://tours-backend-vy6o.onrender.com/";
const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;

// Axios instance for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Function to get auth token from local storage
export const getAuthToken = () => localStorage.getItem("token");

// Helper function to handle errors
const handleError = (error) => {
  console.error("API Error:", error);
  return { error: error.response?.data?.message || "An error occurred" };
};

const api = {
  // 🔹 Fetch Hotels
  searchHotels: async (query) => {
    try {
      const response = await apiClient.get(`/api/hotels/`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Fetch Restaurants
  fetchRestaurants: async () => {
    try {
      const response = await apiClient.get(`/restaurants/restaurants/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Search Restaurants
  searchRestaurants: async (query) => {
    try {
      const response = await apiClient.get(`/restaurants/restaurants/`, { params: { location: query } });
      if (response.data && Array.isArray(response.data.restaurants)) {
        return response.data.restaurants;
      } else {
        console.error("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Create Restaurant Reservation
  createReservation: async (reservationData) => {
    try {
      const token = getAuthToken();
      if (!token) return { error: "Authentication required. Please log in." };

      const response = await apiClient.post(`/restaurants/reservations/`, reservationData, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Fetch Flights
  fetchFlights: async () => {
    try {
      const response = await apiClient.get(`/bookings/fetch-flights/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Fetch Flight Details
  fetchFlightDetails: async (bookingId) => {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Create Flight Booking (with Authentication)
  bookFlight: async (flightNumber, seatNumber) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: "User not authenticated. Please log in." };
      }

      const response = await apiClient.post(
        `/bookings/book-flight/`,
        { flight_number: flightNumber, seat_number: seatNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        booking: response.data,
        message: "Flight booked successfully",
      };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || "Booking failed" };
    }
  },

  // 🔹 Get Available Seats for a Flight
  getAvailableSeats: async (flightNumber) => {
    try {
      const response = await apiClient.get(`/bookings/flights/${flightNumber}/available-seats/`);
      return response.data.available_seats;
    } catch (error) {
      console.error("Error fetching available seats:", error);
      return [];
    }
  },

  // 🔹 Get Booking Details
  getBookingDetails: async (bookingId) => {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}/`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Check-In Flight
  checkInFlight: async (bookingId) => {
    try {
      const response = await apiClient.get(`/bookings/check-in/${bookingId}/`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Check-in failed:", error.message);
      return handleError(error);
    }
  },

  // 🔹 Fetch Attractions
  fetchAttractions: async () => {
    try {
      const response = await apiClient.get(`/attractions/attractions/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  searchAttractions: async (query) => {
    try {
      const response = await apiClient.get(`/attractions/attractions/`, { params: { query } });
      return response.data;
    } catch (error) {
      console.log(error)
      return [];
    }
  },

  fetchAttractionById: async (id) => {
    try {
      const response = await apiClient.get(`/attractions/attractions/${id}/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 User Authentication APIs
  registerUser: async (userData) => {
    try {
      const response = await apiClient.post(`/accounts/auth/register/`, userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await apiClient.post(`/accounts/auth/login/`, credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  logoutUser: async () => {
    try {
      const token = getAuthToken();
      if (!token) return { message: "No user logged in" };

      await apiClient.post(`/accounts/auth/logout/`, null, {
        headers: { Authorization: `Token ${token}` },
      });

      localStorage.removeItem("token");
      return { message: "Logged out successfully" };
    } catch (error) {
      return handleError(error);
    }
  },

  getUserProfile: async () => {
    try {
      const token = getAuthToken();
      if (!token) return { error: "User not logged in" };

      const response = await apiClient.get(`/accounts/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default api;
