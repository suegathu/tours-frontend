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
};

export default api;
