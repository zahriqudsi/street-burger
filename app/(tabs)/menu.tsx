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
import { useAppColors } from '@/src/hooks/useAppColors';
import { Ionicons } from '@expo/vector-icons';

// Menu Item Card
const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const { addToCart } = useCart();
    const colors = useAppColors();

    return (
        <View style={[styles.menuItem, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <View style={[styles.menuItemImage, { backgroundColor: colors.bgLight }]}>
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
                    <Text style={[styles.menuItemTitle, { color: colors.textMain }]}>{item.title}</Text>
                    {item.isPopular && (
                        <View style={styles.popularBadge}>
                            <Text style={[styles.popularBadgeText, { color: colors.warning }]}>Popular</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.menuItemDescription, { color: colors.textMuted }]} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.itemFooter}>
                    <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{formatRs(item.price)}</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToCart(item)}
                    >
                        <Ionicons name="add" size={20} color={colors.surface} />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


export default function MenuScreen() {
    const colors = useAppColors();
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.categoryContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
                contentContainerStyle={styles.categoryContent}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryTab,
                        !selectedCategory ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: colors.bgLight, borderColor: colors.border },
                    ]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text
                        style={[
                            styles.categoryText,
                            !selectedCategory ? { color: colors.white } : { color: colors.textMuted },
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
                            { backgroundColor: colors.bgLight, borderColor: colors.border },
                            selectedCategory === category.id && { backgroundColor: colors.primary, borderColor: colors.primary },
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === category.id ? { color: colors.white } : { color: colors.textMuted },
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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading menu...</Text>
                    </View>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🍽️</Text>
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No items available</Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Cart Button */}
            <FloatingCartButton />
        </View>
    );
}

const FloatingCartButton = () => {
    const colors = useAppColors();
    const { count, subtotal } = useCart();
    const router = useRouter();

    if (count === 0) return null;

    return (
        <View style={styles.floatContainer}>
            <TouchableOpacity
                style={[styles.floatButton, { backgroundColor: colors.primary, shadowColor: colors.cardShadow }]}
                onPress={() => router.push('/cart')}
            >
                <View style={[styles.floatBadge, { backgroundColor: colors.white }]}>
                    <Text style={[styles.floatBadgeText, { color: colors.primary }]}>{count}</Text>
                </View>
                <Text style={[styles.floatText, { color: colors.white }]}>View Basket</Text>
                <Text style={[styles.floatPrice, { color: colors.white }]}>{formatRs(subtotal)}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    categoryContainer: {
        maxHeight: 60,
    },
    categoryContent: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 12,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 4,
        borderWidth: 1,
    },
    categoryTabActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
    },
    menuList: {
        flex: 1,
    },
    menuContent: {
        padding: 20,
        paddingBottom: 160, // Clear the floating cart
    },
    menuItem: {
        flexDirection: 'row',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
    },
    menuItemImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    menuItemEmoji: {
        fontSize: 40,
    },
    menuItemImageActual: {
        width: '100%',
        height: '100%',
    },
    menuItemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    menuItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    menuItemTitle: {
        fontSize: Typography.fontSize.md,
        fontWeight: '700',
        flex: 1,
    },
    popularBadge: {
        backgroundColor: Colors.warningLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    popularBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    menuItemDescription: {
        fontSize: Typography.fontSize.sm,
        marginBottom: 12,
        lineHeight: 18,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuItemPrice: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
    },
    addButton: {
        backgroundColor: Colors.textMain,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 4,
    },
    addButtonText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 12,
    },
    floatContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 90,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    floatButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    floatBadge: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatBadgeText: {
        fontWeight: '800',
        fontSize: 14,
    },
    floatText: {
        fontWeight: '800',
        fontSize: Typography.fontSize.md,
    },
    floatPrice: {
        fontWeight: '800',
        fontSize: Typography.fontSize.md,
    },
    loadingContainer: {
        padding: 60,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: Typography.fontSize.base,
        marginTop: 12,
    },
    emptyContainer: {
        padding: 80,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: Typography.fontSize.md,
        fontWeight: '600',
    },
});
