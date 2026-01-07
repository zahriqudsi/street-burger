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

// Modern Tab Icon Component with Animation
const TabIcon = ({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Ionicons
        name={name}
        size={28}
        color={focused ? '#000' : '#A0AEC0'}
      />
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
          tabBarActiveTintColor: '#FFF',
          tabBarInactiveTintColor: '#A0AEC0',
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          headerStyle: {
            backgroundColor: '#FFF', // Standard white header
            shadowColor: 'transparent', // Remove header shadow for clean look
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F7FAFC'
          },
          headerTintColor: '#1A202C',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerLeft}
              onPress={() => setIsMenuVisible(true)}
            >
              <Ionicons name="menu" size={28} color="#1A202C" />
            </TouchableOpacity>
          ),
          headerRight: () => <HeaderNotificationIcon colors={{ text: '#1A202C' }} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false, // Home has its own header
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "home" : "home-outline"} color="" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Our Menu',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "fast-food" : "fast-food-outline"} color="" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="reservation"
          options={{
            title: 'Table Reservation',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "calendar" : "calendar-outline"} color="" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="rewards"
          options={{
            title: 'Loyalty Rewards',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "gift" : "gift-outline"} color="" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: 'Order History',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "receipt" : "receipt-outline"} color="" focused={focused} />
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
  // Clean Minimalist Floating Bar
  tabBar: {
    position: 'absolute',
    bottom: 20, // Lower profile
    left: 20,   // Wider bar for better spacing
    right: 20,
    elevation: 4, // Subtle shadow, not too aggressive
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Soft corners, not full capsule
    height: 60, // Standard touch height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    // Spacing
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Even spacing
    paddingHorizontal: 20, // Inner padding
    marginHorizontal: 25,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    // No background, just pure icon focus
    transform: [{ scale: 1.1 }], // Subtle scale up
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
    right: 0,
    top: 0,
    backgroundColor: '#E53E3E',
    borderRadius: 6,
    width: 10,
    height: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: 'transparent',
    fontSize: 0,
  },
});
