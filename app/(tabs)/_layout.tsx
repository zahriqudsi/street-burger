/**
 * Street Burger - Tabs Layout
 */

import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { useAuth } from '@/src/contexts/AuthContext';

// Tab icons as text/emoji for simplicity
const TabIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    home: '🏠',
    menu: '🍽️',
    reservation: '📅',
    rewards: '🎁',
    order: '🛒',
  };

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Text style={[styles.icon, { opacity: focused ? 1 : 0.7 }]}>{icons[name]}</Text>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();
  const prevAuthenticated = React.useRef(isAuthenticated);

  React.useEffect(() => {
    if (prevAuthenticated.current && !isAuthenticated) {
      router.replace('/splash');
    }
    prevAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
          height: Spacing.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => router.push('/inbox')}
            >
              <Text style={styles.headerIconText}>📬</Text>
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Street Burger',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="menu" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservation"
        options={{
          title: 'Reserve',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="reservation" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="rewards" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Order',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="order" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    fontSize: 22,
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 16,
  },
  headerIcon: {
    marginLeft: 12,
  },
  headerIconText: {
    fontSize: 22,
  },
});
