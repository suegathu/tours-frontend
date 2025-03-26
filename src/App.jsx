import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import Home from "./pages/Home";
import ReservationForm from "./pages/ReservationForm";
import ReservationList from "./pages/ReservationList";
import RestaurantDetail from "./pages/RestaurantDetails";
import Flights from "./pages/Flights";
import FlightDetailsPage from "./components/FlightDetail";
import FlightBooking from "./pages/FlightBooking";
import AttractionList from "./components/AttractionList";
import AttractionDetail from "./pages/AttractionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants/:restaurantId/reservation" element={<ReservationForm />} />
        <Route path="/reservationList" element={<ReservationList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/:flightNumber" element={<FlightDetailsPage />} />
        <Route path="/book-flight" element={<FlightBooking />} />
        <Route path="/attractions" element={<AttractionList />} /> 
        <Route path="/attractions/:id" element={<AttractionDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
