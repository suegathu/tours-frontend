import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/restaurants/`)
      .then(response => setRestaurants(response.data))
      .catch(error => console.error("Error fetching restaurants:", error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Restaurants</h1>
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mt-2"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {restaurants.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(restaurant => (
          <div key={restaurant.id} className="border p-4 rounded shadow">
            <img src={restaurant.image_url || "https://via.placeholder.com/150"} alt={restaurant.name} className="w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{restaurant.name}</h2>
            <p>{restaurant.address}</p>
            <Link to={`/restaurant/${restaurant.id}`} className="text-blue-500 underline">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RestaurantList