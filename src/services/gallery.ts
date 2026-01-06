/**
 * Street Burger - Gallery API Service
 */

import api from '../config/api';
import { ApiResponse, GalleryImage } from '../types';

export const galleryService = {
    // Get all gallery images
    getAll: async (): Promise<GalleryImage[]> => {
        const response = await api.get<ApiResponse<GalleryImage[]>>('/gallery');
        return response.data.data;
    },

    // ADMIN: Add gallery image
    add: async (image: Partial<GalleryImage>): Promise<GalleryImage> => {
        const response = await api.post<ApiResponse<GalleryImage>>('/gallery', image);
        return response.data.data;
    },

    // ADMIN: Delete gallery image
    delete: async (id: number): Promise<void> => {
        await api.delete(`/gallery/${id}`);
    },
};

export default galleryService;
