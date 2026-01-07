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
            <View style={styles.emptyContainer}>
                <Stack.Screen options={{ title: 'My Basket' }} />
                <Ionicons name="cart-outline" size={80} color={Colors.light.textSecondary} />
                <Text style={styles.emptyText}>Your basket is empty</Text>
                <TouchableOpacity style={styles.shopButton} onPress={() => router.back()}>
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <Stack.Screen options={{
                headerShown: true,
                title: 'My Basket',
                headerTitleStyle: { color: '#fff' },
                headerStyle: { backgroundColor: '#000' },
                headerTransparent: false,
                headerTintColor: '#000',
                headerLeft: () => <BackButton />
            }} />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

                {/* Cart Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {items.map((item) => (
                        <View key={item.menuItem.id} style={styles.itemCard}>
                            <Image
                                source={{ uri: item.menuItem.imageUrl }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle}>{item.menuItem.title}</Text>
                                <Text style={styles.itemPrice}>{formatRs(item.menuItem.price * item.quantity)}</Text>
                            </View>
                            <View style={styles.quantityControl}>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                >
                                    <Ionicons name="remove" size={16} color={Colors.primary} />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                >
                                    <Ionicons name="add" size={16} color={Colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Type</Text>
                    <View style={styles.typeSelector}>
                        {(['DELIVERY', 'PICKUP', 'DINE_IN'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.typeBtn, orderType === type && styles.typeBtnActive]}
                                onPress={() => setOrderType(type)}
                            >
                                <Text style={[styles.typeText, orderType === type && styles.typeTextActive]}>
                                    {type.replace('_', ' ')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Details Form */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Details</Text>

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="077..."
                    />

                    {orderType === 'DELIVERY' && (
                        <>
                            <Text style={styles.label}>Delivery Address</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                placeholder="Your full address..."
                            />
                        </>
                    )}

                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={styles.input}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Any special requests?"
                    />
                </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>{formatRs(subtotal)}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutBtn, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleCheckout}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.checkoutText}>Place Order</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Slightly lighter gray
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
    },
    emptyText: {
        ...Typography.styles.h5,
        color: '#A0AEC0',
        marginTop: 16,
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        ...Spacing.shadow.md,
    },
    shopButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 120, // Space for footer
    },
    section: {
        marginBottom: 50,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1A202C',
        marginLeft: 4,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        // Modern shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#F7FAFC',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    itemTitle: {
        fontWeight: '700',
        fontSize: 15,
        color: '#2D3748',
        marginBottom: 4,
    },
    itemPrice: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 15,
    },
    quantityControl: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 4,
        gap: 2,
    },
    qtyBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    qtyText: {
        marginVertical: 4,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#2D3748',
    },
    typeSelector: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: 16,
        padding: 4,
    },
    typeBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    typeBtnActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    typeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    typeTextActive: {
        color: '#2D3748',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: '#2D3748',
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
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#718096',
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A202C',
    },
    checkoutBtn: {
        backgroundColor: '#000', // Modern black button
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    checkoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
