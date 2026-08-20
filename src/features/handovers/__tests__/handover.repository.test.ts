import { describe, expect, it, vi, beforeEach } from 'vitest';
import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import { browserStorageAdapter } from '@/lib/storage/storage-adapter';
import { createHandoverRepository } from '../data/handover.repository';
import { createSeedHandovers } from '../data/seed-handovers';

describe('createHandoverRepository', () => {
  const now = new Date('2026-08-20T10:00:00.000Z');

  beforeEach(() => {
    localStorage.clear();
  });

  it('generates, returns, and persists seed data on first load', () => {
    const repository = createHandoverRepository({
      storage: browserStorageAdapter,
      now: () => now,
    });

    const items = repository.load();
    const persistedItems = browserStorageAdapter.get<unknown>(
      STORAGE_KEYS.handovers,
    );

    expect(items).toEqual(createSeedHandovers(now));
    expect(persistedItems).toEqual(items);
  });

  it('returns existing valid stored data without regenerating seed data', () => {
    const storedItems = createSeedHandovers(new Date('2026-08-21T10:00:00.000Z'));
    const seedFactory = vi.fn(() => createSeedHandovers(now));
    browserStorageAdapter.set(STORAGE_KEYS.handovers, storedItems);

    const repository = createHandoverRepository({
      storage: browserStorageAdapter,
      seedFactory,
      now: () => now,
    });

    expect(repository.load()).toEqual(storedItems);
    expect(seedFactory).not.toHaveBeenCalled();
  });

  it('persists items and restores the same data on reload', () => {
    const repository = createHandoverRepository({
      storage: browserStorageAdapter,
      now: () => now,
    });
    const items = createSeedHandovers(now).slice(0, 2);

    repository.persist(items);

    expect(repository.load()).toEqual(items);
  });

  it('recovers safely from corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEYS.handovers, '{broken-json');

    const repository = createHandoverRepository({
      storage: browserStorageAdapter,
      now: () => now,
    });

    expect(() => repository.load()).not.toThrow();
    expect(repository.load()).toEqual(createSeedHandovers(now));
  });

  it('recovers safely from valid JSON with an invalid data shape', () => {
    localStorage.setItem(
      STORAGE_KEYS.handovers,
      JSON.stringify({ hello: 'world' }),
    );

    const repository = createHandoverRepository({
      storage: browserStorageAdapter,
      now: () => now,
    });

    expect(repository.load()).toEqual(createSeedHandovers(now));
    expect(browserStorageAdapter.get<unknown>(STORAGE_KEYS.handovers)).toEqual(
      createSeedHandovers(now),
    );
  });
});
