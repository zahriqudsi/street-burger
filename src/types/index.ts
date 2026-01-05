/**
 * Street Burger - TypeScript Type Definitions
 */

// User Types
export interface User {
    id: number;
    phoneNumber: string;
    name: string;
    email?: string;
    emailVerified?: boolean;
    dateOfBirth?: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    token: string;
    phoneNumber: string;
    name: string;
    role: string;
    message?: string;
}

export interface LoginRequest {
    phoneNumber: string;
    password: string;
}

export interface SignupRequest {
    phoneNumber: string;
    password: string;
    name?: string;
    email?: string;
    dateOfBirth?: string;
}

// Menu Types
export interface MenuCategory {
    id: number;
    name: string;
    nameSi?: string;
    nameTa?: string;
    displayOrder?: number;
    imageUrl?: string;
}

export interface MenuItem {
    id: number;
    category?: MenuCategory;
    title: string;
    titleSi?: string;
    titleTa?: string;
    description?: string;
    descriptionSi?: string;
    descriptionTa?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
    isPopular?: boolean;
    displayOrder?: number;
}

// Reservation Types
export interface Reservation {
    id: number;
    userId?: number;
    phoneNumber: string;
    guestName?: string;
    guestCount: number;
    reservationDate: string;
    reservationTime: string;
    specialRequests?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    createdAt: string;
    updatedAt?: string;
}

export interface ReservationRequest {
    phoneNumber?: string;
    guestName?: string;
    guestCount: number;
    reservationDate: string;
    reservationTime: string;
    specialRequests?: string;
}

// Review Types
export interface Review {
    id: number;
    userId?: number;
    phoneNumber?: string;
    reviewerName?: string;
    rating: number;
    comment?: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface ReviewRequest {
    rating: number;
    comment?: string;
    reviewerName?: string;
}

// Reward Types
export interface RewardPoints {
    id: number;
    userId: number;
    points: number;
    description?: string;
    transactionType: 'EARNED' | 'REDEEMED' | 'BONUS' | 'ADMIN_ADD';
    createdAt: string;
}

export interface RewardsResponse {
    totalPoints: number;
    history: RewardPoints[];
}

// Notification Types
export interface Notification {
    id: number;
    title: string;
    message: string;
    targetUserId?: number;
    isGlobal: boolean;
    notificationType: 'PROMOTION' | 'REWARD' | 'SYSTEM' | 'RESERVATION' | 'GENERAL';
    imageUrl?: string;
    isRead: boolean;
    createdAt: string;
}

// Restaurant Info Types
export interface RestaurantInfo {
    id: number;
    name: string;
    address: string;
    phone: string;
    email?: string;
    openingHours?: string;
    aboutUs?: string;
    latitude?: number;
    longitude?: number;
    facebookUrl?: string;
    instagramUrl?: string;
    uberEatsUrl?: string;
    pickmeFoodUrl?: string;
}

// Gallery Types
export interface GalleryImage {
    id: number;
    imageUrl: string;
    caption?: string;
    displayOrder?: number;
}

// Chef Types
export interface Chef {
    id: number;
    name: string;
    title?: string;
    bio?: string;
    imageUrl?: string;
    displayOrder?: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Auth Context Types
export interface AuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

export type AuthAction =
    | { type: 'RESTORE_TOKEN'; token: string | null; user: User | null }
    | { type: 'SIGN_IN'; token: string; user: User }
    | { type: 'SIGN_OUT' }
    | { type: 'UPDATE_USER'; user: User };
