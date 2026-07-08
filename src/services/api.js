import axios from 'axios';

const api = axios.create({
    baseURL: 'https://palladiumacaiapi.runasp.net',
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout ideal for local hardware/printers
});

export default api;
