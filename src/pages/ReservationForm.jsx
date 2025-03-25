import React, { useState } from "react";

const ReservationForm = ({ restaurantId }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    date_time: "",
    number_of_people: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/restaurants/${restaurantId}/reserve/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Reservation successful!");
    } else {
      alert("Failed to reserve. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Make a Reservation</h3>
      <input
        type="text"
        name="user_name"
        placeholder="Your Name"
        value={formData.user_name}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="email"
        name="user_email"
        placeholder="Your Email"
        value={formData.user_email}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="datetime-local"
        name="date_time"
        value={formData.date_time}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="number"
        name="number_of_people"
        placeholder="Number of People"
        value={formData.number_of_people}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        min="1"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Reserve Now
      </button>
    </form>
  );
};

export default ReservationForm;
