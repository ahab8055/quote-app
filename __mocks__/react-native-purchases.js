export default {
  configure: jest.fn(),
  getOfferings: jest.fn(),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
  getCustomerInfo: jest.fn(),
  setLogLevel: jest.fn(),
  LOG_LEVEL: {
    INFO: 'INFO',
  },
};