// Branding and Semantics
export const Colors = {
    // Brand Colors (Shared across themes)
    primary: '#FF6B35',       // Vibrant Orange
    primaryDark: '#E55A2B',   // Darker Orange
    primaryLight: '#FF8C5A',  // Lighter Orange
    secondary: '#2D3748',     // Slate Blue-Gray
    secondaryLight: '#4A5568',
    accent: '#38A169',        // Green (Success)
    warning: '#D69E2E',       // Yellow (Warning)
    error: '#E53E3E',         // Red (Error)

    // Neutral Colors - Light Mode
    light: {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        surfaceSecondary: '#F7FAFC',
        text: '#1A202C',
        textSecondary: '#718096',
        textTertiary: '#A0AEC0',
        border: '#E2E8F0',
        divider: '#EDF2F7',
        icon: '#4A5568',
        iconSecondary: '#718096',
        tabBarBackground: '#FFFFFF',
        tabBarInactive: '#A0AEC0',
        tint: '#FF6B35',
        cardShadow: '#000000',

        // Semantic Mappings (Matching old structure for easier transition)
        white: '#FFFFFF',
        bgLight: '#F8F9FA',
        textMain: '#1A202C',
        textMuted: '#718096',
        borderSemantic: '#E2E8F0',
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
        cardShadow: '#000000',

        // Semantic Mappings (Matching old structure)
        white: '#1E1E1E',
        bgLight: '#121212',
        textMain: '#FFFFFF',
        textMuted: '#B0B0B0',
        borderSemantic: '#404040',
    },

    // Shared Status Colors
    success: '#38A169',
    successLight: '#C6F6D5',
    info: '#3182CE',
    infoLight: '#EBF8FF',
    warningLight: '#FFFAF0',
    errorLight: '#FFF5F5',

    // Rating Stars
    starFilled: '#ECC94B',
    starEmpty: '#E2E8F0',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Gradients
    gradientPrimary: ['#FF6B35', '#FF8C5A'],
    gradientDark: ['#2D3748', '#4A5568'],
    gradientSunset: ['#FF6B35', '#D69E2E'],

    // Legacy support (to avoid immediate breakage)
    white: '#FFFFFF',
    bgLight: '#F8F9FA',
    textMain: '#1A202C',
    textMuted: '#718096',
    border: '#E2E8F0',
    cardShadow: '#000000',
    surface: '#FFFFFF',
};

export default Colors;
