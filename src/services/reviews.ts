import api from '../config/api';

export interface Review {
    id: number;
    reviewerName: string;
    phoneNumber: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    user?: {
        id: number;
        name: string;
    };
}

export interface ReviewRequest {
    reviewerName?: string;
    rating: number;
    comment: string;
}

export const reviewService = {
    getAll: async () => {
        const response = await api.get('/reviews');
        return response.data;
    },

    getLatest: async () => {
        const response = await api.get('/reviews/latest');
        return response.data;
    },

    add: async (phoneNumber: string, data: ReviewRequest) => {
        const response = await api.post(`/reviews/add/${phoneNumber}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};
