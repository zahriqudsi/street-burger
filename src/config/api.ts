/**
 * Street Burger API Configuration
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

// API Base URL - Change this to your backend URL
// export const API_BASE_URL = 'http://localhost:8080';
export const API_BASE_URL = 'http://192.168.92.121:8080';

// Token storage key
export const TOKEN_KEY = 'street_burger_jwt_token';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log(`[API] Request: ${config.method?.toUpperCase()} ${config.url}`);
            if (token) {
                if (config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log(`[API] Attaching token: ${token.substring(0, 10)}...`);
                }
            } else {
                console.log('[API] No token found in SecureStore');
            }
        } catch (error) {
            console.log('Error getting token from secure store:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear token
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            // You can dispatch a logout action here if using global state
        }
        return Promise.reject(error);
    }
);

// Helper functions for token management
export const setToken = async (token: string): Promise<void> => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export default api;
