/**
 * Street Burger - Cart Screen
 */

import { BackButton } from '@/components/BackButton';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCart } from '@/src/contexts/CartContext';
import { orderService } from '@/src/services/orders';
import { formatRs } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAppColors } from '@/src/hooks/useAppColors';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CartScreen() {
    const colors = useAppColors();
    const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP' | 'DINE_IN'>('DELIVERY');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [notes, setNotes] = useState('');

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please log in to place an order.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/(auth)/login') },
            ]);
            return;
        }

        if (orderType === 'DELIVERY' && !address.trim()) {
            Alert.alert('Missing Address', 'Please enter a delivery address.');
            return;
        }
        if (!phone.trim()) {
            Alert.alert('Missing Phone', 'Please enter a contact number.');
            return;
        }

        setIsSubmitting(true);
        try {
            await orderService.create({
                items: items.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
                orderType,
                deliveryAddress: orderType === 'DELIVERY' ? address : undefined,
                phoneNumber: phone,
                notes,
            });
            Alert.alert('Success', 'Order placed successfully!', [
                {
                    text: 'OK', onPress: () => {
                        clearCart();
                        router.replace('/(tabs)/order');
                    }
                }
            ]);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
                <Stack.Screen options={{ title: 'My Basket' }} />
                <Ionicons name="cart-outline" size={80} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Your basket is empty</Text>
                <TouchableOpacity style={[styles.shopButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => router.back()}>
                    <Text style={[styles.shopButtonText, { color: colors.white }]}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Stack.Screen options={{
                headerShown: true,
                title: 'My Basket',
                headerTitleStyle: { color: colors.textMain },
                headerStyle: { backgroundColor: colors.surface },
                headerTransparent: false,
                headerTintColor: colors.textMain,
                headerLeft: () => <BackButton />
            }} />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

                {/* Cart Items */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Items</Text>
                    {items.map((item) => (
                        <View key={item.menuItem.id} style={[styles.itemCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                            <Image
                                source={{ uri: item.menuItem.imageUrl }}
                                style={[styles.itemImage, { backgroundColor: colors.bgLight }]}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={[styles.itemTitle, { color: colors.textMain }]}>{item.menuItem.title}</Text>
                                <Text style={[styles.itemPrice, { color: colors.primary }]}>{formatRs(item.menuItem.price * item.quantity)}</Text>
                            </View>
                            <View style={[styles.quantityControl, { backgroundColor: colors.bgLight, borderColor: colors.border }]}>
                                <TouchableOpacity
                                    style={[styles.qtyBtn, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
                                    onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                >
                                    <Ionicons name="remove" size={16} color={colors.primary} />
                                </TouchableOpacity>
                                <Text style={[styles.qtyText, { color: colors.textMain }]}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={[styles.qtyBtn, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
                                    onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                >
                                    <Ionicons name="add" size={16} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Options */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Order Type</Text>
                    <View style={[styles.typeSelector, { backgroundColor: colors.border }]}>
                        {(['DELIVERY', 'PICKUP', 'DINE_IN'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeBtn,
                                    orderType === type && [styles.typeBtnActive, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]
                                ]}
                                onPress={() => setOrderType(type)}
                            >
                                <Text style={[styles.typeText, { color: colors.textMuted }, orderType === type && { color: colors.textMain }]}>
                                    {type.replace('_', ' ')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Details Form */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Details</Text>

                    <Text style={[styles.label, { color: colors.textMain }]}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMain }]}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="077..."
                        placeholderTextColor={colors.textTertiary}
                    />

                    {orderType === 'DELIVERY' && (
                        <>
                            <Text style={[styles.label, { color: colors.textMain }]}>Delivery Address</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMain }]}
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                placeholder="Your full address..."
                                placeholderTextColor={colors.textTertiary}
                            />
                        </>
                    )}

                    <Text style={[styles.label, { color: colors.textMain }]}>Notes</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMain }]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Any special requests?"
                        placeholderTextColor={colors.textTertiary}
                    />
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { backgroundColor: colors.surface }]}>
                <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Total</Text>
                    <Text style={[styles.totalAmount, { color: colors.textMain }]}>{formatRs(subtotal)}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutBtn, { backgroundColor: colors.textMain, shadowColor: colors.cardShadow }, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleCheckout}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={colors.surface} />
                    ) : (
                        <Text style={[styles.checkoutText, { color: colors.white }]}>Place Order</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: Typography.fontSize.lg,
        marginTop: 16,
        marginBottom: 24,
        fontWeight: '600',
    },
    shopButton: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    shopButtonText: {
        fontWeight: '800',
        fontSize: Typography.fontSize.base,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 150,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '800',
        marginBottom: 16,
        marginLeft: 4,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
    },
    itemImage: {
        width: 72,
        height: 72,
        borderRadius: 16,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    itemTitle: {
        fontWeight: '800',
        fontSize: Typography.fontSize.md,
        marginBottom: 4,
    },
    itemPrice: {
        fontWeight: '800',
        fontSize: Typography.fontSize.base,
    },
    quantityControl: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        paddingVertical: 6,
        paddingHorizontal: 6,
        gap: 4,
        borderWidth: 1,
    },
    qtyBtn: {
        padding: 8,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    qtyText: {
        marginVertical: 4,
        fontWeight: '800',
        fontSize: 14,
    },
    typeSelector: {
        flexDirection: 'row',
        borderRadius: 18,
        padding: 5,
    },
    typeBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 14,
    },
    typeBtnActive: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    typeText: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    typeTextActive: {
        color: Colors.textMain,
    },
    label: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        fontSize: Typography.fontSize.base,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: Typography.fontSize.base,
        fontWeight: '700',
    },
    totalAmount: {
        fontSize: Typography.fontSize['4xl'],
        fontWeight: '900',
    },
    checkoutBtn: {
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    checkoutText: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
