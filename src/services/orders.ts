/**
 * Street Burger - Orders API Service
 */

import api from '../config/api';
import { ApiResponse } from '../types';

export interface OrderItem {
    id: number;
    menuItem: any;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    customerName: string;
    phoneNumber: string;
    totalPrice: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export const orderService = {
    // Place a new order
    placeOrder: async (orderData: any): Promise<Order> => {
        const response = await api.post<ApiResponse<Order>>('/orders/add', orderData);
        return response.data.data;
    },

    // Get current user's orders
    getMyOrders: async (): Promise<Order[]> => {
        const response = await api.get<ApiResponse<Order[]>>('/orders/my');
        return response.data.data;
    },

    // ADMIN: Get all orders
    getAllOrders: async (): Promise<Order[]> => {
        const response = await api.get<ApiResponse<Order[]>>('/orders/all');
        return response.data.data;
    },

    // ADMIN: Update order status
    updateStatus: async (id: number, status: string): Promise<Order> => {
        const response = await api.put<ApiResponse<Order>>(`/orders/updateStatus/${id}?status=${status}`, {});
        return response.data.data;
    },

    // ADMIN: Delete order
    deleteOrder: async (id: number): Promise<void> => {
        await api.delete(`/orders/${id}`);
    },
};

export default orderService;
