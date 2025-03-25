import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/restaurants/${id}/`)
      .then((res) => res.json())
      .then((data) => setRestaurant(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{restaurant.name}</h2>
      <p className="text-gray-600">{restaurant.address}</p>

      {/* Reservation Form */}
      <ReservationForm restaurantId={id} />
    </div>
  );
};

export default RestaurantDetail;
