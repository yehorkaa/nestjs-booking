export const BULL_QUEUES = {
  OUTBOX_EVENT: 'outbox-events',
} as const;

export const BULL_QUEUE_PROCESSES = {
  PROCESS_EVENTS: 'process-events',
  CLEAN_SENT_EVENTS: 'clean-sent-events'
} as const;
