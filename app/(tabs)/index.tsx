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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DraggableCallButton } from '@/components/DraggableCallButton';

const { width } = Dimensions.get('window');

// Helper components removed as they are now integrated directly or styles were updated.

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
      {/* Modern Header - Fixed at Top */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>
              {new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening'}
            </Text>
            <Text style={styles.usersName}>
              {isAuthenticated && user?.name ? user.name.split(' ')[0] : 'Guest'} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push(isAuthenticated ? '/profile' : '/(auth)/login')}
          >
            {isAuthenticated ? (
              <Text style={styles.avatarText}>👤</Text>
            ) : (
              <Ionicons name="log-in-outline" size={24} color="#718096" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Featured Card */}
        <View style={styles.featuredContainer}>
          <TouchableOpacity style={styles.featuredCard} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.featuredTitle}>Experience the Best Burgers in Town</Text>
            <Text style={styles.featuredSubtitle}>Order now and get 20% off</Text>
            <Text style={styles.featuredDecoration}>🍔</Text>
          </TouchableOpacity>
        </View>

        {/* Action Grid */}
        {user?.role !== 'ADMIN' && (
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/menu')}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E6FFFA' }]}>
                <Text style={{ fontSize: 24 }}>🍔</Text>
              </View>
              <Text style={styles.actionTitle}>Menu</Text>
              <Text style={styles.actionSubtitle}>Hungry?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/reservation')}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#EBF8FF' }]}>
                <Text style={{ fontSize: 24 }}>📅</Text>
              </View>
              <Text style={styles.actionTitle}>Book</Text>
              <Text style={styles.actionSubtitle}>Reserve Table</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/order')}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#FAF5FF' }]}>
                <Text style={{ fontSize: 24 }}>🛒</Text>
              </View>
              <Text style={styles.actionTitle}>Orders</Text>
              <Text style={styles.actionSubtitle}>My History</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Admin Dashboard Button if Admin */}
        {user?.role === 'ADMIN' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => router.push('/admin' as any)}
          >
            <View style={styles.adminIcon}>
              <Ionicons name="settings" size={24} color="#FFF" />
            </View>
            <Text style={styles.adminButtonText}>Admin Dashboard</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Happy Customers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
          >
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>
                          {review.reviewerName ? review.reviewerName.charAt(0) : 'A'}
                        </Text>
                      </View>
                      <Text style={styles.reviewerName}>{review.reviewerName || 'Anonymous'}</Text>
                    </View>
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
              ))
            ) : (
              // Placeholder reviews if none exist
              [1, 2].map((i) => (
                <View key={i} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>J</Text>
                      </View>
                      <Text style={styles.reviewerName}>John Doe</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.star}>⭐⭐⭐⭐⭐</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>
                    "Absolutely loved the spicy burger! The ambiance is great and the staff is super friendly. Will visit again."
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Info / About Snippet */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visit Us</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons name="time-outline" size={24} color="#48BB78" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Open Daily</Text>
                <Text style={styles.infoText}>11:00 AM - 11:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Call Button */}
      {/* Draggable Floating Call Button */}
      <DraggableCallButton phoneNumber={restaurantInfo?.phone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Modern light gray background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  // Modern Header
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 60 : 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  usersName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarText: {
    fontSize: 20,
  },
  // Hero / Featured
  featuredContainer: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  featuredCard: {
    backgroundColor: '#000',
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    height: 160,
    justifyContent: 'center',
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    width: '70%',
    lineHeight: 32,
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  featuredDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    fontSize: 120,
    opacity: 0.1,
  },
  // Action Grid
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '500',
  },
  // Section Styles
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  reviewsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 10, // For shadow
  },
  reviewCard: {
    width: width * 0.75,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F7FAFC',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInitial: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3748',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 12,
    color: '#ECC94B',
  },
  reviewComment: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
  },
  // Login Banner
  loginBanner: {
    margin: 24,
    padding: 24,
    backgroundColor: '#1A202C',
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  loginBannerContent: {
    zIndex: 1,
  },
  loginBannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  loginBannerSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 20,
  },
  loginBannerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#1A202C',
    fontWeight: 'bold',
  },
  signupButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  signupButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  // Admin Button
  adminButton: {
    marginHorizontal: 24,
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  adminIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
  },
  // Info Cards
  infoContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FFF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
});
