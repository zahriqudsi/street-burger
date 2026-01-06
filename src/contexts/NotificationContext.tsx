/**
 * Street Burger - Notification Context
 * Handles unread notification counts and polling
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';
import { useRef } from 'react';

interface NotificationContextType {
    unreadCount: number;
    refreshCount: () => Promise<void>;
    markRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();
    const notificationListener = useRef<Notifications.Subscription>(null!);
    const responseListener = useRef<Notifications.Subscription>(null!);

    const refreshCount = useCallback(async () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return;
        }
        try {
            const notifications = await notificationService.getForUser();
            const unread = notifications.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.log('[NotificationContext] Error fetching unread count:', error);
        }
    }, [isAuthenticated]);

    const markRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.log('[NotificationContext] Error marking as read:', error);
        }
    };

    // Initial fetch and polling
    useEffect(() => {
        refreshCount();

        if (isAuthenticated) {
            // Listen for incoming notifications in foreground
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log('[NotificationContext] Foreground notification received:', notification);
                refreshCount(); // Refresh count immediately
            });

            // Listen for user interaction with notification
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('[NotificationContext] Notification response received:', response);
            });

            const interval = setInterval(refreshCount, 30000); // Fallback polling

            return () => {
                notificationListener.current?.remove();
                responseListener.current?.remove();
                clearInterval(interval);
            };
        }
    }, [isAuthenticated, refreshCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshCount, markRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
