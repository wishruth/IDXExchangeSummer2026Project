import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe('PropertyFilters Component', () => {
    test('1. Renders all 6 input fields correctly', () => {
        render(<PropertyFilters onSearch={jest.fn()} onClear={jest.fn()} />);
        
        expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /beds/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /baths/i })).toBeInTheDocument();
    });

    test('2. Submitting the form calls onSearch with form values', () => {
        const mockOnSearch = jest.fn();
        render(<PropertyFilters onSearch={mockOnSearch} onClear={jest.fn()} />);

        // type into city field
        fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Portland' } });

        // Click the search button
        fireEvent.click(screen.getByText('Search'));

        expect(mockOnSearch).toHaveBeenCalledWith({
            city: 'Portland',
            zipcode: '',
            minPrice: '',
            maxPrice: '',
            beds: '',
            baths: ''
        });
    });

    test('3. Clicking Clear Filters resets the form and calls onClear', () => {
        const mockOnClear = jest.fn();
        render(<PropertyFilters onSearch={jest.fn()} onClear={mockOnClear} />);
        
        const cityInput = screen.getByPlaceholderText('City');
        fireEvent.change(cityInput, { target: { value: 'Seattle' } });
        
        // Ensure it changed
        expect(cityInput.value).toBe('Seattle');
        
        // Click clear
        fireEvent.click(screen.getByText('Clear Filters'));
        
        // Ensure it reset the input state and triggered the clear function
        expect(cityInput.value).toBe('');
        expect(mockOnClear).toHaveBeenCalledTimes(1);
    });
});