import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/affirmations';

export class StorageService {
  static async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async addToFavorites(affirmationId: string): Promise<void> {
    try {
      const currentFavorites = await this.getFavorites();
      if (!currentFavorites.includes(affirmationId)) {
        const updatedFavorites = [...currentFavorites, affirmationId];
        await AsyncStorage.setItem(
          STORAGE_KEYS.FAVORITES,
          JSON.stringify(updatedFavorites)
        );
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  static async removeFromFavorites(affirmationId: string): Promise<void> {
    try {
      const currentFavorites = await this.getFavorites();
      const updatedFavorites = currentFavorites.filter(id => id !== affirmationId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  static async getDailyUsage(): Promise<number> {
    try {
      const usage = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_USAGE);
      const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_USED_DATE);
      const today = new Date().toDateString();

      if (lastDate !== today) {
        // Reset usage for new day
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE, '0');
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_USED_DATE, today);
        return 0;
      }

      return usage ? parseInt(usage, 10) : 0;
    } catch (error) {
      console.error('Error getting daily usage:', error);
      return 0;
    }
  }

  static async incrementDailyUsage(): Promise<number> {
    try {
      const currentUsage = await this.getDailyUsage();
      const newUsage = currentUsage + 1;
      const today = new Date().toDateString();

      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE, newUsage.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_USED_DATE, today);

      return newUsage;
    } catch (error) {
      console.error('Error incrementing daily usage:', error);
      return 0;
    }
  }

  static async getPremiumStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
      return status === 'true';
    } catch (error) {
      console.error('Error getting premium status:', error);
      return false;
    }
  }

  static async setPremiumStatus(isPremium: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PREMIUM_STATUS,
        isPremium.toString()
      );
    } catch (error) {
      console.error('Error setting premium status:', error);
    }
  }
}