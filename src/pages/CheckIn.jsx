import React, { useState } from "react";
import api from "../api/api";
import { TextField, Button, Container, Typography } from "@mui/material";

const CheckIn = () => {
    const [bookingId, setBookingId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleCheckIn = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You need to log in first.");
            return;
        }

        try {
            const response = await api.checkInFlight(bookingId);

            if (response.success) {
                setMessage(`Check-in successful! Here’s your QR code: ${response.qr_code}`);
                setError("");
            } else {
                setError(response.message || "Check-in failed. Please try again.");
            }
        } catch (err) {
            console.error("Error checking in:", err);
            setError("An error occurred while checking in.");
        }
    };

    return (
        <Container>
            <Typography variant="h4">Flight Check-In</Typography>
            <TextField 
                label="Booking ID" 
                value={bookingId} 
                onChange={(e) => setBookingId(e.target.value)} 
                fullWidth 
                margin="normal" 
            />
            <Button variant="contained" color="primary" onClick={handleCheckIn}>
                Check In
            </Button>
            {message && <Typography color="green">{message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
        </Container>
    );
};

export default CheckIn;
