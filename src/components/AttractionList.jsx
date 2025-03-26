import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const AttractionList = () => {
    const [attractions, setAttractions] = useState([]);
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.fetchAttractions(category).then(setAttractions);
    }, [category]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Attractions</h1>
            
            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border p-2 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="border p-2 rounded" onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="museum">Museum</option>
                    <option value="historic">Historic</option>
                    <option value="nature">Nature</option>
                </select>
            </div>

            {/* Display Attractions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {attractions
                    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
                    .map((attraction) => (
                        <div key={attraction.id} className="border p-4 rounded-lg shadow-md">
                            <img
                                src={attraction.image_url || "https://via.placeholder.com/300"}
                                alt={attraction.name}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <h2 className="text-lg font-bold mt-2">{attraction.name}</h2>
                            <p className="text-sm text-gray-600">{attraction.category}</p>
                            <p className="text-sm">{attraction.address}</p>
                            <Link to={`/attractions/${attraction.id}`} className="text-blue-500">
                                View Details
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AttractionList;
