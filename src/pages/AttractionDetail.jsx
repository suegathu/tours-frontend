import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import "./AttractionDetail.css"; 

const AttractionDetail = () => {
    const { id } = useParams();
    const [attraction, setAttraction] = useState(null);

    useEffect(() => {
        api.fetchAttractionById(id).then(setAttraction);
    }, [id]);

    if (!attraction) return <p className="loading">Loading...</p>;

    return (
        <div className="attraction-detail">
            <h1 className="title">{attraction.name}</h1>

            {/* Image Gallery */}
            <div className="image-gallery">
                {attraction.images && attraction.images.length > 0 ? (
                    attraction.images.map((image, index) => (
                        <img key={index} src={image} alt={attraction.name} className="gallery-image" />
                    ))
                ) : (
                    <img src="https://via.placeholder.com/500" alt={attraction.name} className="gallery-image" />
                )}
            </div>

            {/* Attraction Info */}
            <div className="info">
                <p><strong>📍 Address:</strong> {attraction.address || "Not available"}</p>
                <p><strong>🏷️ Category:</strong> {attraction.category || "Unknown"}</p>
                <p><strong>🌍 Coordinates:</strong> {attraction.latitude}, {attraction.longitude}</p>
                <p><strong>🕒 Opening Hours:</strong> {attraction.opening_hours || "Not available"}</p>
                <p><strong>⭐ Rating:</strong> {attraction.rating || "No ratings yet"}</p>

                {/* Website Link */}
                {attraction.website && (
                    <a href={attraction.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        Visit Website
                    </a>
                )}
            </div>

            {/* User Reviews Section */}
            <div className="reviews">
                <h2>User Reviews</h2>
                {attraction.reviews && attraction.reviews.length > 0 ? (
                    attraction.reviews.map((review, index) => (
                        <div key={index} className="review">
                            <p><strong>{review.user}</strong>: {review.comment}</p>
                            <p>⭐ {review.rating}/5</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews available</p>
                )}
            </div>

            {/* Back Link */}
            <Link to="/" className="back-link">← Back to Attractions</Link>
        </div>
    );
};

export default AttractionDetail;
