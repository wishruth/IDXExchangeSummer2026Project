import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters'; // added to implement property filters to page view
import './ListingsPage.css';

const ListingsPage = () => {
    const [properties, setProperties] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                // get the first 20
                setProperties([]);
                const data = await fetchProperties({ ...activeFilters, limit: 20, offset: 0 });
                setProperties(data.results);
                setTotalProperties(data.total);
                setError(null);
            } catch (err) {
                setError(err.message);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, [activeFilters]);  // activate re-fetch when active filters change

    const handleSearch = (filters) => {
        setActiveFilters(filters);
    };

    const handleClear = () => {
        setActiveFilters({});
    };

   /* // loading state
    if (loading) return <div className="status-message">Loading properties...</div>;

    // error state
    if (error) return <div className="status-message error">Error: {error}</div>;
    */ 

    return (
        <div className="listings-page">
            <header className="listings-header">
                <h2>Property Search</h2>
                {/* Integrate the Filters UI */}
                <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
                
                {!loading && !error && (
                    <p className="property-count">Showing {properties.length} of {totalProperties} properties</p>
                )}
            </header>
            
            {loading && <div className="status-message">Loading properties...</div>}
            {error && <div className="status-message error">Error: {error}</div>}
            
            {/* "No properties found" Acceptance Criteria */}
            {!loading && !error && properties.length === 0 && (
                <div className="status-message no-results">
                    No properties found matching your criteria. Try adjusting your filters.
                </div>
            )}

            <div className="property-grid">
                {properties.map(property => (
                    <PropertyCard key={property.L_ListingID} property={property} />
                ))}
            </div>
        </div>
    );
};

export default ListingsPage;