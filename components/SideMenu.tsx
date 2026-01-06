/**
 * Street Burger - Premium Side Menu Component
 * Features: Reanimated transitions, Blur background, Glassmorphism, Swipe-to-close
 */

import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { Colors } from '@/src/constants/colors';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/src/contexts/NotificationContext';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

interface SideMenuProps {
    isVisible: boolean;
    onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isVisible, onClose }) => {
    const { isAuthenticated, user, signOut } = useAuth();
    const { unreadCount } = useNotifications();
    const router = useRouter();

    // Internal state to handle delayed unmounting
    const [renderMenu, setRenderMenu] = React.useState(isVisible);

    // Animation shared values
    const translateX = useSharedValue(-MENU_WIDTH);
    const backdropOpacity = useSharedValue(0);

    // Sync visibility and trigger transitions
    useEffect(() => {
        if (isVisible) {
            setRenderMenu(true);
            translateX.value = withSpring(0, {
                damping: 25,
                stiffness: 120,
                mass: 0.8
            });
            backdropOpacity.value = withTiming(1, { duration: 400 });
        } else {
            // Initiate exit animation
            translateX.value = withTiming(-MENU_WIDTH, { duration: 300 }, (finished) => {
                if (finished) {
                    runOnJS(setRenderMenu)(false);
                }
            });
            backdropOpacity.value = withTiming(0, { duration: 300 });
        }
    }, [isVisible]);

    const closeMenu = () => {
        translateX.value = withTiming(-MENU_WIDTH, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(setRenderMenu)(false);
                runOnJS(onClose)();
            }
        });
        backdropOpacity.value = withTiming(0, { duration: 300 });
    };

    const onPanGesture = (event: any) => {
        const { translationX } = event.nativeEvent;
        // Only allow swiping to the left (closing)
        if (translationX <= 0) {
            translateX.value = translationX;
        }
    };

    const onPanEnd = (event: any) => {
        const { translationX, velocityX } = event.nativeEvent;
        // Sensitivity for closing
        if (translationX < -MENU_WIDTH / 4 || velocityX < -500) {
            closeMenu();
        } else {
            translateX.value = withSpring(0, { damping: 20, stiffness: 100 });
        }
    };

    const animatedMenuStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const animatedBackdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const handleNavigation = (path: string) => {
        translateX.value = withTiming(-MENU_WIDTH, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(setRenderMenu)(false);
                runOnJS(onClose)();
                runOnJS(router.push)(path as any);
            }
        });
        backdropOpacity.value = withTiming(0, { duration: 250 });
    };

    const handleLogout = () => {
        translateX.value = withTiming(-MENU_WIDTH, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(setRenderMenu)(false);
                runOnJS(onClose)();
                runOnJS(signOut)();
            }
        });
        backdropOpacity.value = withTiming(0, { duration: 250 });
    };

    const menuItems = [
        { id: 'home', label: 'Home', icon: 'home-outline', path: '/(tabs)/' },
        { id: 'menu', label: 'Our Menu', icon: 'fast-food-outline', path: '/(tabs)/menu' },
        { id: 'inbox', label: 'Inbox', icon: 'mail-outline', path: '/inbox', badge: unreadCount },
        { id: 'chefs', label: 'Our Chefs', icon: 'restaurant-outline', path: '/chefs' },
        { id: 'gallery', label: 'Gallery', icon: 'images-outline', path: '/gallery' },
        { id: 'reviews', label: 'Reviews', icon: 'star-outline', path: '/reviews' },
        { id: 'about', label: 'About Us', icon: 'information-circle-outline', path: '/about' },
        { id: 'location', label: 'Location', icon: 'location-outline', path: '/location' },
        { id: 'contact', label: 'Contact Us', icon: 'call-outline', path: '/contact' },
    ].filter(item => {
        if (user?.role === 'ADMIN') {
            return ['home', 'inbox'].includes(item.id);
        }
        return true;
    });

    if (!renderMenu) return null;

    return (
        <GestureHandlerRootView style={styles.root}>
            <View style={StyleSheet.absoluteFill}>
                {/* Backdrop */}
                <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

                {/* Main Menu with Pan Gesture */}
                <PanGestureHandler
                    onGestureEvent={onPanGesture}
                    onHandlerStateChange={(e) => e.nativeEvent.state === State.END && onPanEnd(e)}
                >
                    <Animated.View style={[styles.menuContainer, animatedMenuStyle]}>
                        <SafeAreaView style={styles.safeArea}>
                            {/* Header Section */}
                            <View style={styles.header}>
                                <View style={styles.profileSection}>
                                    <View style={styles.avatarGradient}>
                                        <Text style={styles.avatarText}>
                                            {isAuthenticated && user ? user.name[0].toUpperCase() : 'G'}
                                        </Text>
                                    </View>
                                    <View style={styles.userTextContainer}>
                                        <Text style={styles.userName} numberOfLines={1}>
                                            {isAuthenticated && user ? user.name : 'Welcome Guest'}
                                        </Text>
                                        <Text style={styles.userSubtitle}>
                                            {isAuthenticated ? 'Premium Member' : 'Explore our delicious menu'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
                                    <Ionicons name="chevron-back" size={24} color="#2D3748" />
                                </TouchableOpacity>
                            </View>

                            {/* Menu Scrollable Content */}
                            <ScrollView
                                style={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollInner}
                            >
                                <Text style={styles.sectionLabel}>Discover</Text>
                                {menuItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.menuLink}
                                        onPress={() => handleNavigation(item.path)}
                                    >
                                        <View style={styles.iconContainer}>
                                            <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
                                        </View>
                                        <Text style={styles.linkText}>{item.label}</Text>
                                        {(item.badge ?? 0) > 0 && (
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>{item.badge}</Text>
                                            </View>
                                        )}
                                        <Ionicons name="chevron-forward" size={14} color="#CBD5E0" />
                                    </TouchableOpacity>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <View style={styles.divider} />
                                        <Text style={styles.sectionLabel}>My Profile</Text>
                                        <TouchableOpacity
                                            style={styles.menuLink}
                                            onPress={() => handleNavigation('/profile')}
                                        >
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="person-outline" size={22} color={Colors.primary} />
                                            </View>
                                            <Text style={styles.linkText}>Account Settings</Text>
                                            <Ionicons name="chevron-forward" size={14} color="#CBD5E0" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.menuLink}
                                            onPress={handleLogout}
                                        >
                                            <View style={[styles.iconContainer, { backgroundColor: '#FF475715' }]}>
                                                <Ionicons name="log-out-outline" size={22} color="#FF4757" />
                                            </View>
                                            <Text style={[styles.linkText, { color: '#FF4757' }]}>Logout</Text>
                                            <Ionicons name="chevron-forward" size={14} color="#CBD5E0" />
                                        </TouchableOpacity>
                                    </>
                                )}

                                {!isAuthenticated && (
                                    <TouchableOpacity
                                        style={styles.loginBanner}
                                        onPress={() => handleNavigation('/(auth)/login')}
                                    >
                                        <Ionicons name="log-in-outline" size={20} color="#FFF" />
                                        <Text style={styles.loginBannerText}>Login for special offers</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>

                            {/* Footer Section */}
                            <View style={styles.footer}>
                                <View style={styles.socials}>
                                    <Ionicons name="logo-facebook" size={20} color="#A0AEC0" style={styles.socialIcon} />
                                    <Ionicons name="logo-instagram" size={20} color="#A0AEC0" style={styles.socialIcon} />
                                    <Ionicons name="logo-whatsapp" size={20} color="#A0AEC0" />
                                </View>
                                <Text style={styles.footerText}>v1.0.6 • Smooth Glide Edition</Text>
                            </View>
                        </SafeAreaView>
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F7FAFC',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A202C',
        marginBottom: 2,
    },
    userSubtitle: {
        fontSize: 12,
        color: '#718096',
    },
    closeBtn: {
        padding: 8,
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
    },
    scrollContent: {
        flex: 1,
    },
    scrollInner: {
        padding: 20,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#A0AEC0',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
        marginTop: 8,
    },
    menuLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 4,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: Colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    linkText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#2D3748',
    },
    badge: {
        backgroundColor: '#FF4757',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginRight: 10,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#EDF2F7',
        marginVertical: 20,
    },
    loginBanner: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    loginBannerText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F7FAFC',
    },
    socials: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    socialIcon: {
        marginRight: 20,
    },
    footerText: {
        fontSize: 11,
        color: '#A0AEC0',
        fontWeight: '500',
    },
});
