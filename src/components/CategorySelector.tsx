import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, DIMENSIONS } from '../constants/theme';
import { CATEGORIES, CategoryType } from '../constants/affirmations';

interface CategorySelectorProps {
  selectedCategory?: CategoryType;
  onCategorySelect: (category: CategoryType) => void;
  isPremium: boolean;
}

const CATEGORY_INFO = {
  [CATEGORIES.MOTIVATION]: {
    emoji: '🚀',
    title: 'Motivation',
    description: 'Boost your drive and determination',
  },
  [CATEGORIES.LOVE]: {
    emoji: '❤️',
    title: 'Love',
    description: 'Cultivate self-love and compassion',
  },
  [CATEGORIES.FOCUS]: {
    emoji: '🎯',
    title: 'Focus',
    description: 'Enhance clarity and concentration',
  },
  [CATEGORIES.GRATITUDE]: {
    emoji: '🙏',
    title: 'Gratitude',
    description: 'Appreciate life\'s blessings',
  },
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  isPremium,
}) => {
  const handleCategoryPress = (category: CategoryType) => {
    if (isPremium) {
      onCategorySelect(category);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Category</Text>
      {!isPremium && (
        <Text style={styles.premiumNote}>
          ✨ Premium feature - Upgrade to access category selection
        </Text>
      )}
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {Object.values(CATEGORIES).map((category) => {
          const info = CATEGORY_INFO[category];
          const isSelected = selectedCategory === category;
          
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryCard,
                isSelected && styles.selectedCard,
                !isPremium && styles.disabledCard,
              ]}
              onPress={() => handleCategoryPress(category)}
              disabled={!isPremium}
            >
              <Text style={[styles.emoji, !isPremium && styles.disabledText]}>
                {info.emoji}
              </Text>
              <Text style={[styles.categoryTitle, !isPremium && styles.disabledText]}>
                {info.title}
              </Text>
              <Text style={[styles.categoryDescription, !isPremium && styles.disabledText]}>
                {info.description}
              </Text>
              {!isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PRO</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.LARGE,
  },
  title: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SMALL,
  },
  premiumNote: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PREMIUM,
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM,
    fontStyle: 'italic',
  },
  scrollContainer: {
    paddingHorizontal: SPACING.MEDIUM,
  },
  categoryCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: DIMENSIONS.BORDER_RADIUS,
    padding: SPACING.MEDIUM,
    marginRight: SPACING.MEDIUM,
    width: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.TEXT_PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: COLORS.PRIMARY,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  disabledCard: {
    opacity: 0.6,
  },
  emoji: {
    fontSize: 28,
    marginBottom: SPACING.SMALL,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SMALL,
  },
  categoryDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 16,
  },
  disabledText: {
    color: COLORS.TEXT_LIGHT,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.PREMIUM,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: COLORS.CARD_BACKGROUND,
    fontSize: 10,
    fontWeight: 'bold',
  },
});