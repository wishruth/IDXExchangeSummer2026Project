import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
    test('1. Disables Previous button on the first page', () => {
        render(<Pagination currentPage={1} totalItems={100} itemsPerPage={20} onPageChange={jest.fn()} />);
        const prevButton = screen.getByText('Previous');
        expect(prevButton).toBeDisabled();
    });

    test('2. Disables Next button on the last page', () => {
        render(<Pagination currentPage={5} totalItems={100} itemsPerPage={20} onPageChange={jest.fn()} />);
        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeDisabled();
    });

    test('3. Calls onPageChange with correct page number when a page is clicked', () => {
        const mockOnPageChange = jest.fn();
        render(<Pagination currentPage={1} totalItems={100} itemsPerPage={20} onPageChange={mockOnPageChange} />);
        
        const page2Button = screen.getByText('2');
        fireEvent.click(page2Button);
        
        expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test('4. Renders ellipsis correctly for large datasets', () => {
        // 1000 items / 20 = 50 pages. Being on page 1 should render an ellipsis near the end
        render(<Pagination currentPage={1} totalItems={1000} itemsPerPage={20} onPageChange={jest.fn()} />);
        
        const buttons = screen.getAllByRole('button');
        const hasEllipsis = buttons.some(btn => btn.textContent === '...');
        expect(hasEllipsis).toBe(true);
    });

    test('5. Returns null (hidden) when there is only 1 page of results', () => {
        const { container } = render(<Pagination currentPage={1} totalItems={10} itemsPerPage={20} onPageChange={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });
});