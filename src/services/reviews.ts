/**
 * Street Burger - Reviews API Service
 */

import api from '../config/api';
import { ApiResponse, Review, ReviewRequest } from '../types';

export const reviewService = {
    // Get all approved reviews
    getAll: async (): Promise<Review[]> => {
        const response = await api.get<ApiResponse<Review[]>>('/reviews');
        return response.data.data;
    },

    // Get latest reviews
    getLatest: async (): Promise<Review[]> => {
        const response = await api.get<ApiResponse<Review[]>>('/reviews/latest');
        return response.data.data;
    },

    // Add a new review
    add: async (phoneNumber: string, data: ReviewRequest): Promise<Review> => {
        const response = await api.post<ApiResponse<Review>>(`/reviews/add/${phoneNumber}`, data);
        return response.data.data;
    },

    // Update a review
    update: async (id: number, data: Partial<ReviewRequest>): Promise<Review> => {
        const response = await api.put<ApiResponse<Review>>(`/reviews/${id}`, data);
        return response.data.data;
    },

    // Delete a review
    delete: async (id: number): Promise<void> => {
        await api.delete(`/reviews/${id}`);
    },

    // Get reviews by user
    getByUser: async (phoneNumber: string): Promise<Review[]> => {
        const response = await api.get<ApiResponse<Review[]>>(`/reviews/user/${phoneNumber}`);
        return response.data.data;
    },
};

export default reviewService;
