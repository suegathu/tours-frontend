const API_BASE_URL = "http://localhost:8000/api/hotels";

const api = {
  searchHotels: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search_locations/?query=${query}`, {
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
};

export default api;
