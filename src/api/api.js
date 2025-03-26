import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";
const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY; 
const OPENWEATHER_API = import.meta.env.VITE_OPENWEATHER_API_KEY;

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

  fetchFlights: async (searchQuery = "") => {
    try {
      let url = `${API_BASE_URL}/flights/`;
      if (searchQuery) {
        url += `?departure=${searchQuery}&arrival=${searchQuery}`;
      }
  
      const response = await axios.get(url);
      console.log("Flight API Response:", response);
      return { flights: response.data };
    } catch (error) {
      console.error("Error fetching flights:", error);
      return { flights: [] };
    }
  },
  fetchFlightsFromAviationStack: async (from, to ) => {
    try {
      const response = await axios.get(
        `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${from}&arr_iata=${to}`
      );

      console.log("AviationStack API Response:", response.data);

      // Extract relevant flight details
      const flights = response.data.data.map((flight) => ({
        flight_number: flight.flight.iata,
        airline: flight.airline.name,
        departure_airport: flight.departure.airport,
        arrival_airport: flight.arrival.airport,
        departure_time: flight.departure.estimated,
        arrival_time: flight.arrival.estimated,
        status: flight.flight_status,
      }));

      return { flights };
    } catch (error) {
      console.error("Error fetching flights from AviationStack:", error);
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

  fetchOSMRestaurants: async (lat, lon, radius = 1000) => {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radius},${lat},${lon})["amenity"="restaurant"];out body;`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.elements.map((place) => ({
        id: place.id,
        name: place.tags.name || "Unknown",
        website: place.tags.website || null,
        phone: place.tags["contact:phone"] || null,
        reservation_link: place.tags["reservation:link"] || null,
        lat: place.lat,
        lon: place.lon
      }));
    } catch (error) {
      console.error("Error fetching OSM restaurants:", error);
      return [];
    }
  },

  fetchAttractions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attractions/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attractions:", error);
      return { error: "Failed to fetch attractions" };
    }
  },

  searchAttractions: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attractions/?query=${query}`);
      console.log("Attractions Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching attractions:", error);
        return [];
    }
  },

  fetchAttractionById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attractions/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching attraction details:", error);
      return { error: "Failed to fetch attraction details" };
    }
  },

  // Users API
  registerUser: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      return { error: "Failed to register user" };
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      return { error: "Failed to login" };
    }
  },
};

export default api;
