import axios from 'axios';

// Creates a reusable network instance using your .env configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout ideal for local hardware/printers
});

export default api;
