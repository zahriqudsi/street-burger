/**
 * Street Burger Design System - Spacing
 */

export const Spacing = {
    // Base spacing values
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,

    // Screen padding
    screenPadding: 16,
    screenPaddingLarge: 24,

    // Component specific
    cardPadding: 16,
    cardMargin: 12,
    buttonPadding: 16,
    inputPadding: 12,

    // Border Radius
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        '2xl': 24,
        full: 9999,
    },

    // Shadows
    shadow: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 16,
        },
    },

    // Icon sizes
    iconSize: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
        '2xl': 40,
    },

    // Tab bar
    tabBarHeight: 60,

    // Header
    headerHeight: 56,
};

export default Spacing;
