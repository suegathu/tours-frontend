import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Function to check if the user is logged in based on the token in localStorage
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);  // If there's a token, the user is logged in
  };

  useEffect(() => {
    checkLoginStatus();  // Check the login status on initial render
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);  // Immediately update the state to reflect logout
    navigate("/");  // Redirect to home page
  };

  const handleLogin = () => {
    checkLoginStatus();  // Check the login status after login action
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">Travel With Sue</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/flights">Flights</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          ) : (
            <>
              <li><Link to="/login" onClick={handleLogin}>Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
