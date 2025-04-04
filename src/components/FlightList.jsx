import React, { useState } from "react";
import api from "../api/api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState({ from: "", to: "", date: "" });
  const navigate = useNavigate();

  const fetchFlightsFromAviationStack = async () => {
    setLoading(true);
    setError("");

    if (!search.from || !search.to || !search.date) {
      setError("Please enter departure, destination, and date.");
      setLoading(false);
      return;
    }

    try {
      const flightsData = await api.searchFlights(
        search.from,
        search.to,
        search.date
      );
      console.log("Fetched Flights:", flightsData);
      setFlights(flightsData);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError(
        err.response?.data?.message ||
          "Error fetching flights. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Flights</h1>
      <TextField
        label="From"
        variant="outlined"
        value={search.from}
        onChange={(e) => setSearch({ ...search, from: e.target.value })}
        style={{ marginRight: "10px" }}
      />
      <TextField
        label="To"
        variant="outlined"
        value={search.to}
        onChange={(e) => setSearch({ ...search, to: e.target.value })}
        style={{ marginRight: "10px" }}
      />
      <TextField
        type="date"
        variant="outlined"
        value={search.date}
        onChange={(e) => setSearch({ ...search, date: e.target.value })}
        style={{ marginRight: "10px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchFlightsFromAviationStack}
      >
        Search Flights
      </Button>

      {loading && <CircularProgress style={{ marginTop: "20px" }} />}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {flights.length > 0 ? (
          flights.map((flight, index) => {
            const flightId = flight.id ?? flight.flight_number ?? null; // ✅ Use flight_number as backup

            return (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {flight.airline} ({flight.flight_number})
                    </Typography>
                    <Typography>From: {flight.departure_airport}</Typography>
                    <Typography>To: {flight.arrival_airport}</Typography>
                    <Typography>Departure: {flight.departure_time}</Typography>
                    <Typography>Arrival: {flight.arrival_time}</Typography>
                    <Typography>
                      Seats Available: {flight.available_seats ?? "Not Available"}
                    </Typography>
                    <Typography>Price: ${flight.price ?? "TBD"}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!flightId} // ✅ Disable if ID is missing
                      onClick={() => {
                        if (!flightId) {
                          setError("Flight ID is missing. Unable to book.");
                        } else {
                          navigate(`/book-flight/${flightId}`);
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          !loading && <p>No flights available.</p>
        )}
      </Grid>
    </div>
  );
};

export default FlightList;
