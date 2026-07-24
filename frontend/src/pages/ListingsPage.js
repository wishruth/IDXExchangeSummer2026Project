import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import './ListingsPage.css';

const ListingsPage = () => {
    const [properties, setProperties] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                // get the first 20
                const data = await fetchProperties({ limit: 20, offset: 0 });
                setProperties(data.results);
                setTotalProperties(data.total);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, []);

    // loading state
    if (loading) return <div className="status-message">Loading properties...</div>;

    // error state
    if (error) return <div className="status-message error">Error: {error}</div>;

    return (
        <div className="listings-page">
            <header className="listings-header">
                <h2>Property Search</h2>
                <p className="property-count">Showing {properties.length} of {totalProperties} properties</p>
            </header>
            
            <div className="property-grid">
                {properties.map(property => (
                    <PropertyCard key={property.L_ListingID} property={property} />
                ))}
            </div>
        </div>
    );
};

export default ListingsPage;