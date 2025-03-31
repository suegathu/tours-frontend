import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/api"; // Adjust API import accordingly
import { Container, Typography, CircularProgress, Alert, Button } from "@mui/material";

const CheckIn = () => {
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("booking_id");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkInError, setCheckInError] = useState("");
    const [checkInSuccess, setCheckInSuccess] = useState("");

    useEffect(() => {
        if (!bookingId) {
            console.error("No booking ID found in URL.");
            setError("Invalid booking ID.");
            setLoading(false);
            return;
        }

        const fetchBookingDetails = async () => {
            try {
                console.log("Fetching booking details for ID:", bookingId);
                const response = await api.getBookingDetails(bookingId);

                if (!response || typeof response !== "object") {
                    throw new Error("Invalid response format. Expected JSON.");
                }

                setBookingDetails(response);
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setError("Failed to retrieve booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    const handleCheckIn = async () => {
        if (!bookingId) {
            setCheckInError("Invalid booking ID.");
            return;
        }

        setCheckInLoading(true);
        setCheckInError("");
        setCheckInSuccess("");

        try {
            const response = await api.checkInFlight(bookingId);

            if (response && response.booking_status === "checked_in") {
                setCheckInSuccess("Check-in successful!");
                setBookingDetails((prevDetails) => ({
                    ...prevDetails,
                    status: "checked_in",
                }));
            } else {
                throw new Error(response.message || "Check-in failed.");
            }
        } catch (err) {
            console.error("Check-in error:", err);
            setCheckInError(err.message);
        } finally {
            setCheckInLoading(false);
        }
    };

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
                    {bookingDetails.qr_code_url && (
                        <img src={bookingDetails.qr_code_url} alt="QR Code for Check-in" />
                    )}

                    {bookingDetails.status !== "checked_in" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCheckIn}
                            disabled={checkInLoading}
                            style={{ marginTop: "20px" }}
                        >
                            {checkInLoading ? "Checking In..." : "Check In"}
                        </Button>
                    )}

                    {checkInSuccess && <Alert severity="success">{checkInSuccess}</Alert>}
                    {checkInError && <Alert severity="error">{checkInError}</Alert>}
                </div>
            )}
        </Container>
    );
};

export default CheckIn;
