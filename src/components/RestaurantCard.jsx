import React from "react";
import { Link } from "react-router-dom";
import "./RestaurantCard.css"; // Ensure you have a CSS file

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.address}</p>

      {/* Display image if available, otherwise show placeholder text */}
      {restaurant.images && restaurant.images.length > 0 ? (
        <img src={restaurant.images[0]} alt={restaurant.name} className="restaurant-image" width="200" />
      ) : (
        <p>No Image Available</p>
      )}

      {/* Restaurant Website Link */}
      <a href={restaurant.website || "#"} target="_blank" rel="noopener noreferrer">
        Visit Website
      </a>

      {/* Reserve Button */}
      <Link to="/{id}reservationForm">
      <button className="reserve-button">Reserve Now</button>
    </Link>
    </div>
  );
};

export default RestaurantCard;
