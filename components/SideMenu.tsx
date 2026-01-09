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
import { useAppColors } from '@/src/hooks/useAppColors';

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
    const colors = useAppColors();

    const [renderMenu, setRenderMenu] = React.useState(isVisible);
    const translateX = useSharedValue(-MENU_WIDTH);
    const backdropOpacity = useSharedValue(0);

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
        if (translationX <= 0) {
            translateX.value = translationX;
        }
    };

    const onPanEnd = (event: any) => {
        const { translationX, velocityX } = event.nativeEvent;
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
                <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu}>
                        <BlurView intensity={20} tint={colors.mode === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

                <PanGestureHandler
                    onGestureEvent={onPanGesture}
                    onHandlerStateChange={(e) => e.nativeEvent.state === State.END && onPanEnd(e)}
                >
                    <Animated.View style={[styles.menuContainer, animatedMenuStyle, { backgroundColor: colors.surface }]}>
                        <SafeAreaView style={styles.safeArea}>
                            <View style={[styles.header, { borderBottomColor: colors.bgLight }]}>
                                <View style={styles.profileSection}>
                                    <View style={[styles.avatarGradient, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
                                        <Text style={styles.avatarText}>
                                            {isAuthenticated && user ? user.name[0].toUpperCase() : 'G'}
                                        </Text>
                                    </View>
                                    <View style={styles.userTextContainer}>
                                        <Text style={[styles.userName, { color: colors.textMain }]} numberOfLines={1}>
                                            {isAuthenticated && user ? user.name : 'Welcome Guest'}
                                        </Text>
                                        <Text style={[styles.userSubtitle, { color: colors.textMuted }]}>
                                            {isAuthenticated ? 'Premium Member' : 'Explore our delicious menu'}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={closeMenu} style={[styles.closeBtn, { backgroundColor: colors.bgLight }]}>
                                    <Ionicons name="chevron-back" size={24} color={colors.textMain} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollInner}
                            >
                                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Discover</Text>
                                {menuItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.menuLink}
                                        onPress={() => handleNavigation(item.path)}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                                            <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.linkText, { color: colors.textMain }]}>{item.label}</Text>
                                        {(item.badge ?? 0) > 0 && (
                                            <View style={[styles.badge, { backgroundColor: colors.error }]}>
                                                <Text style={styles.badgeText}>{item.badge}</Text>
                                            </View>
                                        )}
                                        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                                    </TouchableOpacity>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <View style={[styles.divider, { backgroundColor: colors.bgLight }]} />
                                        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>My Profile</Text>
                                        <TouchableOpacity
                                            style={styles.menuLink}
                                            onPress={() => handleNavigation('/profile')}
                                        >
                                            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                                                <Ionicons name="person-outline" size={22} color={colors.primary} />
                                            </View>
                                            <Text style={[styles.linkText, { color: colors.textMain }]}>Account Settings</Text>
                                            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.menuLink}
                                            onPress={handleLogout}
                                        >
                                            <View style={[styles.iconContainer, { backgroundColor: colors.error + '15' }]}>
                                                <Ionicons name="log-out-outline" size={22} color={colors.error} />
                                            </View>
                                            <Text style={[styles.linkText, { color: colors.error }]}>Logout</Text>
                                            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                                        </TouchableOpacity>
                                    </>
                                )}

                                {!isAuthenticated && (
                                    <TouchableOpacity
                                        style={[styles.loginBanner, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                                        onPress={() => handleNavigation('/(auth)/login')}
                                    >
                                        <Ionicons name="log-in-outline" size={20} color="#FFF" />
                                        <Text style={styles.loginBannerText}>Login for special offers</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>

                            <View style={[styles.footer, { borderTopColor: colors.bgLight }]}>
                                <View style={styles.socials}>
                                    <Ionicons name="logo-facebook" size={20} color={colors.textMuted} style={styles.socialIcon} />
                                    <Ionicons name="logo-instagram" size={20} color={colors.textMuted} style={styles.socialIcon} />
                                    <Ionicons name="logo-whatsapp" size={20} color={colors.textMuted} />
                                </View>
                                <Text style={[styles.footerText, { color: colors.textMuted }]}>v1.0.6 • Smooth Glide Edition</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 2,
    },
    userSubtitle: {
        fontSize: 12,
    },
    closeBtn: {
        padding: 8,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    linkText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    badge: {
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
        marginVertical: 20,
    },
    loginBanner: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
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
        fontWeight: '500',
    },
});
