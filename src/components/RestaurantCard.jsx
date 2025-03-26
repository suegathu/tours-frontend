import React from "react";
import { Link } from "react-router-dom";
import "./RestaurantCard.css"; // Ensure you have a valid CSS file

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.address}</p>

      {/* Check if restaurant.image_url exists */}
      {restaurant.image_url ? (
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="restaurant-image"
          width="200"
        />
      ) : (
        <p>No Image Available</p>
      )}

      {/* Restaurant Website Link */}
      <a href={restaurant.website || "#"} target="_blank" rel="noopener noreferrer">
        Visit Website
      </a>

      {/* Reserve Button */}
      <Link to={`/restaurants/${restaurant.id}/reservation`}>
        <button className="reserve-button">Reserve Now</button>
      </Link>
    </div>
  );
};

export default RestaurantCard;
