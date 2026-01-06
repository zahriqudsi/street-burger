import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/colors';

interface BackButtonProps {
    onPress?: () => void;
    color?: string;
    light?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, color, light = false }) => {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    const iconColor = color || (light ? '#FFF' : '#2D3748');
    const bgColor = light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)';

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.container}
            activeOpacity={0.7}
        >
            {Platform.OS === 'ios' ? (
                <BlurView intensity={30} tint={light ? "dark" : "light"} style={styles.blurContainer}>
                    <Ionicons name="chevron-back" size={24} color={iconColor} />
                </BlurView>
            ) : (
                <View style={[styles.androidContainer, { backgroundColor: bgColor }]}>
                    <Ionicons name="chevron-back" size={24} color={iconColor} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    blurContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    androidContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
});

export default BackButton;
