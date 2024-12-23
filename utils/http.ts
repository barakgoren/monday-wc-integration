import axios, { AxiosInstance } from 'axios';

const http: AxiosInstance = axios.create({
    baseURL: 'https://api.monday.com/v2', // Replace with your API base URL
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

http.interceptors.request.use((config) => {
    // Check for an existing token in local storage
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

const apiClient = {
    get(endpoint: string, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'GET', null, params);
    },
    post(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'POST', data, params);
    },
    put(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'PUT', data, params);
    },
    delete(endpoint: string, data: unknown = null, params: Record<string, unknown> = {}) {
        return ajax(endpoint, 'DELETE', data, params);
    },
};

async function ajax(endpoint: string, method = 'GET', data: unknown = null, params: Record<string, unknown> = {}) {
    try {
        const res = await http({
            url: endpoint,
            method,
            data,
            params,
        });
        return res.data;
    } catch (error) {
        console.error('Error in ajax request:', error);
        throw error;
    }
}

export default apiClient;