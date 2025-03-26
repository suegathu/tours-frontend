
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ReservationForm from "./pages/ReservationForm";
import ReservationList from "./pages/ReservationList";
import RestaurantDetail from "./pages/RestaurantDetails";
import Flights from "./pages/Flights";
import FlightDetailsPage from "./components/FlightDetail";
import FlightBooking from "./pages/FlightBooking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants/:restaurantId/reservation" element={<ReservationForm />} />
        <Route path="/reservationList" element={<ReservationList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/:flightNumber" element={<FlightDetailsPage />} />
        <Route path="/book-flight" element={<FlightBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
