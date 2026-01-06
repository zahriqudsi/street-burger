/**
 * Street Burger - Tabs Layout
 */

import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { SideMenu } from '@/components/SideMenu';

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

const HeaderNotificationIcon = ({ colors }: { colors: any }) => {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity
        style={styles.headerIcon}
        onPress={() => router.push('/inbox')}
      >
        <Ionicons name="notifications-outline" size={26} color={colors.text} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const prevAuthenticated = React.useRef(isAuthenticated);

  React.useEffect(() => {
    if (prevAuthenticated.current && !isAuthenticated) {
      router.replace('/');
    }
    prevAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  return (
    <>
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
            display: user?.role === 'ADMIN' ? 'none' : 'flex',
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
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => setIsMenuVisible(true)}
            >
              <Ionicons name="menu-outline" size={32} color={Colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => <HeaderNotificationIcon colors={colors} />,
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
      <SideMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </>
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
  headerLeft: {
    marginLeft: 16,
  },
  headerIcon: {
    marginLeft: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerIconText: {
    fontSize: 22,
  },
});
