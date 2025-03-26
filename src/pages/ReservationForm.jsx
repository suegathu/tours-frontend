import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ReservationForm = () => {
    const { restaurantId } = useParams();
    const [formData, setFormData] = useState({
        user_name: "",
        user_email: "",
        date_time: "",
        guests: 1,
        special_request: ""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/reservations/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...formData, restaurant: restaurantId })
            });

            if (response.ok) {
                setMessage("Reservation successful!");
                setFormData({
                    user_name: "",
                    user_email: "",
                    date_time: "",
                    guests: 1,
                    special_request: ""
                });
            } else {
                setMessage("Failed to make reservation. Try again.");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div>
            <h2>Book a Table</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="user_name" placeholder="Your Name" value={formData.user_name} onChange={handleChange} required />
                <input type="email" name="user_email" placeholder="Your Email" value={formData.user_email} onChange={handleChange} required />
                <input type="datetime-local" name="date_time" value={formData.date_time} onChange={handleChange} required />
                <input type="number" name="guests" placeholder="Guests" value={formData.guests} onChange={handleChange} min="1" required />
                <textarea name="special_request" placeholder="Special Requests" value={formData.special_request} onChange={handleChange}></textarea>
                <button type="submit">Reserve Now</button>
            </form>
        </div>
    );
};

export default ReservationForm;
