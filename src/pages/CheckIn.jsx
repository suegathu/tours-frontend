import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api"; // Adjust API import accordingly
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

const CheckIn = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!bookingId) {
            setError("Invalid booking ID.");
            setLoading(false);
            return;
        }

        const fetchBookingDetails = async () => {
            try {
                const response = await api.getBookingDetails(bookingId);
                setBookingDetails(response);
            } catch (err) {
                setError("Failed to retrieve booking details.", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    return (
        <Container>
            <Typography variant="h4">Flight Check-In</Typography>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {bookingDetails && (
                <div>
                    <Typography variant="h6">Booking ID: {bookingDetails.id}</Typography>
                    <Typography>Flight: {bookingDetails.flight}</Typography>
                    <Typography>Seat: {bookingDetails.seat}</Typography>
                    <Typography>Status: {bookingDetails.status}</Typography>
                    <img src={bookingDetails.qr_code_url} alt="QR Code for Check-in" />
                </div>
            )}
        </Container>
    );
};

export default CheckIn;
