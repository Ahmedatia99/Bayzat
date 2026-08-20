import { z } from 'zod';
import {
  CASE_REFERENCE_PATTERN,
  HANDOVER_STATUSES,
  MAX_TAGS,
  NEXT_ACTION_MAX_LENGTH,
  NEXT_ACTION_MIN_LENGTH,
  PRIORITIES,
  SUMMARY_MAX_LENGTH,
  SUMMARY_MIN_LENGTH,
} from './handover.constants';
import { combineLocalDateAndTime } from './due-date';

function hasDuplicateTags(tags: string[]) {
  const seenTags = new Set<string>();

  for (const tag of tags) {
    const normalizedTag = tag.trim().toLowerCase();

    if (!normalizedTag) {
      continue;
    }

    if (seenTags.has(normalizedTag)) {
      return true;
    }

    seenTags.add(normalizedTag);
  }

  return false;
}

const isoDateStringSchema = z
  .string()
  .datetime({ message: 'Use a valid ISO timestamp.' });

export const handoverItemSchema = z.object({
  id: z.string().trim().min(1, 'A handover item needs an id.'),
  caseReference: z
    .string()
    .trim()
    .regex(CASE_REFERENCE_PATTERN, 'Use the format CASE-1234.'),
  customerName: z.string().trim().min(1, 'Customer name is required.'),
  summary: z
    .string()
    .trim()
    .min(
      SUMMARY_MIN_LENGTH,
      `Summary must be at least ${SUMMARY_MIN_LENGTH} characters.`,
    )
    .max(
      SUMMARY_MAX_LENGTH,
      `Summary must be at most ${SUMMARY_MAX_LENGTH} characters.`,
    ),
  priority: z.enum(PRIORITIES),
  status: z.enum(HANDOVER_STATUSES),
  nextAction: z
    .string()
    .trim()
    .min(
      NEXT_ACTION_MIN_LENGTH,
      `Next action must be at least ${NEXT_ACTION_MIN_LENGTH} characters.`,
    )
    .max(
      NEXT_ACTION_MAX_LENGTH,
      `Next action must be at most ${NEXT_ACTION_MAX_LENGTH} characters.`,
    ),
  dueAt: isoDateStringSchema,
  tags: z.array(z.string().trim().toLowerCase()).max(MAX_TAGS),
  acknowledged: z.boolean(),
  createdAt: isoDateStringSchema,
});

export const handoverItemsSchema = z.array(handoverItemSchema);

export function createHandoverInputSchema(options?: { now?: Date }) {
  return z
    .object({
      caseReference: z
        .string()
        .trim()
        .min(1, 'Case reference is required.')
        .regex(CASE_REFERENCE_PATTERN, 'Use the format CASE-1234.'),
      customerName: z.string().trim().min(1, 'Customer name is required.'),
      summary: z
        .string()
        .trim()
        .min(
          SUMMARY_MIN_LENGTH,
          `Summary must be at least ${SUMMARY_MIN_LENGTH} characters.`,
        )
        .max(
          SUMMARY_MAX_LENGTH,
          `Summary must be at most ${SUMMARY_MAX_LENGTH} characters.`,
        ),
      priority: z.enum(PRIORITIES, {
        message: 'Choose a supported priority.',
      }),
      status: z.enum(HANDOVER_STATUSES, {
        message: 'Choose a supported status.',
      }),
      nextAction: z
        .string()
        .trim()
        .min(
          NEXT_ACTION_MIN_LENGTH,
          `Next action must be at least ${NEXT_ACTION_MIN_LENGTH} characters.`,
        )
        .max(
          NEXT_ACTION_MAX_LENGTH,
          `Next action must be at most ${NEXT_ACTION_MAX_LENGTH} characters.`,
        ),
      dueDate: z.string().trim().min(1, 'Due date is required.'),
      dueTime: z.string().trim().min(1, 'Due time is required.'),
      tags: z.array(z.string()).max(MAX_TAGS, `Add no more than ${MAX_TAGS} tags.`),
    })
    .superRefine((input, context) => {
      const dueAt = combineLocalDateAndTime(input.dueDate, input.dueTime);

      if (!dueAt) {
        context.addIssue({
          code: 'custom',
          message: 'Enter a valid due date and time.',
          path: ['dueDate'],
        });
      } else if (new Date(dueAt).getTime() <= (options?.now ?? new Date()).getTime()) {
        context.addIssue({
          code: 'custom',
          message: 'Due date and time must be in the future.',
          path: ['dueDate'],
        });
      }

      if (hasDuplicateTags(input.tags)) {
        context.addIssue({
          code: 'custom',
          message: 'Tags must not contain duplicates.',
          path: ['tags'],
        });
      }
    })
    .transform((input) => ({
      ...input,
      tags: input.tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    }));
}
