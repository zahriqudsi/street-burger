/**
 * Street Burger - Root Layout
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/constants/colors';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { CartProvider } from '@/src/contexts/CartContext';
import { NotificationProvider } from '@/src/contexts/NotificationContext';
import { ToastProvider } from '@/src/contexts/ToastContext';

// Custom theme based on Street Burger brand
const StreetBurgerLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

const StreetBurgerDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? StreetBurgerDarkTheme : StreetBurgerLightTheme;

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <NotificationProvider>
            <ThemeProvider value={theme}>
              <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background }
              }}>
                <Stack.Screen name="index" options={{ gestureEnabled: false }} />
                <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="admin" />
                <Stack.Screen
                  name="profile"
                  options={{
                    headerShown: true,
                    title: 'Account Settings',
                    headerStyle: { backgroundColor: theme.colors.card },
                    headerTintColor: theme.colors.text,
                  }}
                />
                <Stack.Screen
                  name="inbox/index"
                  options={{
                    headerShown: true,
                    title: 'Notifications',
                    presentation: 'modal',
                    headerStyle: { backgroundColor: theme.colors.card },
                    headerTintColor: theme.colors.text,
                  }}
                />
              </Stack>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent />
            </ThemeProvider>
          </NotificationProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
