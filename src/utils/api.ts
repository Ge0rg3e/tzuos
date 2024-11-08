import axios from 'axios';

// Type definition for the allowed API routes
type Route = '/api/setup' | '/api/auth' | '/api/logout' | '/api/desktop/file-explorer';

// Type definition for the payload, which is an object with keys of type string and values of any type
type Payload = Record<string, ExpectedAny>;

// Type definition for the HTTP method, which can be either GET or POST
type Method = 'GET' | 'POST';

// Function to make an HTTP request to a specified API route with a given method and payload
export const makeEndpointRequest = async (route: Route, method: Method, payload: Payload) => {
	try {
		// Make the request using axios and return the status and data from the response
		const { status, data } = await axios({
			data: payload ?? undefined,
			url: route,
			method
		});

		// Return the response status and data
		return { status, data };
	} catch (error) {
		// Handle errors specifically related to axios requests
		if (axios.isAxiosError(error)) {
			// If the error is from axios, return the status and data from the response (or default to 0 and empty object)
			return { status: error.response?.status || 0, data: error.response?.data || {} };
		}
		// For non-axios errors, return a status of 0 and null data
		return { status: 0, data: null };
	}
};
