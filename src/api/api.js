import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const response = await apiClient.get(`/api/hotels/search_locations/`, {
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
      const response = await apiClient.get(`/restaurants/restaurants/fetch_restaurants`, { params: { location: query } });
      // Extract restaurants array from the response
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
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  searchFlights: async (from, to) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: "User not authenticated. Please log in." };
      }

      const response = await apiClient.get(`/bookings/fetch-flights/`, {
        params: { dep_iata: from, arr_iata: to },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extract flights array from the response
      if (Array.isArray(response.data)) {
        return response.data.map((flight) => ({
          flight_number: flight.flight_number,
          airline: flight.airline,
          departure_airport: flight.departure_airport,
          arrival_airport: flight.arrival_airport,
          departure_time: flight.departure_time,
          arrival_time: flight.arrival_time,
          status: flight.status,
        }));

      } else {
        console.error("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      return handleError(error);
    }
  },

  // 🔹 Fetch Flights (Local API)
  fetchFlightsFromAviationStack: async (from, to) => {
    try {
      const response = await axios.get(`https://api.aviationstack.com/v1/flights`, {
        params: {
          access_key: import.meta.env.VITE_AVIATIONSTACK_API_KEY,
          dep_iata: from,
          arr_iata: to,
        },
      });

      console.log("Full API Response:", response.data);

      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        console.error("Unexpected API response format:", response.data);
        return [];
      }

      return response.data.data.map((flight) => ({
        flight_number: flight.flight?.iata || "N/A",
        airline: flight.airline?.name || "Unknown Airline",
        departure_airport: flight.departure?.airport || "Unknown Airport",
        arrival_airport: flight.arrival?.airport || "Unknown Airport",
        departure_time: flight.departure?.estimated || "Unknown Time",
        arrival_time: flight.arrival?.estimated || "Unknown Time",
        status: flight.flight_status || "Unknown",
      }));
    } catch (error) {
      console.error("Error fetching flights:", error);
      return [];
    }
  },


  // 🔹 Fetch Flight Details
  fetchFlightDetails: async (flightId) => {
    try {
      const response = await apiClient.get(`/bookings/flights/${flightId}/`);
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

  // 🔹 Fetch OpenStreetMap Restaurants
  fetchOSMRestaurants: async (lat, lon, radius = 1000) => {
    try {
      const response = await axios.get(
        `https://overpass-api.de/api/interpreter`,
        {
          params: {
            data: `[out:json];node(around:${radius},${lat},${lon})["amenity"="restaurant"];out body;`,
          },
        }
      );
      return response.data.elements.map((place) => ({
        id: place.id,
        name: place.tags.name || "Unknown",
        website: place.tags.website || null,
        phone: place.tags["contact:phone"] || null,
        reservation_link: place.tags["reservation:link"] || null,
        lat: place.lat,
        lon: place.lon,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  // 🔹 Fetch & Search Attractions
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
      console.log(error);
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
      localStorage.setItem("token", response.data.token); // Store token after login
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
        headers: { Authorization: `Bearer ${token}` },
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

      const response = await apiClient.get(`/accounts/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getAvailableSeats: async (flightNumber) => {
    try {
      const response = await apiClient.get(`/bookings/flights/${flightNumber}/available-seats/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available seats:", error);
      return { error: "Failed to fetch available seats." };
    }
  },

  getBookingDetails: async (bookingId) => {
    try {
      const token = getAuthToken();
      if (!token) return { error: "User not logged in" };

      const response = await apiClient.get(`/bookings/bookings/${bookingId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
};

export default api;
