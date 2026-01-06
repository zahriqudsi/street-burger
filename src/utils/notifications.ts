import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { userService } from '../services';

// Configure how notifications should be handled when the app is open
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token specifically for Expo
        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ??
                Constants?.easConfig?.projectId;

            if (!projectId) {
                console.warn('[Push] No projectId found in app.config.js or app.json. Push notifications will not be active.');
                console.warn('[Push] To fix this, run: npx eas project:init');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({
                projectId,
            })).data;
            console.log('[Push] Token:', token);

            // Save token to backend
            await userService.updatePushToken(token);
        } catch (e: any) {
            if (e.message?.includes('EXPERIENCE_NOT_FOUND')) {
                console.warn('[Push] The projectId in your app.json is invalid or not linked to your Expo account.');
                console.warn('[Push] Please run "npx eas project:init" to create a valid project.');
            } else {
                console.error('Error getting push token:', e);
            }
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}
