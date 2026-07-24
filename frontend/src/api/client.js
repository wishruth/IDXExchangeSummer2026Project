// first - helper func to process fetching response
// handle http errors gracefully
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (e) {
            // fallback in case response isn't a valid JSON
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

// second - fetch paginated + filterable list of properties
// remove empty strings
export const fetchProperties = async (params = {}) => {
    const urlParams = new URLSearchParams();
    // loop thru params, only add valid values
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            urlParams.append(key, value);
        }
    });
    const queryString = urlParams.toString();
    const url = `/api/properties${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
};

// third - fetch single property detaisl w/ listing id
export const fetchPropertyDetail = async (id) => {
    const response = await fetch(`/api/properties/${id}`);
    return handleResponse(response);
};

// fourth - fetch open houses for specific property 
export const fetchOpenHouses = async (id) => {
    const response = await fetch(`/api/properties/${id}/openhouses`);
    return handleResponse(response);
};