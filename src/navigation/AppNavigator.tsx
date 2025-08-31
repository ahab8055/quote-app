import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { COLORS, FONT_SIZES } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, iconName, size }: { focused: boolean; iconName: string; size: number }) => (
  <Text style={{ fontSize: size }}>{iconName}</Text>
);

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = focused ? '🏠' : '🏡';
            } else if (route.name === 'Favorites') {
              iconName = focused ? '❤️' : '🤍';
            } else if (route.name === 'Premium') {
              iconName = focused ? '⭐' : '✨';
            } else {
              iconName = '🔵';
            }

            return <TabIcon focused={focused} iconName={iconName} size={size} />;
          },
          tabBarActiveTintColor: COLORS.PRIMARY,
          tabBarInactiveTintColor: COLORS.TEXT_LIGHT,
          tabBarLabelStyle: {
            fontSize: FONT_SIZES.SMALL,
            fontWeight: '500',
          },
          tabBarStyle: {
            backgroundColor: COLORS.CARD_BACKGROUND,
            borderTopWidth: 1,
            borderTopColor: COLORS.TEXT_LIGHT,
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Today',
          }} 
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
          options={{ 
            title: 'Favorites',
          }} 
        />
        <Tab.Screen 
          name="Premium" 
          component={PremiumScreen}
          options={{ 
            title: 'Premium',
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};