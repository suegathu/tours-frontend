import React from "react";

const getBookingLink = (place, type) => {
  if (!place.name) {
    console.warn("Missing place name for booking links:", place);
    return "#";
  }

  const encodedName = encodeURIComponent(place.name);
  const encodedCity = place.address?.city ? encodeURIComponent(place.address.city) : "";

  if (type === "hotel") {
    // If a Booking.com ID is available for hotels
    if (place.booking_id) {
      return `https://www.booking.com/hotel/${place.booking_id}.html`;
    }
    // Search hotels by name & city
    return `https://www.booking.com/searchresults.html?ss=${encodedName}+${encodedCity}`;
  } else if (type === "attraction") {
    // Booking.com attraction search URL pattern
    return `https://www.booking.com/attractions/search.html?dest_type=city&ss=${encodedName}`;
  }

  return "#"; // Default case if type is incorrect
};

const Booking = ({ place, type }) => {
  const bookingUrl = getBookingLink(place, type);

  return (
    <div>
      {bookingUrl !== "#" ? (
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
          <button className="booking-button">Book {type === "hotel" ? "Hotel" : "Attraction"}</button>
        </a>
      ) : (
        <p>No booking link available</p>
      )}
    </div>
  );
};

export default Booking;
