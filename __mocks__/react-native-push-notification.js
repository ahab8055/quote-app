export default {
  configure: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn((callback) => callback({ alert: true, badge: true, sound: true })),
  cancelAllLocalNotifications: jest.fn(),
  createChannel: jest.fn(),
};

export const Importance = {
  HIGH: 'high',
  DEFAULT: 'default',
  LOW: 'low',
  MIN: 'min',
};