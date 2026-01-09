import Colors, { Colors as GlobalColors } from '@/src/constants/colors';
import { useAppColors } from '@/src/hooks/useAppColors';
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
  StatusBar as RNStatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DraggableCallButton } from '@/components/DraggableCallButton';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colors = useAppColors();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modern Header - Fixed at Top */}
      <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.bgLight, shadowColor: colors.cardShadow }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greetingText, { color: colors.textMuted }]}>
              {new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening'}
            </Text>
            <Text style={[styles.usersName, { color: colors.textMain }]}>
              {isAuthenticated && user?.name ? user.name.split(' ')[0] : 'Guest'} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: colors.bgLight, borderColor: colors.border }]}
            onPress={() => router.push(isAuthenticated ? '/profile' : '/(auth)/login')}
          >
            {isAuthenticated ? (
              <Text style={styles.avatarText}>👤</Text>
            ) : (
              <Ionicons name="log-in-outline" size={24} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Card */}
        <View style={styles.featuredContainer}>
          <TouchableOpacity style={[styles.featuredCard, { backgroundColor: colors.secondary }]} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={[styles.featuredTitle, { color: colors.white }]}>Experience the Best Burgers in Town</Text>
            <Text style={styles.featuredSubtitle}>Order now and get 20% off</Text>
            <Text style={styles.featuredDecoration}>🍔</Text>
          </TouchableOpacity>
        </View>

        {/* Action Grid */}
        {user?.role !== 'ADMIN' && (
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]} onPress={() => router.push('/(tabs)/menu')}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Text style={{ fontSize: 24 }}>🍔</Text>
              </View>
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>Menu</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Hungry?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]} onPress={() => router.push('/(tabs)/reservation')}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.info + '15' }]}>
                <Text style={{ fontSize: 24 }}>📅</Text>
              </View>
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>Book</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Reserve Table</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]} onPress={() => router.push('/(tabs)/order')}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.accent + '15' }]}>
                <Text style={{ fontSize: 24 }}>🛒</Text>
              </View>
              <Text style={[styles.actionTitle, { color: colors.textMain }]}>Orders</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>My History</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Admin Dashboard Button if Admin */}
        {user?.role === 'ADMIN' && (
          <TouchableOpacity
            style={[styles.adminButton, { backgroundColor: colors.secondary, shadowColor: colors.cardShadow }]}
            onPress={() => router.push('/admin' as any)}
          >
            <View style={styles.adminIcon}>
              <Ionicons name="settings" size={24} color={colors.white} />
            </View>
            <Text style={[styles.adminButtonText, { color: colors.white }]}>Admin Dashboard</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        )}

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Happy Customers</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
          >
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={[styles.reviewerAvatar, { backgroundColor: colors.bgLight }]}>
                        <Text style={[styles.reviewerInitial, { color: colors.textMuted }]}>
                          {review.reviewerName ? review.reviewerName.charAt(0) : 'A'}
                        </Text>
                      </View>
                      <Text style={[styles.reviewerName, { color: colors.textMain }]}>{review.reviewerName || 'Anonymous'}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Text key={i} style={styles.star}>
                          {i < review.rating ? '⭐' : '☆'}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, { color: colors.textMuted }]} numberOfLines={3}>
                    {review.comment}
                  </Text>
                </View>
              ))
            ) : (
              // Placeholder reviews if none exist
              [1, 2].map((i) => (
                <View key={i} style={[styles.reviewCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, borderColor: colors.bgLight }]}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={[styles.reviewerAvatar, { backgroundColor: colors.bgLight }]}>
                        <Text style={[styles.reviewerInitial, { color: colors.textMuted }]}>J</Text>
                      </View>
                      <Text style={[styles.reviewerName, { color: colors.textMain }]}>John Doe</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.star}>⭐⭐⭐⭐⭐</Text>
                    </View>
                  </View>
                  <Text style={[styles.reviewComment, { color: colors.textMuted }]}>
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
            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Visit Us</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="time-outline" size={24} color={colors.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: colors.textMuted }]}>Open Daily</Text>
                <Text style={[styles.infoText, { color: colors.textMain }]}>11:00 AM - 11:00 PM</Text>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  usersName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '800',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    height: 160,
    justifyContent: 'center',
  },
  featuredTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: 'bold',
    width: '70%',
    lineHeight: 32,
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.fontSize.base,
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
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
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
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 10,
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
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  reviewsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 10,
  },
  reviewCard: {
    width: width * 0.75,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
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
    backgroundColor: Colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInitial: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
  },
  // Admin Button
  adminButton: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.white,
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
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
