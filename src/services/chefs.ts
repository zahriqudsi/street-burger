/**
 * Street Burger - Chefs API Service
 */

import api from '../config/api';
import { ApiResponse, Chef } from '../types';

export const chefService = {
    // Get all chefs
    getAll: async (): Promise<Chef[]> => {
        const response = await api.get<ApiResponse<Chef[]>>('/chefs');
        return response.data.data;
    },

    // ADMIN: Add chef
    add: async (chef: Partial<Chef>): Promise<Chef> => {
        const response = await api.post<ApiResponse<Chef>>('/chefs', chef);
        return response.data.data;
    },

    // ADMIN: Delete chef
    delete: async (id: number): Promise<void> => {
        await api.post(`/chefs/${id}`);
    },
};

export default chefService;
