import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  RefreshControl,
} from 'react-native';
import { AffirmationCard } from '../components/AffirmationCard';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { DEFAULT_AFFIRMATIONS, FREE_DAILY_LIMIT, Affirmation } from '../constants/affirmations';
import { StorageService } from '../utils/storage';
import { OpenAIService } from '../services/openai';
import { NotificationService } from '../services/notifications';

export const HomeScreen: React.FC = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    initializeScreen();
    checkNotificationPermissions();
  }, []);

  const initializeScreen = async () => {
    try {
      const [favs, usage, premium] = await Promise.all([
        StorageService.getFavorites(),
        StorageService.getDailyUsage(),
        StorageService.getPremiumStatus(),
      ]);

      setFavorites(favs);
      setDailyUsage(usage);
      setIsPremium(premium);

      // Show today's affirmation
      await showTodaysAffirmation();
    } catch (error) {
      console.error('Error initializing screen:', error);
    }
  };

  const checkNotificationPermissions = async () => {
    try {
      const permissions = await NotificationService.checkPermissions();
      if (!permissions.alert) {
        Alert.alert(
          'Enable Notifications',
          'Get daily affirmations delivered to you every morning!',
          [
            { text: 'Skip', style: 'cancel' },
            {
              text: 'Enable',
              onPress: () => {
                NotificationService.requestPermissions();
                NotificationService.scheduleDailyNotification();
              },
            },
          ]
        );
      } else {
        NotificationService.scheduleDailyNotification();
      }
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    }
  };

  const showTodaysAffirmation = async () => {
    // Get a consistent affirmation for today based on date
    const today = new Date().toDateString();
    const availableAffirmations = isPremium 
      ? DEFAULT_AFFIRMATIONS 
      : DEFAULT_AFFIRMATIONS.filter(a => !a.isPremium);
    
    // Use date as seed for consistent daily affirmation
    const dateIndex = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const affirmationIndex = dateIndex % availableAffirmations.length;
    const todaysAffirmation = availableAffirmations[affirmationIndex];
    
    setCurrentAffirmation(todaysAffirmation);
  };

  const handleNewAffirmation = async () => {
    if (!isPremium && dailyUsage >= FREE_DAILY_LIMIT) {
      Alert.alert(
        'Daily Limit Reached',
        'You have reached your daily limit of free affirmations. Upgrade to Premium for unlimited access!',
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {/* Navigate to premium screen */} },
        ]
      );
      return;
    }

    setLoading(true);

    try {
      // Animate out current affirmation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Try to get AI-generated affirmation first, fallback to predefined
      let newAffirmationText: string;
      try {
        newAffirmationText = await OpenAIService.generateAffirmation();
      } catch (error) {
        // Fallback to predefined affirmations
        const availableAffirmations = isPremium 
          ? DEFAULT_AFFIRMATIONS 
          : DEFAULT_AFFIRMATIONS.filter(a => !a.isPremium);
        const randomIndex = Math.floor(Math.random() * availableAffirmations.length);
        newAffirmationText = availableAffirmations[randomIndex].text;
      }

      const newAffirmation: Affirmation = {
        id: `generated-${Date.now()}`,
        text: newAffirmationText,
        category: 'motivation',
      };

      setTimeout(() => {
        setCurrentAffirmation(newAffirmation);
        
        // Animate in new affirmation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 200);

      // Increment usage for free users
      if (!isPremium) {
        const newUsage = await StorageService.incrementDailyUsage();
        setDailyUsage(newUsage);
      }
    } catch (error) {
      console.error('Error generating new affirmation:', error);
      Alert.alert('Error', 'Failed to generate new affirmation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentAffirmation) return;

    try {
      const isCurrentlyFavorite = favorites.includes(currentAffirmation.id);
      
      if (isCurrentlyFavorite) {
        await StorageService.removeFromFavorites(currentAffirmation.id);
        setFavorites(prev => prev.filter(id => id !== currentAffirmation.id));
      } else {
        await StorageService.addToFavorites(currentAffirmation.id);
        setFavorites(prev => [...prev, currentAffirmation.id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await initializeScreen();
    setRefreshing(false);
  };

  const getRemainingQuotes = () => {
    return Math.max(0, FREE_DAILY_LIMIT - dailyUsage);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Daily Affirmation</Text>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        {!isPremium && (
          <Text style={styles.usageText}>
            {getRemainingQuotes()} free affirmation{getRemainingQuotes() !== 1 ? 's' : ''} remaining today
          </Text>
        )}
      </View>

      {currentAffirmation && (
        <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
          <AffirmationCard
            text={currentAffirmation.text}
            category={currentAffirmation.category}
            onFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(currentAffirmation.id)}
            isPremium={currentAffirmation.isPremium}
          />
        </Animated.View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="New Affirmation"
          onPress={handleNewAffirmation}
          loading={loading}
          disabled={!isPremium && dailyUsage >= FREE_DAILY_LIMIT}
        />
        
        {!isPremium && (
          <Button
            title="Upgrade to Premium ✨"
            onPress={() => {/* Navigate to premium screen */}}
            variant="premium"
            style={styles.premiumButton}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    paddingBottom: SPACING.EXTRA_LARGE,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  usageText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WARNING,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardContainer: {
    marginHorizontal: SPACING.MEDIUM,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.LARGE,
    marginTop: SPACING.LARGE,
  },
  premiumButton: {
    marginTop: SPACING.MEDIUM,
  },
});