import { combineLocalDateAndTime } from './due-date';
import type { CreateHandoverInput, HandoverItem } from './handover.types';

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `handover-${Date.now()}`;
}

export function normalizeTags(tags: string[]) {
  return tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
}

export function createHandoverItem(
  input: CreateHandoverInput,
  options?: {
    id?: string;
    now?: Date;
  },
): HandoverItem {
  const now = options?.now ?? new Date();
  const dueAt = combineLocalDateAndTime(input.dueDate, input.dueTime);

  if (!dueAt) {
    throw new Error('Cannot create handover item without a valid due date and time.');
  }

  return {
    id: options?.id ?? createId(),
    caseReference: input.caseReference.trim(),
    customerName: input.customerName.trim(),
    summary: input.summary.trim(),
    priority: input.priority,
    status: input.status,
    nextAction: input.nextAction.trim(),
    dueAt,
    tags: normalizeTags(input.tags),
    acknowledged: false,
    createdAt: now.toISOString(),
  };
}
