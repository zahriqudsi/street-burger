/**
 * Street Burger - Authentication Context
 */

import * as SecureStore from 'expo-secure-store';
import React, { ReactNode, createContext, useContext, useEffect, useReducer } from 'react';
import api, { TOKEN_KEY, removeToken, setToken } from '../config/api';
import { ApiResponse, AuthAction, AuthResponse, AuthState, SignupRequest, User } from '../types';
import { registerForPushNotificationsAsync } from '../utils/notifications';

interface AuthContextType extends AuthState {
    signIn: (phoneNumber: string, password: string) => Promise<{ success: boolean; message: string }>;
    signUp: (data: SignupRequest) => Promise<{ success: boolean; message: string }>;
    signOut: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: action.token !== null,
                token: action.token,
                user: action.user,
            };
        case 'SIGN_IN':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                token: action.token,
                user: action.user,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                token: null,
                user: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.user,
            };
        default:
            return state;
    }
}

const initialState: AuthState = {
    isLoading: true,
    isAuthenticated: false,
    user: null,
    token: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        // Check for existing token on app load
        const bootstrapAsync = async () => {
            let token: string | null = null;
            let user: User | null = null;

            try {
                token = await SecureStore.getItemAsync(TOKEN_KEY);

                if (token) {
                    // Verify token by fetching user profile
                    try {
                        const response = await api.get<ApiResponse<User>>('/users/me');
                        if (response.data.success) {
                            user = response.data.data;
                        } else {
                            // Token invalid, clear it
                            await removeToken();
                            token = null;
                        }
                    } catch (error) {
                        // Token expired or invalid
                        await removeToken();
                        token = null;
                    }
                } else {
                    console.log('[AuthContext] No token found, starting as guest');
                }
            } catch (e) {
                console.log('Error restoring token:', e);
            }

            dispatch({ type: 'RESTORE_TOKEN', token, user });

            // Register for push notifications if authenticated
            if (token) {
                registerForPushNotificationsAsync();
            }
        };

        bootstrapAsync();
    }, []);

    const authContext: AuthContextType = {
        ...state,

        signIn: async (phoneNumber: string, password: string) => {
            try {
                const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
                    phoneNumber,
                    password,
                });

                if (response.data.success) {
                    const { token, id, name, role } = response.data.data;
                    await setToken(token);

                    const user: User = {
                        id: id || 0,
                        phoneNumber,
                        name: name || '',
                        role: role as 'USER' | 'ADMIN',
                    };

                    dispatch({ type: 'SIGN_IN', token, user });

                    // Register for push notifications
                    registerForPushNotificationsAsync();

                    return { success: true, message: 'Login successful' };
                } else {
                    return { success: false, message: response.data.message || 'Login failed' };
                }
            } catch (error: any) {
                console.error('Sign-in error:', error);
                let message = 'Login failed. Please try again.';

                if (error.response) {
                    message = error.response.data?.message || message;
                } else if (error.request) {
                    message = 'Unable to connect to the server. Please check your internet connection and ensure the backend is running.';
                }

                return { success: false, message };
            }
        },

        signUp: async (data: SignupRequest) => {
            try {
                const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);

                if (response.data.success) {
                    const { token, id, name, role } = response.data.data;
                    await setToken(token);

                    const user: User = {
                        id: id || 0,
                        phoneNumber: data.phoneNumber,
                        name: name || data.name || '',
                        email: data.email,
                        role: role as 'USER' | 'ADMIN',
                    };

                    dispatch({ type: 'SIGN_IN', token, user });
                    return { success: true, message: 'Account created successfully' };
                } else {
                    return { success: false, message: response.data.message || 'Signup failed' };
                }
            } catch (error: any) {
                console.error('Sign-up error:', error);
                let message = 'Signup failed. Please try again.';

                if (error.response) {
                    // The server responded with a status code that falls out of the range of 2xx
                    message = error.response.data?.message || message;
                } else if (error.request) {
                    // The request was made but no response was received
                    message = 'Unable to connect to the server. Please check your internet connection and ensure the backend is running.';
                }

                return { success: false, message };
            }
        },

        signOut: async () => {
            await removeToken();
            dispatch({ type: 'SIGN_OUT' });
        },

        updateUser: (user: User) => {
            dispatch({ type: 'UPDATE_USER', user });
        },
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
