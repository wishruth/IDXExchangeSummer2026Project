import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // hide if there's only 1 page
    if (totalPages <= 1) return null;

    // helper func to generate exact pg num & ellipsis
    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }
        
        if (currentPage >= totalPages - 3) {
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className="pagination-container">
            <button 
                className="pagination-btn" 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            
            <div className="page-numbers">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
                        onClick={() => page !== '...' && onPageChange(page)}
                        disabled={page === '...'}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button 
                className="pagination-btn" 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;