import React from "react";
import "./AttractionCard.css"; // Ensure you create AttractionCard.css for styling

function AttractionCard({ attraction }) {
  return (
    <div className="attraction-card">
      {/* Image */}
      <img 
        src={attraction.image || attraction.image_url || "https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-water-park-attraction-and-pool-landing-header-vector-png-image_11903539.png"} 
        alt={attraction.name} 
        className="attraction-image"
        onError={(e) => { e.target.src = "https://png.pngtree.com/png-vector/20240309/ourmid/pngtree-water-park-attraction-and-pool-landing-header-vector-png-image_11903539.png"; }} 
        />

      {/* Name & Address */}
      <div className="attraction-details">
        <h3 className="attraction-name">{attraction.name}</h3>
        <p className="attraction-address">{attraction.address}</p>
      </div>

      {/* View More Button */}
      <a 
        href={`/attractions/${attraction.id}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="view-button"
        >
        View Details
        </a>

    </div>
  );
}

export default AttractionCard;
