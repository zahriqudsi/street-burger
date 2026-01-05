/**
 * Street Burger Design System - Typography
 */

import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
});

export const Typography = {
    // Font Families
    fontFamily: {
        regular: fontFamily,
        medium: fontFamily,
        bold: fontFamily,
        semiBold: fontFamily,
    },

    // Font Sizes
    fontSize: {
        xs: 10,
        sm: 12,
        base: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 32,
        '5xl': 40,
        '6xl': 48,
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Font Weights
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
        extraBold: '800' as const,
    },

    // Predefined Text Styles
    styles: {
        h1: {
            fontSize: 32,
            fontWeight: '700' as const,
            lineHeight: 40,
        },
        h2: {
            fontSize: 28,
            fontWeight: '700' as const,
            lineHeight: 36,
        },
        h3: {
            fontSize: 24,
            fontWeight: '600' as const,
            lineHeight: 32,
        },
        h4: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        h5: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 26,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        buttonSmall: {
            fontSize: 14,
            fontWeight: '600' as const,
            lineHeight: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '500' as const,
            lineHeight: 20,
        },
        price: {
            fontSize: 18,
            fontWeight: '700' as const,
            lineHeight: 24,
        },
    },
};

export default Typography;
