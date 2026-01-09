import { useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';

/**
 * Custom hook to get theme-aware colors.
 * Returns the appropriate color set (light or dark) based on the current system theme.
 */
export const useAppColors = () => {
    const colorScheme = useColorScheme() ?? 'light';

    // Merge shared brand colors with theme-specific colors
    const themeColors = Colors[colorScheme];

    return {
        ...Colors, // Includes primary, secondary, status colors, etc.
        ...themeColors, // Overrides with theme-specific values (background, text, etc.)
        mode: colorScheme,
    };
};

export type AppColors = ReturnType<typeof useAppColors>;
