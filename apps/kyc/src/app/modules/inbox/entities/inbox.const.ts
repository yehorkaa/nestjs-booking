export const INBOX_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
} as const;

export type InboxStatus = (typeof INBOX_STATUS)[keyof typeof INBOX_STATUS];