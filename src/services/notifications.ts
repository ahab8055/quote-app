import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';

export class NotificationService {
  static initialize() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create a channel for Android
    PushNotification.createChannel(
      {
        channelId: 'daily-affirmation',
        channelName: 'Daily Affirmations',
        channelDescription: 'Daily affirmation notifications',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }

  static requestPermissions() {
    PushNotification.requestPermissions(['alert', 'badge', 'sound']);
  }

  static scheduleDailyNotification() {
    // Cancel existing daily notifications
    PushNotification.cancelAllLocalNotifications();

    // Schedule daily notification at 9 AM
    PushNotification.localNotificationSchedule({
      channelId: 'daily-affirmation',
      title: 'Your Daily Affirmation ✨',
      message: 'Start your day with a positive affirmation!',
      date: this.getNextNotificationDate(),
      repeatType: 'day',
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      actions: ['Open App'],
      invokeApp: true,
    });
  }

  static cancelDailyNotification() {
    PushNotification.cancelAllLocalNotifications();
  }

  static showInstantNotification(title: string, message: string) {
    PushNotification.localNotification({
      channelId: 'daily-affirmation',
      title,
      message,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      actions: ['Open App'],
      invokeApp: true,
    });
  }

  private static getNextNotificationDate(): Date {
    const now = new Date();
    const notification = new Date();
    
    // Set to 9 AM
    notification.setHours(9, 0, 0, 0);
    
    // If it's already past 9 AM today, schedule for tomorrow
    if (now.getTime() > notification.getTime()) {
      notification.setDate(notification.getDate() + 1);
    }
    
    return notification;
  }

  static checkPermissions(): Promise<any> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }
}