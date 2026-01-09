import api from '@/src/config/api';
import { MenuItem, Order, OrderStatus } from '@/src/types';

export const orderService = {
    create: async (data: {
        items: { menuItemId: number; quantity: number }[];
        orderType: 'DELIVERY' | 'PICKUP' | 'DINE_IN';
        deliveryAddress?: string;
        phoneNumber: string;
        notes?: string;
    }): Promise<Order> => {
        const response = await api.post<{ success: boolean; data: Order }>('/orders/add', data);
        return response.data.data;
    },

    getMyOrders: async (): Promise<Order[]> => {
        const response = await api.get<{ success: boolean; data: Order[] }>('/orders/mine');
        return response.data.data;
    },

    getAll: async (): Promise<Order[]> => {
        const response = await api.get<{ success: boolean; data: Order[] }>('/orders/all');
        return response.data.data;
    },

    updateStatus: async (id: number, status: OrderStatus): Promise<Order> => {
        const response = await api.post<{ success: boolean; data: Order }>(`/orders/update-status/${id}`, null, {
            params: { status }
        });
        return response.data.data;
    },
};
