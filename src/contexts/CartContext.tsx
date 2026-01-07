import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem } from '@/src/types';

export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: MenuItem, quantity?: number) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    subtotal: number;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        saveCart();
    }, [items]);

    const loadCart = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@cart');
            if (jsonValue != null) {
                setItems(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error('Failed to load cart', e);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem('@cart', JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save cart', e);
        }
    };

    const addToCart = (menuItem: MenuItem, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.menuItem.id === menuItem.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.menuItem.id === menuItem.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { menuItem, quantity }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.menuItem.id !== itemId));
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.menuItem.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        AsyncStorage.removeItem('@cart');
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
    );

    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                subtotal,
                count,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
