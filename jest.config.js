module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  moduleNameMapper: {
    '^react-native-push-notification$': '<rootDir>/__mocks__/react-native-push-notification.js',
    '^react-native-purchases$': '<rootDir>/__mocks__/react-native-purchases.js',
  },
  setupFilesAfterEnv: ['<rootDir>/__mocks__/setup.js'],
};
