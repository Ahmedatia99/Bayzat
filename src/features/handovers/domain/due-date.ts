import { DUE_SOON_WINDOW_MS } from './handover.constants';
import type { DueCategory } from './handover.types';

function isValidDate(value: Date) {
  return !Number.isNaN(value.getTime());
}

export function getDueCategory(
  dueAt: string,
  now: Date = new Date(),
): DueCategory {
  const dueDate = new Date(dueAt);
  const dueTime = dueDate.getTime();
  const nowTime = now.getTime();

  if (!isValidDate(dueDate)) {
    return 'upcoming';
  }

  if (dueTime < nowTime) {
    return 'overdue';
  }

  if (dueTime <= nowTime + DUE_SOON_WINDOW_MS) {
    return 'due-soon';
  }

  return 'upcoming';
}

export function isOverdue(dueAt: string, now: Date = new Date()) {
  return getDueCategory(dueAt, now) === 'overdue';
}

export function isDueSoon(dueAt: string, now: Date = new Date()) {
  return getDueCategory(dueAt, now) === 'due-soon';
}

export function combineLocalDateAndTime(
  date: string,
  time: string,
): string | null {
  if (!date || !time) {
    return null;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

  if (!datePattern.test(date) || !timePattern.test(time)) {
    return null;
  }

  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const localDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    !isValidDate(localDate) ||
    localDate.getFullYear() !== year ||
    localDate.getMonth() !== month - 1 ||
    localDate.getDate() !== day ||
    localDate.getHours() !== hours ||
    localDate.getMinutes() !== minutes
  ) {
    return null;
  }

  return localDate.toISOString();
}
