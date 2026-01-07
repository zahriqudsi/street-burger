import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonProps {
    onPress?: () => void;
    color?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, color }) => {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.container}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="chevron-back" size={28} color={color || "#FFF"} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 0,
        // No background, no border, just padding for touch area if needed
        padding: 4,
    }
});

export default BackButton;