import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

function RestaurantDetail({ id }) {
    const [restaurant, setRestaurant] = useState(null);
  
    useEffect(() => {
      axios.get(`${API_BASE_URL}/restaurants/${id}/`)
        .then(response => setRestaurant(response.data))
        .catch(error => console.error("Error fetching details:", error));
    }, [id]);
  
    if (!restaurant) return <p>Loading...</p>;
  
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <img src={restaurant.image_url || "https://via.placeholder.com/150"} alt={restaurant.name} className="w-full h-60 object-cover rounded" />
        <p className="mt-2">{restaurant.address}</p>
        <p className="mt-2">Average Price: ${restaurant.average_price}</p>
        <Link to="/" className="text-blue-500 underline">Back to Restaurants</Link>
      </div>
    );
  }
  
export default RestaurantDetail;  