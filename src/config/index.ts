export interface Config {
  openaiApiKey?: string;
  revenuecatApiKey?: string;
  enableDebugMode: boolean;
  defaultNotificationTime: string;
}

const config: Config = {
  // Set your OpenAI API key here for AI-generated affirmations
  openaiApiKey: process.env.OPENAI_API_KEY || undefined,
  
  // Set your RevenueCat API key here for premium subscriptions
  revenuecatApiKey: process.env.REVENUECAT_API_KEY || undefined,
  
  // Enable debug mode for development
  enableDebugMode: __DEV__,
  
  // Default notification time (24-hour format)
  defaultNotificationTime: '09:00',
};

export default config;