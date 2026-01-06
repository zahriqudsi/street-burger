/**
 * Street Burger - Users API Service
 */

import api from '../config/api';
import { ApiResponse, User } from '../types';

export const userService = {
    // Get current user profile
    getMe: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>('/users/me');
        return response.data.data;
    },

    // ADMIN: Get all users
    getAll: async (): Promise<User[]> => {
        const response = await api.get<ApiResponse<User[]>>('/users/allUsers');
        return response.data.data;
    },

    // Update user profile
    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.put<ApiResponse<User>>('/users/update', data);
        return response.data.data;
    },

    // Update push notification token
    updatePushToken: async (pushToken: string): Promise<void> => {
        await api.post('/users/update-push-token', pushToken, {
            headers: { 'Content-Type': 'application/json' }
        });
    },
};

export default userService;
