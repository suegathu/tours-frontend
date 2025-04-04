import React, { useState, useEffect } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { API_BASE_URL } from "../api/api";

const FlightConfirmation = () => {
  
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        setMessage(`QR Code Scanned: ${decodedText}`);
        scanner.clear();
      },
      (errorMessage) => {
        console.error("QR Scan Error:", errorMessage);
      }
    );

    return () => scanner.clear();
  }, []);

  const verifyQrCode = () => {
    axios
      .get(`${API_BASE_URL}/api/verify/${scanResult}/`, {
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMjU2NjYyLCJpYXQiOjE3NDMyNTQ4NjIsImp0aSI6ImY1ZTQ0MjJiMDEzYzQ0NmJiN2Q3M2RhNDg1OThjZDY4IiwidXNlcl9pZCI6MX0.gLLQCcVVkkVT5mcbOY3G-QMEXuUGBElLhPwBeqxOkbE` }
      })
      .then((res) => {
        setMessage(`QR Verified! Booking Status: ${res.data.status}`);
        
        // Send Confirmation Email
        axios.post(`${API_BASE_URL}/api/send-confirmation-email/`, { booking_id: scanResult })
          .then(() => setMessage("Confirmation email sent!"))
          .catch(() => setMessage("Failed to send email."));
      })
      .catch(() => setMessage("Invalid QR Code!"));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Flight Confirmation</h1>
      <div id="qr-reader" style={{ width: "300px" }}></div>
      {scanResult && (
        <button 
          onClick={verifyQrCode} 
          className="bg-purple-500 text-white px-4 py-2 rounded mt-2">
          Verify QR Code
        </button>
      )}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default FlightConfirmation;
