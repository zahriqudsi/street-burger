/**
 * Street Burger - Menu API Service
 */

import api from '../config/api';
import { ApiResponse, MenuCategory, MenuItem } from '../types';

export const menuService = {
    // Get all categories
    getCategories: async (): Promise<MenuCategory[]> => {
        const response = await api.get<ApiResponse<MenuCategory[]>>('/menu/categories');
        return response.data.data;
    },

    // Get all menu items
    getAllItems: async (): Promise<MenuItem[]> => {
        const response = await api.get<ApiResponse<MenuItem[]>>('/menu/items');
        return response.data.data;
    },

    // Get items by category
    getItemsByCategory: async (categoryId: number): Promise<MenuItem[]> => {
        const response = await api.get<ApiResponse<MenuItem[]>>(`/menu/items/${categoryId}`);
        return response.data.data;
    },

    // Get popular items
    getPopularItems: async (): Promise<MenuItem[]> => {
        const response = await api.get<ApiResponse<MenuItem[]>>('/menu/items/popular');
        return response.data.data;
    },

    // ADMIN: Categories
    addCategory: async (category: Partial<MenuCategory>): Promise<MenuCategory> => {
        const response = await api.post<ApiResponse<MenuCategory>>('/menu/categories', category);
        return response.data.data;
    },

    updateCategory: async (id: number, category: Partial<MenuCategory>): Promise<MenuCategory> => {
        const response = await api.post<ApiResponse<MenuCategory>>(`/menu/categories/${id}`, category);
        return response.data.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await api.post(`/menu/categories/delete/${id}`);
    },

    // ADMIN: Menu Items
    addItem: async (item: Partial<MenuItem>): Promise<MenuItem> => {
        const response = await api.post<ApiResponse<MenuItem>>('/menu/items', item);
        return response.data.data;
    },

    updateItem: async (id: number, item: Partial<MenuItem>): Promise<MenuItem> => {
        const response = await api.post<ApiResponse<MenuItem>>(`/menu/items/${id}`, item);
        return response.data.data;
    },

    deleteItem: async (id: number): Promise<void> => {
        await api.post(`/menu/items/delete/${id}`);
    },
};

export default menuService;
