import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters'; // added to implement property filters to page view
import Pagination from '../components/Pagination'; // added for pagination feature
import './ListingsPage.css';

const ListingsPage = () => {
    const [properties, setProperties] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});

    // adding pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const loadProperties = async () => {
            try {
                setLoading(true);
                // get the first 20
                setProperties([]);
                const offset = (currentPage - 1) * itemsPerPage;
                const data = await fetchProperties({ ...activeFilters, limit: itemsPerPage, offset });
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
    }, [activeFilters, currentPage]);  // activate re-fetch when active filters change

    const handleSearch = (filters) => {
        setActiveFilters(filters);
        setCurrentPage(1);
    };

    const handleClear = () => {
        setActiveFilters({});
        setCurrentPage(1);
    };

    // handle pg change, scroll to top
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    // calculate display nums
    const startCount = totalProperties === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
    const endCount = Math.min(currentPage * itemsPerPage, totalProperties);

   /* // loading state
    if (loading) return <div className="status-message">Loading properties...</div>;

    // error state
    if (error) return <div className="status-message error">Error: {error}</div>;
    */ 

    return (
        <div className="listings-page">
            <header className="listings-header">
                <h2>Property Search</h2>
                <PropertyFilters onSearch={handleSearch} onClear={handleClear} />
                
                {!loading && !error && (
                    <p className="property-count">Showing {startCount} - {endCount} of {totalProperties} properties</p>
                )}
            </header>
            
            {loading && <div className="status-message">Loading properties...</div>}
            {error && <div className="status-message error">Error: {error}</div>}
            
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

            {/* 5. Render Pagination */}
            {!loading && !error && totalProperties > 0 && (
                <Pagination 
                    currentPage={currentPage} 
                    totalItems={totalProperties} 
                    itemsPerPage={itemsPerPage} 
                    onPageChange={handlePageChange} 
                />
            )}
        </div>
    );
};

export default ListingsPage;