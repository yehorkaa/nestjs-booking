export const KYC_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DEFAULT: 'default',
} as const;

export type KycRequestStatus = (typeof KYC_REQUEST_STATUS)[keyof typeof KYC_REQUEST_STATUS];