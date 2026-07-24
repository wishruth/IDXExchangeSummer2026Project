import React from 'react';
// using css for hovering card effect
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
    let firstPhoto = "https://via.placeholder.com/400x300?text=No+Photo+Available";
    
    try {
        if (property.L_Photos) {
            const parsedPhotos = JSON.parse(property.L_Photos);
            // Ensure it actually parsed into an array and has at least one item
            if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
                firstPhoto = parsedPhotos[0];
            }
        }
        } catch (e) {
            // catch error, fall back to placeholder img
            console.warn(`Could not parse photos for listing ${property.L_ListingID}`);
    }

    // format price w/ commas for viewing
    const formattedPrice = property.L_SystemPrice 
        ? `$${Number(property.L_SystemPrice).toLocaleString()}` 
        : "Price Upon Request";

    return (
        <div className="property-card">
            <img 
                src={firstPhoto} 
                alt={`Property at ${property.L_Address}`} 
                className="property-image"
                onError={(e) => {
                    // no inf loop in case placeholder URL ever fails
                    e.target.onerror = null; 
                    // Swap broken source with fallback image
                    e.target.src = "https://dummyimage.com/400x300/cccccc/000000&text=No+Photo+Available";
                }}
            />
            <div className="property-details">
                <h3 className="property-price">{formattedPrice}</h3>
                <p className="property-address">{property.L_Address}</p>
                <p className="property-location">{property.L_City}, {property.L_State}</p>
                
                <div className="property-stats">
                    {/* Remember to use the RETS column names! */}
                    <span>{property.L_Keyword2 || '--'} beds</span>
                    <span> &bull; </span>
                    <span>{property.LM_Dec_3 || '--'} baths</span>
                    <span> &bull; </span>
                    <span>{property.LM_Int2_3 || '--'} sqft</span>
                </div>
            </div>
        </div>
    );
};
export default PropertyCard;