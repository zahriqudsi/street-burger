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

import { useAppColors } from '@/src/hooks/useAppColors';

// Modern Tab Icon Component with Animation
const TabIcon = ({ name, color, focused, colors }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean; colors: any }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Ionicons
        name={name}
        size={26}
        color={focused ? colors.primary : colors.textMuted}
      />
      {focused && <View style={[styles.focusDot, { backgroundColor: colors.primary }]} />}
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
        <Ionicons name="notifications-outline" size={26} color={colors.textMain} />
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.error, borderColor: colors.surface }]}>
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
  const colors = useAppColors();
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }],
          headerStyle: {
            backgroundColor: colors.surface,
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.bgLight,
          },
          headerTintColor: colors.textMain,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
            color: colors.textMain,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => setIsMenuVisible(true)}
            >
              <Ionicons name="menu" size={28} color={colors.textMain} />
            </TouchableOpacity>
          ),
          headerRight: () => <HeaderNotificationIcon colors={colors} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "home" : "home-outline"} color="" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Our Menu',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "fast-food" : "fast-food-outline"} color="" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tabs.Screen
          name="reservation"
          options={{
            title: 'Reservations',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "calendar" : "calendar-outline"} color="" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tabs.Screen
          name="rewards"
          options={{
            title: 'Rewards',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "gift" : "gift-outline"} color="" focused={focused} colors={colors} />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: 'My Orders',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "receipt" : "receipt-outline"} color="" focused={focused} colors={colors} />
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
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: Colors.white,
    borderRadius: 24,
    height: 64,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    borderTopWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    transform: [{ scale: 1.15 }],
  },
  focusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    position: 'absolute',
    bottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 24,
  },
  headerLeft: {
    marginLeft: 24,
  },
  headerIcon: {
    marginLeft: 12,
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '900',
  },
});
