import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { Button, Container, Typography, Select, MenuItem, CircularProgress } from "@mui/material";

const BookFlight = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // ✅ Added loading state

    // ✅ Fetch available seats
    const fetchAvailableSeats = async () => {
        setLoading(true);
        setError("");
        
        try {
            const response = await api.getAvailableSeats(flightId);
            console.log("API Response:", response);

            let seats = response.available_seats || response; // Handle different response formats

            if (!Array.isArray(seats)) {
                throw new Error("Invalid seats format received.");
            }

            setAvailableSeats(seats);
        } catch (err) {
            console.error("Error fetching seats:", err);
            setAvailableSeats([]);
            setError("Failed to fetch available seats.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Ensure user is logged in & fetch seats
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            fetchAvailableSeats();
        }
    }, [navigate, flightId]);

    // ✅ Log availableSeats after state update
    useEffect(() => {
        console.log("Updated availableSeats:", availableSeats);
    }, [availableSeats]);

    // ✅ Handle booking
    const handleBooking = async () => {
        if (!selectedSeat) {
            setError("Please select a seat.");
            return;
        }
    
        try {
            const response = await api.bookFlight(flightId, selectedSeat);
            console.log("Booking Response:", response);
    
            if (response && response.success) {
                setMessage(`Booking successful! Booking ID: ${response.booking_id}`);
                setError("");
                setSelectedSeat("");
    
                // Redirect to the check-in page
                navigate(`/checkin?booking_id=${response.booking_id}`);
            } else {
                throw new Error(response.message || "Booking failed. Please try again.");
            }
        } catch (err) {
            console.error("Error booking flight:", err);
            setError(err.message || "An error occurred while booking the flight.");
        }
    };
    

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Book Your Flight
            </Typography>

            <Typography variant="h6" marginTop={2}>
                Select Your Seat:
            </Typography>

            {/* ✅ Show loading indicator while fetching seats */}
            {loading ? (
                <CircularProgress />
            ) : (
                <Select
                    value={selectedSeat}
                    onChange={(e) => setSelectedSeat(e.target.value)}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select a seat</MenuItem>
                    {availableSeats.length > 0 ? (
                        availableSeats.map((seat, index) => (
                            <MenuItem key={index} value={seat}>{`Seat ${seat}`}</MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No seats available</MenuItem>
                    )}
                </Select>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleBooking}
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={loading} // ✅ Disable button while loading
            >
                Confirm Booking
            </Button>

            {message && <Typography color="green">{message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
        </Container>
    );
};

export default BookFlight;
