import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';

const getBaseURL = () => {
    // For SSR (Server-Side Rendering) inside Docker
    if (typeof window === 'undefined') {
        const internalUrl = process.env.INTERNAL_API_URL || 'http://backend:8000';
        return internalUrl.replace(/\/api$/, '') + '/api';
    }
    // For Client-side (Browser)
    const publicUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return publicUrl.replace(/\/api$/, '') + '/api';
};

const apiClient = axios.create({
    baseURL: getBaseURL(),
});

apiClient.interceptors.request.use((config) => {
    let token = useUserStore.getState().token;

    // Fallback if store is not yet hydrated
    if (!token && typeof window !== 'undefined') {
        const storage = localStorage.getItem('user-storage') || sessionStorage.getItem('user-storage');
        if (storage) {
            try {
                const parsed = JSON.parse(storage);
                token = parsed.state?.token;
            } catch (e) {
                // Ignore parse errors
            }
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useUserStore.getState().logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
