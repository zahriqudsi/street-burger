import React, { useRef } from 'react';
import {
    Animated,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
    Linking,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 56;

interface DraggableCallButtonProps {
    phoneNumber?: string;
}

export const DraggableCallButton: React.FC<DraggableCallButtonProps> = ({ phoneNumber }) => {
    // Initial position: Bottom Right
    const pan = useRef(new Animated.ValueXY({ x: width - BUTTON_SIZE - 24, y: height - 150 })).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only drag if moved more than a few pixels to allow press
                return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    // @ts-ignore
                    x: pan.x._value,
                    // @ts-ignore
                    y: pan.y._value,
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();

                // Optional: Constraint logic to keep it on screen
                // We can add snap-to-edge logic here later if requested
            },
        })
    ).current;

    const handlePress = () => {
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    return (
        <Animated.View
            style={[
                styles.draggableContainer,
                {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                },
            ]}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity
                style={styles.button}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Ionicons name="call" size={24} color="#FFF" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    draggableContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999, // Ensure it's on top
    },
    button: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: '#000', // Black premium look
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
});
