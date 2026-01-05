/**
 * Street Burger - Reservations API Service
 */

import api from '../config/api';
import { ApiResponse, Reservation, ReservationRequest } from '../types';

export const reservationService = {
    // Create a new reservation
    create: async (data: ReservationRequest): Promise<Reservation> => {
        const response = await api.post<ApiResponse<Reservation>>('/reservations/add', data);
        return response.data.data;
    },

    // Update a reservation
    update: async (id: number, data: Partial<ReservationRequest>): Promise<Reservation> => {
        const response = await api.put<ApiResponse<Reservation>>(`/reservations/update/${id}`, data);
        return response.data.data;
    },

    // Get reservations by phone number
    getByPhone: async (phoneNumber: string): Promise<Reservation[]> => {
        const response = await api.get<ApiResponse<Reservation[]>>(`/reservations/getByPhone/${phoneNumber}`);
        return response.data.data;
    },

    // Get reservation by ID
    getById: async (id: number): Promise<Reservation> => {
        const response = await api.get<ApiResponse<Reservation>>(`/reservations/getById/${id}`);
        return response.data.data;
    },

    // Cancel/Delete a reservation
    cancel: async (id: number): Promise<void> => {
        await api.delete(`/reservations/delete/${id}`);
    },

    // Get all reservations (admin)
    getAll: async (): Promise<Reservation[]> => {
        const response = await api.get<ApiResponse<Reservation[]>>('/reservations/getAll');
        return response.data.data;
    },

    // ADMIN: Confirm a reservation
    confirm: async (id: number): Promise<Reservation> => {
        const response = await api.put<ApiResponse<Reservation>>(`/reservations/confirm/${id}`, {});
        return response.data.data;
    },
};

export default reservationService;
