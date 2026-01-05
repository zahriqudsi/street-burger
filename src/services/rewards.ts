/**
 * Street Burger - Rewards API Service
 */

import api from '../config/api';
import { ApiResponse, RewardsResponse } from '../types';

export const rewardService = {
    // Get current user's reward points
    getMyRewards: async (): Promise<RewardsResponse> => {
        const response = await api.get<ApiResponse<RewardsResponse>>('/rwdpts/getrwdpts');
        return response.data.data;
    },

    // Get rewards by phone number
    getByPhone: async (phoneNumber: string): Promise<RewardsResponse> => {
        const response = await api.get<ApiResponse<RewardsResponse>>(`/rwdpts/getrwdpts/${phoneNumber}`);
        return response.data.data;
    },

    // ADMIN: Add reward points
    addPoints: async (data: { phoneNumber: string; points: number; description: string; transactionType?: string }): Promise<any> => {
        const response = await api.post<ApiResponse<any>>('/rwdpts/addrwdpts', data);
        return response.data.data;
    },
};

export default rewardService;
