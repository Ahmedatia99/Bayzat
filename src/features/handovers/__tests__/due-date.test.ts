import { describe, expect, it } from 'vitest';
import {
  combineLocalDateAndTime,
  getDueCategory,
  isDueSoon,
  isOverdue,
} from '../domain/due-date';

describe('due-date domain rules', () => {
  const now = new Date('2026-08-20T10:00:00.000Z');

  function dueAt(offsetMs: number) {
    return new Date(now.getTime() + offsetMs).toISOString();
  }

  it('classifies past timestamps as overdue', () => {
    expect(getDueCategory(dueAt(-60_000), now)).toBe('overdue');
    expect(isOverdue(dueAt(-60_000), now)).toBe(true);
  });

  it('classifies 1ms before now as overdue', () => {
    expect(getDueCategory(dueAt(-1), now)).toBe('overdue');
  });

  it('classifies exactly now as due soon', () => {
    expect(getDueCategory(dueAt(0), now)).toBe('due-soon');
    expect(isDueSoon(dueAt(0), now)).toBe(true);
  });

  it('classifies one minute from now as due soon', () => {
    expect(getDueCategory(dueAt(60_000), now)).toBe('due-soon');
  });

  it('classifies exactly two hours from now as due soon', () => {
    expect(getDueCategory(dueAt(2 * 60 * 60 * 1000), now)).toBe('due-soon');
  });

  it('classifies just after two hours from now as upcoming', () => {
    expect(getDueCategory(dueAt(2 * 60 * 60 * 1000 + 1), now)).toBe(
      'upcoming',
    );
  });

  it('classifies one day from now as upcoming', () => {
    expect(getDueCategory(dueAt(24 * 60 * 60 * 1000), now)).toBe('upcoming');
  });
});

describe('combineLocalDateAndTime', () => {
  it('combines a complete local date and time into an ISO timestamp', () => {
    const result = combineLocalDateAndTime('2026-08-20', '12:30');

    expect(result).not.toBeNull();
    expect(new Date(result ?? '').toISOString()).toBe(result);
  });

  it('returns null for missing date', () => {
    expect(combineLocalDateAndTime('', '12:30')).toBeNull();
  });

  it('returns null for missing time', () => {
    expect(combineLocalDateAndTime('2026-08-20', '')).toBeNull();
  });

  it('returns null for malformed date', () => {
    expect(combineLocalDateAndTime('2026-02-31', '12:30')).toBeNull();
  });

  it('returns null for malformed time', () => {
    expect(combineLocalDateAndTime('2026-08-20', '24:00')).toBeNull();
  });
});
