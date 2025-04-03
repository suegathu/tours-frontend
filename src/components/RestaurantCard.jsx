import React from "react";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.phone ? `📞 ${restaurant.phone}` : "No phone available"}</p>
      
      {restaurant.website && (
        <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      )}
      
      {/* Reservation Button Logic */}
      {restaurant.reservation_link ? (
        <a href={restaurant.reservation_link} target="_blank" rel="noopener noreferrer">
          <button className="reserve-button">Reserve Now</button>
        </a>
      ) : restaurant.phone ? (
        <a href={`tel:${restaurant.phone}`}>
          <button className="call-button">Call to Book</button>
        </a>
      ) : (
        <Link to={`/restaurants/${restaurant.id}/reservation`}>
          <button className="reserve-button">Reserve a Table</button>
        </Link>
      )}
    </div>
  );
};

export default RestaurantCard;