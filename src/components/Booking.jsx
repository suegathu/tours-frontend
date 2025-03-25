import React from "react";

const getBookingLink = (place) => {
  if (!place.name) {
    console.warn("Missing place name for booking links:", place);
    return "#";
  }

  // If a Booking.com ID is available, use it for direct linking
  if (place.booking_id) {
    return `https://www.booking.com/hotel/${place.booking_id}.html`;
  }

  // Encode hotel name and city for the search URL
  const encodedName = encodeURIComponent(place.name);
  const encodedCity = place.address?.city ? encodeURIComponent(place.address.city) : "";

  return `https://www.booking.com/searchresults.html?ss=${encodedName}+${encodedCity}`;
};

const Booking = ({ hotel }) => {
  const bookingUrl = getBookingLink(hotel);

  return (
    <div>
      {bookingUrl !== "#" ? (
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
          <button className="booking-button">Book Now</button>
        </a>
      ) : (
        <p>No booking link available</p>
      )}
    </div>
  );
};

export default Booking;
