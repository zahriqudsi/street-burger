/**
 * Street Burger - Menu Screen
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { menuService, restaurantService } from '@/src/services';
import { MenuCategory, MenuItem, RestaurantInfo } from '@/src/types';
import { formatRs } from '@/src/utils/format';
import React, { useEffect, useState } from 'react';
import {
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/src/contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';

// Menu Item Card
const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const { addToCart } = useCart();

    return (
        <View style={styles.menuItem}>
            <View style={styles.menuItemImage}>
                {item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl.startsWith('http') ? item.imageUrl : `file://${item.imageUrl}` }}
                        style={styles.menuItemImageActual}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={styles.menuItemEmoji}>🍔</Text>
                )}
            </View>
            <View style={styles.menuItemContent}>
                <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.isPopular && (
                        <View style={styles.popularBadge}>
                            <Text style={styles.popularBadgeText}>Popular</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.menuItemDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.itemFooter}>
                    <Text style={styles.menuItemPrice}>{formatRs(item.price)}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                    >
                        <Ionicons name="add" size={20} color="#FFF" />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Order Modal Buttons
const OrderButtons = ({ info }: { info: RestaurantInfo | null }) => (
    <View style={styles.orderSection}>
        <Text style={styles.orderTitle}>Order Online</Text>
        <View style={styles.orderButtons}>
            <TouchableOpacity
                style={[styles.orderButton, { backgroundColor: '#06C167' }]}
                onPress={() => info?.uberEatsUrl && Linking.openURL(info.uberEatsUrl)}
            >
                <Text style={styles.orderButtonIcon}>🚗</Text>
                <Text style={styles.orderButtonText}>Uber Eats</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.orderButton, { backgroundColor: '#FF5722' }]}
                onPress={() => info?.pickmeFoodUrl && Linking.openURL(info.pickmeFoodUrl)}
            >
                <Text style={styles.orderButtonIcon}>🛵</Text>
                <Text style={styles.orderButtonText}>PickMe Food</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function MenuScreen() {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [categoriesData, itemsData, infoData] = await Promise.all([
                menuService.getCategories().catch(() => []),
                menuService.getAllItems().catch(() => []),
                restaurantService.getInfo().catch(() => null),
            ]);
            setCategories(categoriesData);
            setItems(itemsData);
            setRestaurantInfo(infoData);
            if (categoriesData.length > 0 && !selectedCategory) {
                setSelectedCategory(categoriesData[0].id);
            }
        } catch (error) {
            console.log('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const filteredItems = selectedCategory
        ? items.filter((item) => item.category?.id === selectedCategory)
        : items;

    return (
        <View style={styles.container}>
            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryContainer}
                contentContainerStyle={styles.categoryContent}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryTab,
                        !selectedCategory && styles.categoryTabActive,
                    ]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            !selectedCategory && styles.categoryTextActive,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryTab,
                            selectedCategory === category.id && styles.categoryTabActive,
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === category.id && styles.categoryTextActive,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Menu Items */}
            <ScrollView
                style={styles.menuList}
                contentContainerStyle={styles.menuContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading menu...</Text>
                    </View>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🍽️</Text>
                        <Text style={styles.emptyText}>No items available</Text>
                    </View>
                )}

                {/* Order Section */}
                {/* External Options (Optional) */}
                {/* <OrderButtons info={restaurantInfo} /> */}
            </ScrollView>

            {/* Floating Cart Button */}
            <FloatingCartButton />
        </View>
    );
}

const FloatingCartButton = () => {
    const { count, subtotal } = useCart();
    const router = useRouter();

    if (count === 0) return null;

    return (
        <View style={styles.floatContainer}>
            <TouchableOpacity
                style={styles.floatButton}
                onPress={() => router.push('/cart')}
            >
                <View style={styles.floatBadge}>
                    <Text style={styles.floatBadgeText}>{count}</Text>
                </View>
                <Text style={styles.floatText}>View Basket</Text>
                <Text style={styles.floatPrice}>{formatRs(subtotal)}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    categoryContainer: {
        maxHeight: 56,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    categoryContent: {
        paddingHorizontal: Spacing.screenPadding,
        paddingVertical: 12,
        gap: 8,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Spacing.borderRadius.full,
        backgroundColor: Colors.light.surface,
        marginRight: 8,
    },
    categoryTabActive: {
        backgroundColor: Colors.primary,
    },
    categoryText: {
        ...Typography.styles.buttonSmall,
        color: Colors.light.textSecondary,
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    menuList: {
        flex: 1,
    },
    menuContent: {
        padding: Spacing.screenPadding,
        paddingBottom: 100,
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: Colors.light.surface,
        borderRadius: Spacing.borderRadius.lg,
        padding: Spacing.cardPadding,
        marginBottom: 12,
        ...Spacing.shadow.sm,
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: Spacing.borderRadius.md,
        backgroundColor: Colors.light.surfaceSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemEmoji: {
        fontSize: 36,
    },
    menuItemImageActual: {
        width: '100%',
        height: '100%',
        borderRadius: Spacing.borderRadius.md,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    menuItemTitle: {
        ...Typography.styles.h5,
        color: Colors.light.text,
        flex: 1,
    },
    popularBadge: {
        backgroundColor: Colors.warning,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: Spacing.borderRadius.sm,
    },
    popularBadgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    menuItemDescription: {
        ...Typography.styles.bodySmall,
        color: Colors.light.textSecondary,
        marginBottom: 8,
    },
    menuItemPrice: {
        ...Typography.styles.price,
        color: Colors.primary,
        fontSize: 16,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    addButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    orderSection: {
        marginTop: 24,
        padding: Spacing.cardPadding,
        backgroundColor: Colors.light.surface,
        borderRadius: Spacing.borderRadius.xl,
        ...Spacing.shadow.md,
    },
    orderTitle: {
        ...Typography.styles.h5,
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    orderButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    orderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: Spacing.borderRadius.lg,
        gap: 8,
    },
    orderButtonIcon: {
        fontSize: 20,
    },
    orderButtonText: {
        ...Typography.styles.button,
        color: '#FFFFFF',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        ...Typography.styles.body,
        color: Colors.light.textSecondary,
    },
    floatContainer: {
        position: 'absolute',
        bottom: 90, // Raised to clear the Floating Tab Bar (20 + 60 + 10)
        left: 20,
        right: 20,
    },
    floatButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    floatBadge: {
        backgroundColor: '#FFF',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatBadgeText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    floatText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    floatPrice: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
