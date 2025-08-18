export const NOTIFICATIONS_TOPICS = {
  OTP: {
    REQUEST_CREATED: 'notifications.otp.request.created',
    REQUEST_CREATED_RETRY: 'notifications.otp.request.created.retry',
    REQUEST_CREATED_DLT: 'notifications.otp.request.created.dlt',
  },
  KYC: {
    REQUEST_CREATED: 'notifications.kyc.request.created',
  },
} as const;
