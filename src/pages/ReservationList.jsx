import React, { useEffect, useState } from "react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/reservations/")
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul className="list-disc pl-4">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="mb-2">
              {reservation.user_name} - {reservation.restaurant} ({reservation.date_time})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationList;
