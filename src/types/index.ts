export interface User {
  id: string;
  isPremium: boolean;
  dailyUsage: number;
  lastUsedDate: string;
}

export interface AppState {
  currentAffirmation: string | null;
  favorites: string[];
  user: User;
  loading: boolean;
  error: string | null;
}

export interface NavigationParams {
  HomeScreen: undefined;
  FavoritesScreen: undefined;
  PremiumScreen: undefined;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface RevenueCatOffering {
  identifier: string;
  serverDescription: string;
  availablePackages: Array<{
    identifier: string;
    product: {
      identifier: string;
      price: string;
    };
  }>;
}