import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyDetail } from '../api/client';
import './PropertyDetail.css';

const PropertyDetail = () => {
    const { id } = useParams(); // get prop id from url
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchPropertyDetail(id);
                setProperty(data);

                // parse photo arr for gallery
                if (data.L_Photos) {
                    try {
                        const parsed = JSON.parse(data.L_Photos);
                        if (Array.isArray(parsed)) setPhotos(parsed);
                    } catch (e) {
                        console.warn("Failed to parse photos in detail view");
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [id]);

    if (loading) return <div className="status-message">Loading property details...</div>;
    if (error) return <div className="status-message error">Error: {error}</div>;
    if (!property) return <div className="status-message">Property not found.</div>;

    const formattedPrice = property.L_SystemPrice ? `$${Number(property.L_SystemPrice).toLocaleString()}` : "Price Upon Request";
    const fullAddress = `${property.L_Address}, ${property.L_City}, ${property.L_State} ${property.L_Zip}`;

    // format addy for gmaps query string
    const mapQuery = encodeURIComponent(fullAddress);

    return (
        <div className="property-detail-page">
            <Link to="/" className="back-link">&larr; Back to Search</Link>
            
            <header className="detail-header">
                <div>
                    <h1>{property.L_Address}</h1>
                    <p className="detail-location">{property.L_City}, {property.L_State} {property.L_Zip}</p>
                </div>
                <h2 className="detail-price">{formattedPrice}</h2>
            </header>

            <div className="detail-content">
                <div className="main-info">
                    {/* Primary Image / Simple Gallery Fallback */}
                    <div className="photo-gallery">
                        <img 
                            src={photos.length > 0 ? photos[0] : "https://dummyimage.com/800x600/cccccc/000000&text=No+Photo"} 
                            alt="Main Property View" 
                            className="main-photo"
                            onError={(e) => { e.target.src = "https://dummyimage.com/800x600/cccccc/000000&text=No+Photo"; }}
                        />
                        {photos.length > 1 && (
                            <div className="thumbnail-strip">
                                {photos.slice(1, 5).map((photoUrl, idx) => (
                                    <img key={idx} src={photoUrl} alt={`Thumbnail ${idx + 1}`} className="thumbnail" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="property-specs">
                        <div className="spec-item"><strong>Beds:</strong> {property.L_Keyword2 || '--'}</div>
                        <div className="spec-item"><strong>Baths:</strong> {property.LM_Dec_3 || '--'}</div>
                        <div className="spec-item"><strong>SqFt:</strong> {property.LM_Int2_3 || '--'}</div>
                        <div className="spec-item"><strong>Property Type:</strong> {property.L_Type_ || 'Residential'}</div>
                        <div className="spec-item"><strong>Year Built:</strong> {property.L_AskingPrice || '--'}</div>
                    </div>
                    
                    <div className="property-remarks">
                        <h3>Description</h3>
                        <p>{property.L_Remarks || "No description provided for this property."}</p>
                    </div>
                </div>

                <div className="sidebar">
                    <div className="map-container">
                        <h3>Location</h3>
                        <iframe
                            title="Google Maps Location"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '8px' }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBBUFiBKUq6Y2I8XbD1bOUXfviavXrcY3g&q=${mapQuery}`}
                        ></iframe>
                        <p className="map-note">
                            *Note: To fully activate the map, replace YOUR_API_KEY_HERE with a Google Cloud Console key, or swap this iframe source to a standard non-API embed link.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;