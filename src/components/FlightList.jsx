import React, { useState, useEffect } from "react";
import api from "../api/api"; // ✅ Import API object
import FlightCard from "./FlightCard";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]); // ✅ Keep a copy of all flights
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getFlights = async () => {
      try {
        const data = await api.fetchFlights();
        console.log("Fetched Flights Data:", data); // ✅ Log response to check format
  
        // Ensure we are accessing the correct structure
        setFlights(data.flights ? data.flights : data); 
        setAllFlights(data.flights ? data.flights : data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };
    getFlights();
  }, []);
  

  const handleSearch = () => {
    if (!search) {
      setFlights(allFlights); // ✅ Reset to original data if search is empty
      return;
    }
    const filteredFlights = allFlights.filter((flight) =>
      [flight.airline, flight.departure_airport, flight.arrival_airport]
        .some((field) => field && field.toLowerCase().includes(search.toLowerCase()))
    );
    setFlights(filteredFlights);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Flights</h1>

      {/* Search Input & Button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by airline, departure, or arrival..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Flight List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.length > 0 ? (
          flights.map((flight, index) => <FlightCard key={index} flight={flight} />)
        ) : (
          <p>No flights found</p>
        )}
      </div>
    </div>
  );
};

export default FlightList;
