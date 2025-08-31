/**
 * Affirmation App - A React Native app for daily positive affirmations
 * Features: Daily affirmations, favorites, premium subscription, push notifications
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NotificationService } from './src/services/notifications';
import { OpenAIService } from './src/services/openai';
import { MockRevenueCatService } from './src/services/revenuecat';
import { COLORS } from './src/constants/theme';
import config from './src/config';

// Configure services
const initializeServices = async () => {
  // Initialize notifications
  NotificationService.initialize();

  // Initialize RevenueCat with configuration
  await MockRevenueCatService.initialize(config.revenuecatApiKey || 'mock_api_key');

  // Set OpenAI API key if available
  if (config.openaiApiKey) {
    OpenAIService.setApiKey(config.openaiApiKey);
  }
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    initializeServices();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.BACKGROUND}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
