import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { AffirmationCard } from '../components/AffirmationCard';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { DEFAULT_AFFIRMATIONS, Affirmation } from '../constants/affirmations';
import { StorageService } from '../utils/storage';

export const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteAffirmations, setFavoriteAffirmations] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = await StorageService.getFavorites();
      setFavorites(favoriteIds);

      // Get the actual affirmations for these IDs
      const favoriteAffirmationsList = DEFAULT_AFFIRMATIONS.filter(affirmation =>
        favoriteIds.includes(affirmation.id)
      );

      setFavoriteAffirmations(favoriteAffirmationsList);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (affirmationId: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this affirmation from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.removeFromFavorites(affirmationId);
              setFavorites(prev => prev.filter(id => id !== affirmationId));
              setFavoriteAffirmations(prev => prev.filter(aff => aff.id !== affirmationId));
            } catch (error) {
              console.error('Error removing from favorites:', error);
            }
          },
        },
      ]
    );
  };

  const renderAffirmationItem = ({ item }: { item: Affirmation }) => (
    <AffirmationCard
      text={item.text}
      category={item.category}
      onFavorite={() => handleRemoveFromFavorites(item.id)}
      isFavorite={true}
      isPremium={item.isPremium}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start adding affirmations to your favorites by tapping the heart icon!
      </Text>
      <Text style={styles.emptyEmoji}>♡</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteAffirmations.length} saved affirmation{favoriteAffirmations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favoriteAffirmations}
        renderItem={renderAffirmationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        onRefresh={loadFavorites}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.EXTRA_LARGE,
    paddingBottom: SPACING.MEDIUM,
  },
  title: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SMALL,
  },
  subtitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: SPACING.EXTRA_LARGE,
  },
  loadingText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.EXTRA_LARGE,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.EXTRA_LARGE,
  },
  emptyEmoji: {
    fontSize: 48,
    color: COLORS.TEXT_LIGHT,
  },
});