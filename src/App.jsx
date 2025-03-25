
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ReservationForm from "./pages/ReservationForm";
import ReservationList from "./pages/ReservationList";
import RestaurantDetail from "./pages/RestaurantDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservationForm" element={<ReservationForm />} />
        <Route path="/reservationList" element={<ReservationList />} />
        <Route path="/restaurantDetail" element={<RestaurantDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
