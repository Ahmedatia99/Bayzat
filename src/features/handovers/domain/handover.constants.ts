export const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;

export const HANDOVER_STATUSES = [
  'open',
  'in-progress',
  'pending-response',
  'escalated',
  'resolved',
] as const;

export const CASE_REFERENCE_PATTERN = /^CASE-\d{4}$/;

export const MAX_TAGS = 5;

export const SUMMARY_MIN_LENGTH = 20;
export const SUMMARY_MAX_LENGTH = 200;

export const NEXT_ACTION_MIN_LENGTH = 10;
export const NEXT_ACTION_MAX_LENGTH = 300;

export const DUE_SOON_WINDOW_MS = 2 * 60 * 60 * 1000;
