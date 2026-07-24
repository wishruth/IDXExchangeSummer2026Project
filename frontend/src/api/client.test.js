import { fetchProperties } from './client';

// mock global fetch obj call

global.fetch = jest.fn();

describe('API Client - fetchProperties', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('1. Fetches data successfully on the happy path', async () => {
        const mockData = { total: 1, results: [{ L_ListingID: '123' }] };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const result = await fetchProperties();
        expect(result).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith('/api/properties');
    });

    test('2. Strips empty strings from query parameters', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        });

        await fetchProperties({ city: 'Portland', minPrice: '', beds: '3' });
        
        // Assert that minPrice was successfully stripped out
        expect(fetch).toHaveBeenCalledWith('/api/properties?city=Portland&beds=3');
    });

    test('3. Throws a meaningful error message when the API fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({ error: 'Property not found.' })
        });

        await expect(fetchProperties()).rejects.toThrow('Property not found.');
    });
});