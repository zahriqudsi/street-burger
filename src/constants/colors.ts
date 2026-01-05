/**
 * Street Burger Design System - Colors
 */

export const Colors = {
    // Brand Colors
    primary: '#FF6B35',       // Vibrant Orange
    primaryDark: '#E55A2B',   // Darker Orange
    primaryLight: '#FF8C5A',  // Lighter Orange

    // Secondary Colors
    secondary: '#2C3E50',     // Deep Blue-Gray
    secondaryLight: '#34495E',

    // Accent Colors
    accent: '#27AE60',        // Green for success
    warning: '#F39C12',       // Yellow/Orange for warnings
    error: '#E74C3C',         // Red for errors

    // Neutral Colors - Light Mode
    light: {
        background: '#FFFFFF',
        surface: '#F8F9FA',
        surfaceSecondary: '#F1F3F5',
        text: '#1A1A1A',
        textSecondary: '#6C757D',
        textTertiary: '#ADB5BD',
        border: '#DEE2E6',
        divider: '#E9ECEF',
        icon: '#495057',
        iconSecondary: '#868E96',
        tabBarBackground: '#FFFFFF',
        tabBarInactive: '#ADB5BD',
        tint: '#FF6B35',
    },

    // Neutral Colors - Dark Mode
    dark: {
        background: '#121212',
        surface: '#1E1E1E',
        surfaceSecondary: '#2C2C2C',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        textTertiary: '#707070',
        border: '#404040',
        divider: '#2C2C2C',
        icon: '#E0E0E0',
        iconSecondary: '#909090',
        tabBarBackground: '#1E1E1E',
        tabBarInactive: '#707070',
        tint: '#FF8C5A',
    },

    // Status Colors
    success: '#27AE60',
    successLight: '#D4EDDA',
    info: '#3498DB',
    infoLight: '#D1ECF1',
    warningLight: '#FFF3CD',
    errorLight: '#F8D7DA',

    // Rating Stars
    starFilled: '#FFD700',
    starEmpty: '#E0E0E0',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Gradients (as arrays for LinearGradient)
    gradientPrimary: ['#FF6B35', '#FF8C5A'],
    gradientDark: ['#2C3E50', '#34495E'],
    gradientSunset: ['#FF6B35', '#F39C12'],
};

export default Colors;
