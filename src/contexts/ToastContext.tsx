/**
 * Street Burger - Toast Notification Context
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { toastEmitter } from '../utils/toast-emitter';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
    message: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextData {
    showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-100)).current;
    const timerRef = useRef<any>(null);

    const hideToast = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setVisible(false));
    }, [fadeAnim, translateY]);

    const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
        // Clear existing timer
        if (timerRef.current) clearTimeout(timerRef.current);

        setMessage(message);
        setType(type);
        setVisible(true);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: Platform.OS === 'ios' ? 60 : 40,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();

        timerRef.current = setTimeout(hideToast, duration);
    }, [fadeAnim, translateY, hideToast]);

    // Listen to global toast events
    useEffect(() => {
        return toastEmitter.addListener((event) => {
            showToast(event);
        });
    }, [showToast]);

    const getIcon = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'warning';
            default: return 'information-circle';
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return Colors.success;
            case 'error': return Colors.error;
            case 'warning': return Colors.warning;
            default: return Colors.secondary;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.toastContainer,
                        {
                            backgroundColor: getBgColor(),
                            opacity: fadeAnim,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <Ionicons name={getIcon()} size={24} color="#FFF" />
                    <Text style={styles.toastText}>{message}</Text>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 9999,
        gap: 12,
    },
    toastText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
});
