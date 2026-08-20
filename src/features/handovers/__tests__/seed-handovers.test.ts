import { describe, expect, it } from 'vitest';
import { getDueCategory } from '../domain/due-date';
import { createSeedHandovers } from '../data/seed-handovers';

describe('createSeedHandovers', () => {
  const now = new Date('2026-08-20T10:00:00.000Z');
  const items = createSeedHandovers(now);

  it('creates at least 8 realistic handover items', () => {
    expect(items).toHaveLength(8);
  });

  it('includes acknowledged and all due-state examples', () => {
    const dueCategories = items.map((item) => getDueCategory(item.dueAt, now));

    expect(items.some((item) => item.acknowledged)).toBe(true);
    expect(dueCategories).toContain('overdue');
    expect(dueCategories).toContain('due-soon');
    expect(dueCategories).toContain('upcoming');
  });

  it('covers multiple priorities and statuses', () => {
    expect(new Set(items.map((item) => item.priority)).size).toBeGreaterThanOrEqual(
      3,
    );
    expect(new Set(items.map((item) => item.status)).size).toBeGreaterThanOrEqual(
      3,
    );
  });

  it('contains repeated tags across items', () => {
    const tagCounts = items
      .flatMap((item) => item.tags)
      .reduce<Record<string, number>>((counts, tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
        return counts;
      }, {});

    expect(Object.values(tagCounts).some((count) => count > 1)).toBe(true);
  });
});
