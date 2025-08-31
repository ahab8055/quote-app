import axios from 'axios';
import { OpenAIResponse } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIService {
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static async generateAffirmation(category?: string): Promise<string> {
    // If no API key is set, return a default affirmation
    if (!this.apiKey) {
      console.warn('OpenAI API key not set, using default affirmation');
      return this.getDefaultAffirmation(category);
    }

    try {
      const prompt = this.buildPrompt(category);
      
      const response = await axios.post<OpenAIResponse>(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that generates positive, uplifting affirmations. Keep them concise, meaningful, and in first person.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const affirmation = response.data.choices[0]?.message?.content?.trim();
      return affirmation || this.getDefaultAffirmation(category);
    } catch (error) {
      console.error('Error generating affirmation:', error);
      // Fallback to default affirmation
      return this.getDefaultAffirmation(category);
    }
  }

  private static buildPrompt(category?: string): string {
    const basePrompt = 'Generate a positive, uplifting affirmation in first person (starting with "I")';
    
    if (category) {
      const categoryPrompts = {
        motivation: 'focused on motivation, success, and personal growth',
        love: 'focused on self-love, relationships, and compassion',
        focus: 'focused on clarity, concentration, and mindfulness',
        gratitude: 'focused on gratitude, appreciation, and abundance',
      };
      
      return `${basePrompt} ${categoryPrompts[category as keyof typeof categoryPrompts] || ''}.`;
    }
    
    return `${basePrompt}.`;
  }

  private static getDefaultAffirmation(category?: string): string {
    const defaultAffirmations = {
      motivation: 'I have the power to create positive change in my life.',
      love: 'I am worthy of love and kindness.',
      focus: 'I am focused and productive in all my endeavors.',
      gratitude: 'I am grateful for the abundance in my life.',
    };

    if (category && defaultAffirmations[category as keyof typeof defaultAffirmations]) {
      return defaultAffirmations[category as keyof typeof defaultAffirmations];
    }

    return 'I am capable of achieving great things.';
  }
}