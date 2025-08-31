import Purchases, { PurchasesOfferings, CustomerInfo } from 'react-native-purchases';
import { StorageService } from '../utils/storage';

export class RevenueCatService {
  private static isInitialized = false;

  static async initialize(apiKey: string) {
    if (this.isInitialized) return;

    try {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO);
      await Purchases.configure({ apiKey });
      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
    }
  }

  static async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat not initialized');
        return null;
      }
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Error getting offerings:', error);
      return null;
    }
  }

  static async purchasePackage(packageToPurchase: any): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat not initialized');
        return false;
      }

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      const isPremium = this.checkPremiumStatus(customerInfo);
      await StorageService.setPremiumStatus(isPremium);
      return isPremium;
    } catch (error) {
      console.error('Error purchasing package:', error);
      return false;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat not initialized');
        return false;
      }

      const customerInfo = await Purchases.restorePurchases();
      const isPremium = this.checkPremiumStatus(customerInfo);
      await StorageService.setPremiumStatus(isPremium);
      return isPremium;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }

  static async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        console.warn('RevenueCat not initialized');
        return null;
      }

      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = this.checkPremiumStatus(customerInfo);
      await StorageService.setPremiumStatus(isPremium);
      return customerInfo;
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  }

  private static checkPremiumStatus(customerInfo: CustomerInfo): boolean {
    return (
      customerInfo.entitlements.active['premium'] !== undefined ||
      customerInfo.entitlements.active['pro'] !== undefined
    );
  }

  static async checkPremiumStatus(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (customerInfo) {
        return this.checkPremiumStatus(customerInfo);
      }
      // Fallback to local storage
      return await StorageService.getPremiumStatus();
    } catch (error) {
      console.error('Error checking premium status:', error);
      return await StorageService.getPremiumStatus();
    }
  }
}

// Mock implementation for when RevenueCat is not available
export class MockRevenueCatService {
  static async initialize(apiKey: string) {
    console.log('Using mock RevenueCat service');
  }

  static async getOfferings() {
    return {
      current: {
        identifier: 'default',
        serverDescription: 'Premium subscription',
        availablePackages: [
          {
            identifier: 'monthly',
            product: {
              identifier: 'premium_monthly',
              price: '$2.99',
            },
          },
        ],
      },
    };
  }

  static async purchasePackage(): Promise<boolean> {
    // Simulate successful purchase
    await StorageService.setPremiumStatus(true);
    return true;
  }

  static async restorePurchases(): Promise<boolean> {
    const isPremium = await StorageService.getPremiumStatus();
    return isPremium;
  }

  static async checkPremiumStatus(): Promise<boolean> {
    return await StorageService.getPremiumStatus();
  }
}