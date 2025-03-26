import React from "react";

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
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            restaurant.name + " " + restaurant.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="map-button">Find & Reserve</button>
        </a>
      )}
    </div>
  );
};

export default RestaurantCard;
