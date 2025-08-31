import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, FONT_SIZES, DIMENSIONS, SPACING } from '../constants/theme';

interface AffirmationCardProps {
  text: string;
  category?: string;
  onFavorite?: () => void;
  isFavorite?: boolean;
  isPremium?: boolean;
  animated?: boolean;
}

export const AffirmationCard: React.FC<AffirmationCardProps> = ({
  text,
  category,
  onFavorite,
  isFavorite = false,
  isPremium = false,
  animated = true,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        isPremium && styles.premiumContainer,
        { transform: [{ scale: scaleValue }] },
      ]}
    >
      <View style={styles.content}>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>★ PREMIUM</Text>
          </View>
        )}
        
        <Text style={styles.affirmationText}>{text}</Text>
        
        {category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          </View>
        )}
      </View>
      
      {onFavorite && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavorite}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: DIMENSIONS.BORDER_RADIUS,
    padding: SPACING.LARGE,
    marginVertical: SPACING.MEDIUM,
    marginHorizontal: SPACING.MEDIUM,
    shadowColor: COLORS.TEXT_PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumContainer: {
    borderWidth: 2,
    borderColor: COLORS.PREMIUM,
  },
  content: {
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: COLORS.PREMIUM,
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: SPACING.MEDIUM,
  },
  premiumBadgeText: {
    color: COLORS.CARD_BACKGROUND,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: 'bold',
  },
  affirmationText: {
    fontSize: FONT_SIZES.LARGE,
    lineHeight: 28,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: SPACING.MEDIUM,
  },
  categoryContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: 16,
  },
  categoryText: {
    color: COLORS.CARD_BACKGROUND,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.MEDIUM,
    right: SPACING.MEDIUM,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
    color: COLORS.TEXT_LIGHT,
  },
  favoriteIconActive: {
    color: COLORS.ACCENT,
  },
});