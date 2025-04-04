// src/components/RestaurantList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('nairobi');
  const [searchInput, setSearchInput] = useState('nairobi');

  useEffect(() => {
    fetchRestaurants(location);
  }, [location]);

  const fetchRestaurants = async (searchLocation) => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to get fresh data from OSM
      const fetchResponse = await axios.get(`/restaurants/fetch_restaurants/?location=${searchLocation}`);
      console.log('Fetch response:', fetchResponse.data);
      
      // Then get the full list from our database
      const listResponse = await axios.get('/restaurants/restaurants/');
      setRestaurants(listResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch restaurants. Please try again later.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLocation(searchInput.trim());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Find Restaurants</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter location (e.g., nairobi, london)"
            className="flex-grow px-4 py-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={restaurant.image_url || '/api/placeholder/400/300'} 
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-500 mb-4">{restaurant.address}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">
                    {restaurant.phone && (
                      <span className="block">{restaurant.phone}</span>
                    )}
                  </p>
                  <Link 
                    to={`/reserve/${restaurant.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  >
                    Reserve
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-8">
            <p className="text-gray-500">No restaurants found. Try a different location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
