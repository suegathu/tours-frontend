import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { API_BASE_URL } from "../api/api"; 
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
            setError("Invalid booking ID.");
            setLoading(false);
            return;
        }

        const fetchBookingDetails = async () => {
            try {
                const response = await api.getBookingDetails(bookingId);
                if (!response || typeof response !== "object") {
                    throw new Error("Invalid response format. Expected JSON.");
                }
                setBookingDetails(response);
            } catch (err) {
                setError(err.message || "Failed to retrieve booking details.");
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

            if (response?.booking_status === "checked_in") {
                setCheckInSuccess("Check-in successful!");
                setBookingDetails((prevDetails) => ({
                    ...prevDetails,
                    status: "checked_in",
                }));
            } else {
                throw new Error(response?.message || "Check-in failed.");
            }
        } catch (err) {
            setCheckInError(err.message);
        } finally {
            setCheckInLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Flight Check-In
            </Typography>

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {bookingDetails && !loading && (
                <div>
                    <Typography variant="h6">Booking ID: {bookingDetails.id}</Typography>
                    <Typography>Flight: {bookingDetails.flight}</Typography>
                    <Typography>Seat: {bookingDetails.seat}</Typography>
                    <Typography>Status: {bookingDetails.status}</Typography>
                    
                    {bookingDetails.qr_code_url && (
                        <img 
                            src={`${API_BASE_URL}${bookingDetails.qr_code_url}`} 
                            alt="QR Code for Check-in" 
                            style={{ marginTop: "10px", width: "150px", height: "150px" }}
                        />
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

                    {checkInSuccess && <Alert severity="success" style={{ marginTop: "10px" }}>{checkInSuccess}</Alert>}
                    {checkInError && <Alert severity="error" style={{ marginTop: "10px" }}>{checkInError}</Alert>}
                </div>
            )}
        </Container>
    );
};

export default CheckIn;
