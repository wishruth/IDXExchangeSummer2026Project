import React, { useState } from 'react';
import './PropertyFilters.css';

const PropertyFilters = ({ onSearch, onClear }) => {
    // All filters controlled using single react state obj
    const initialFormState = { city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: '' };
    const [filters, setFilters] = useState(initialFormState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleClear = () => {
        setFilters(initialFormState);
        onClear(); // reset all results in parent component
    };

    return (
        <form className="property-filters" onSubmit={handleSubmit}>
            <div className="filter-group">
                <input name="city" placeholder="City" value={filters.city} onChange={handleChange} />
                <input name="zipcode" placeholder="ZIP Code" value={filters.zipcode} onChange={handleChange} />
                <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleChange} />
                <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleChange} />
                
                <select name="beds" aria-label="beds" value={filters.beds} onChange={handleChange}>
                    <option value="">Beds (Any)</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                </select>
                
                <select name="baths" aria-label="baths" value={filters.baths} onChange={handleChange}>
                    <option value="">Baths (Any)</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                </select>
            </div>
            
            <div className="filter-actions">
                <button type="submit" className="search-btn">Search</button>
                <button type="button" className="clear-btn" onClick={handleClear}>Clear Filters</button>
            </div>
        </form>
    );
};

export default PropertyFilters;