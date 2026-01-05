/**
 * Street Burger - Restaurant API Service
 */

import api from '../config/api';
import { ApiResponse, Chef, GalleryImage, RestaurantInfo } from '../types';

export const restaurantService = {
    // Get restaurant info
    getInfo: async (): Promise<RestaurantInfo | null> => {
        const response = await api.get<ApiResponse<RestaurantInfo[]>>('/restaurant-info/get/all');
        return response.data.data.length > 0 ? response.data.data[0] : null;
    },

    // Get gallery images
    getGallery: async (): Promise<GalleryImage[]> => {
        const response = await api.get<ApiResponse<GalleryImage[]>>('/gallery');
        return response.data.data;
    },

    // Get chefs
    getChefs: async (): Promise<Chef[]> => {
        const response = await api.get<ApiResponse<Chef[]>>('/chefs');
        return response.data.data;
    },
};

export default restaurantService;
