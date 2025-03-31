import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;

// Axios instance for API requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Function to get auth token from local storage
const getAuthToken = () => localStorage.getItem("token");

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
      const response = await apiClient.get(`/restaurants/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 Search Restaurants
  searchRestaurants: async (query) => {
    // /restaurants/fetch_restaurants/?location=Nairobi/
    try {
      const response = await apiClient.get(`/restaurants/fetch_restaurants`, { params: { location: query } });
      return response.data;
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

  // 🔹 Fetch Flights (Local API)
  fetchFlightsFromAviationStack: async (from, to) => {
    try {
      const response = await axios.get(`http://api.aviationstack.com/v1/flights`, {
        params: { access_key: API_KEY, dep_iata: from, arr_iata: to },
      });
  
      console.log("Full API Response:", response.data); // Check the full structure
  
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
      return []; // Ensure an array is returned
    }
  },

  // 🔹 Fetch Flight Details
  fetchFlightDetails: async (flightId) => {
    try {
      const response = await apiClient.get(`/flights/${flightId}/`);
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
            `${API_BASE_URL}/book-flight/`,  // Ensure correct API path
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

  getAvailableSeats: async (flightId) => {
    try {
      const response = await axios.get(`http://localhost:8000/flights/${flightId}/available-seats/`);
        return response.data.available_seats;
    } catch (error) {
        console.error("Error fetching available seats:", error);
        return [];
    }
},
 getBookingDetails:async (bookingId) => {
  const url = `http://127.0.0.1:8000/check-in/${bookingId}/`;
  console.log("API request to:", url);

  try {
      const response = await fetch(url);

      // Ensure response is valid JSON
      if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("API error:", error);
      throw error;
  }
},

checkInFlight: async (bookingId) => {
  if (!bookingId) {
      throw new Error("Booking ID is required for check-in.");
  }

  try {
      const response = await fetch(`http://127.0.0.1:8000/check-in/${bookingId}/`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Check-in failed:", error.message);
      throw error;
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
      const response = await apiClient.get(`/attractions/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  searchAttractions: async (query) => {
    try {
      const response = await apiClient.get(`/attractions/`, { params: { query } });
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  fetchAttractionById: async (id) => {
    try {
      const response = await apiClient.get(`/attractions/${id}/`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // 🔹 User Authentication APIs
  registerUser: async (userData) => {
    try {
      const response = await apiClient.post(`/auth/register/`, userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await apiClient.post(`/auth/login/`, credentials);
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

      await apiClient.post(`/auth/logout/`, null, {
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

      const response = await apiClient.get(`/auth/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default api;
