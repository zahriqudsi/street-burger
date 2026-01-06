/**
 * Street Burger - Homepage
 */

import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import { useAuth } from '@/src/contexts/AuthContext';
import { restaurantService, reviewService } from '@/src/services';
import { RestaurantInfo, Review } from '@/src/types';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Login Banner Component
const LoginBanner = () => {
  const router = useRouter();

  return (
    <View style={styles.loginBanner}>
      <View style={styles.loginBannerContent}>
        <Text style={styles.loginBannerTitle}>Join Street Burger!</Text>
        <Text style={styles.loginBannerSubtitle}>
          Get exclusive rewards and make reservations
        </Text>
      </View>
      <View style={styles.loginBannerButtons}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Review Card Component
const ReviewCard = ({ review }: { review: Review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewerName}>{review.reviewerName || 'Anonymous'}</Text>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>
            {i < review.rating ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    </View>
    <Text style={styles.reviewComment} numberOfLines={3}>
      {review.comment}
    </Text>
  </View>
);

// Call Us Button Component
const CallUsButton = ({ phone }: { phone?: string }) => (
  <TouchableOpacity
    style={styles.callButton}
    onPress={() => phone && Linking.openURL(`tel:${phone}`)}
  >
    <Text style={styles.callButtonIcon}>📞</Text>
    <Text style={styles.callButtonText}>Call Us</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      console.log('[HomeScreen] Fetching initial data...');
      const [reviewsData, infoData] = await Promise.all([
        reviewService.getLatest().catch((err) => {
          console.log('[HomeScreen] Error fetching reviews:', err.message);
          return [];
        }),
        restaurantService.getAll().then(res => res.data[0]).catch((err) => {
          console.log('[HomeScreen] Error fetching restaurant info:', err.message);
          return null;
        }),
      ]);
      setReviews(reviewsData);
      setRestaurantInfo(infoData);
    } catch (error) {
      console.log('[HomeScreen] General error fetching home data:', error);
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🍔</Text>
          <Text style={styles.heroTitle}>Street Burger</Text>
          <Text style={styles.heroSubtitle}>
            Sri Lankan Seafood Meets Gourmet Burgers
          </Text>
        </View>

        {/* Login Banner (if not logged in) */}
        {!isAuthenticated && <LoginBanner />}

        {/* Welcome Back (if logged in) */}
        {isAuthenticated && user && (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeBack}>
                <Text style={styles.welcomeText}>Welcome back, {user.name}! 👋</Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => signOut()}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>

            {/* Admin Dashboard - only for ADMIN role */}
            {user?.role === 'ADMIN' && (
              <TouchableOpacity
                style={styles.adminButton}
                onPress={() => router.push('/admin' as any)}
              >
                <View style={styles.adminIconContainer}>
                  <Ionicons name="settings" size={20} color="#FFF" />
                </View>
                <Text style={styles.adminButtonText}>Admin Dashboard</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.tint} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Quick Actions (Hidden for Admin) */}
        {user?.role !== 'ADMIN' && (
          <View style={styles.quickActions}>
            <Link href="/(tabs)/menu" asChild>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🍽️</Text>
                <Text style={styles.quickActionText}>View Menu</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/reservation" asChild>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>📅</Text>
                <Text style={styles.quickActionText}>Book Table</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/order" asChild>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🛒</Text>
                <Text style={styles.quickActionText}>Order Now</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}

        {/* Latest Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What Our Customers Say</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
          >
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <View style={styles.noReviews}>
                <Text style={styles.noReviewsText}>Reviews coming soon!</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutText}>
            {restaurantInfo?.aboutUs ||
              'Welcome to Street Burger - Where Sri Lankan Flavors Meet Gourmet Burgers! Experience the perfect fusion of fresh seafood and traditional spices.'}
          </Text>
        </View>

        {/* Opening Hours */}
        <View style={styles.hoursSection}>
          <Text style={styles.hoursIcon}>🕐</Text>
          <Text style={styles.hoursTitle}>Opening Hours</Text>
          <Text style={styles.hoursText}>
            {restaurantInfo?.openingHours || 'Monday - Sunday: 11:00 AM - 11:00 PM'}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Call Button (Hidden for Admin) */}
      {user?.role !== 'ADMIN' && <CallUsButton phone={restaurantInfo?.phone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  hero: {
    backgroundColor: Colors.primary,
    paddingVertical: 32,
    paddingHorizontal: Spacing.screenPadding,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroTitle: {
    ...Typography.styles.h1,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    ...Typography.styles.body,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  loginBanner: {
    backgroundColor: Colors.light.surface,
    margin: Spacing.screenPadding,
    padding: Spacing.cardPadding,
    borderRadius: Spacing.borderRadius.xl,
    ...Spacing.shadow.md,
  },
  loginBannerContent: {
    marginBottom: 16,
  },
  loginBannerTitle: {
    ...Typography.styles.h4,
    color: Colors.light.text,
    marginBottom: 4,
  },
  loginBannerSubtitle: {
    ...Typography.styles.bodySmall,
    color: Colors.light.textSecondary,
  },
  loginBannerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
  },
  loginButtonText: {
    ...Typography.styles.button,
    color: '#FFFFFF',
  },
  signupButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
  },
  signupButtonText: {
    ...Typography.styles.button,
    color: Colors.primary,
  },
  welcomeContainer: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: 8,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  welcomeBack: {
    flex: 1,
  },
  welcomeText: {
    ...Typography.styles.h4,
    color: Colors.light.text,
  },
  logoutButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  logoutButtonText: {
    ...Typography.styles.caption,
    color: '#e74c3c',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 16,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
    ...Spacing.shadow.sm,
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    ...Typography.styles.caption,
    color: Colors.light.text,
    fontWeight: '600',
  },
  section: {
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.styles.h5,
    color: Colors.light.text,
  },
  seeAll: {
    ...Typography.styles.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  reviewsContainer: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 12,
  },
  reviewCard: {
    width: width * 0.7,
    backgroundColor: Colors.light.surface,
    padding: Spacing.cardPadding,
    borderRadius: Spacing.borderRadius.lg,
    marginRight: 12,
    ...Spacing.shadow.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    ...Typography.styles.label,
    color: Colors.light.text,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 12,
  },
  reviewComment: {
    ...Typography.styles.bodySmall,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  noReviews: {
    width: width - Spacing.screenPadding * 2,
    padding: 32,
    alignItems: 'center',
  },
  noReviewsText: {
    ...Typography.styles.body,
    color: Colors.light.textSecondary,
  },
  aboutSection: {
    padding: Spacing.screenPadding,
    marginTop: 16,
  },
  aboutTitle: {
    ...Typography.styles.h5,
    color: Colors.light.text,
    marginBottom: 8,
  },
  aboutText: {
    ...Typography.styles.body,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  hoursSection: {
    backgroundColor: Colors.light.surface,
    margin: Spacing.screenPadding,
    padding: Spacing.cardPadding,
    borderRadius: Spacing.borderRadius.lg,
    alignItems: 'center',
    ...Spacing.shadow.sm,
  },
  hoursIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  hoursTitle: {
    ...Typography.styles.h5,
    color: Colors.light.text,
    marginBottom: 4,
  },
  hoursText: {
    ...Typography.styles.body,
    color: Colors.light.textSecondary,
  },
  callButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: Colors.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Spacing.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    ...Spacing.shadow.lg,
  },
  callButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  callButtonText: {
    ...Typography.styles.button,
    color: '#FFFFFF',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint + '20',
  },
  adminIconContainer: {
    backgroundColor: Colors.light.tint,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminButtonText: {
    ...Typography.styles.label,
    flex: 1,
    color: Colors.light.text,
  },
});
