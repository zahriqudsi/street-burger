import api from '../config/api';

export interface RestaurantInfo {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    openingHours: string;
    aboutUs: string;
    latitude: number;
    longitude: number;
    facebookUrl: string;
    instagramUrl: string;
    uberEatsUrl: string;
    pickmeFoodUrl: string;
}

export const restaurantService = {
    getAll: async () => {
        const response = await api.get('/restaurant-info/get/all');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/restaurant-info/get/${id}`);
        return response.data;
    },

    update: async (id: number, data: Partial<RestaurantInfo>) => {
        const response = await api.put(`/restaurant-info/update/${id}`, data);
        return response.data;
    },

    getInfo: async () => {
        const response = await api.get('/restaurant-info/get/all');
        return response.data.data[0];
    }
};
