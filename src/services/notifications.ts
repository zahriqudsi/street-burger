/**
 * Street Burger - Notifications API Service
 */

import api from '../config/api';
import { ApiResponse, Notification } from '../types';

export const notificationService = {
    // Get all notifications for current user
    getForUser: async (): Promise<Notification[]> => {
        const response = await api.get<ApiResponse<Notification[]>>('/notification/user');
        return response.data.data;
    },

    // Get all notifications
    getAll: async (): Promise<Notification[]> => {
        const response = await api.get<ApiResponse<Notification[]>>('/notification/get/all');
        return response.data.data;
    },

    // Get notification by ID
    getById: async (id: number): Promise<Notification> => {
        const response = await api.get<ApiResponse<Notification>>(`/notification/getById/${id}`);
        return response.data.data;
    },

    // Mark notification as read
    markAsRead: async (id: number): Promise<Notification> => {
        const response = await api.put<ApiResponse<Notification>>(`/notification/markRead/${id}`);
        return response.data.data;
    },

    // ADMIN: Create notification
    create: async (notification: Partial<Notification>): Promise<Notification> => {
        const response = await api.post<ApiResponse<Notification>>('/notification/add', notification);
        return response.data.data;
    },

    // ADMIN: Update notification
    update: async (id: number, notification: Partial<Notification>): Promise<Notification> => {
        const response = await api.put<ApiResponse<Notification>>(`/notification/updateById/${id}`, notification);
        return response.data.data;
    },

    // ADMIN: Delete notification
    delete: async (id: number): Promise<void> => {
        await api.delete(`/notification/deleteById/${id}`);
    },
};

export default notificationService;
