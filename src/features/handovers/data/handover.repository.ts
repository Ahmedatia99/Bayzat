import { STORAGE_KEYS } from '@/lib/storage/storage-keys';
import {
  browserStorageAdapter,
  type StorageAdapter,
} from '@/lib/storage/storage-adapter';
import { handoverItemsSchema } from '../domain/handover.schema';
import type { HandoverItem } from '../domain/handover.types';
import { createSeedHandovers } from './seed-handovers';

export interface HandoverRepository {
  load(): HandoverItem[];
  persist(items: HandoverItem[]): void;
}

interface CreateHandoverRepositoryOptions {
  storage?: StorageAdapter;
  seedFactory?: (now: Date) => HandoverItem[];
  now?: () => Date;
}

export function createHandoverRepository(
  options: CreateHandoverRepositoryOptions = {},
): HandoverRepository {
  const storage = options.storage ?? browserStorageAdapter;
  const seedFactory = options.seedFactory ?? createSeedHandovers;
  const getNow = options.now ?? (() => new Date());

  return {
    load() {
      const storedItems = storage.get<unknown>(STORAGE_KEYS.handovers);
      const parsedItems = handoverItemsSchema.safeParse(storedItems);

      if (parsedItems.success) {
        return parsedItems.data;
      }

      const seedItems = seedFactory(getNow());
      storage.set(STORAGE_KEYS.handovers, seedItems);
      return seedItems;
    },

    persist(items: HandoverItem[]) {
      const parsedItems = handoverItemsSchema.safeParse(items);

      if (!parsedItems.success) {
        throw new Error('Cannot persist invalid handover items.');
      }

      storage.set(STORAGE_KEYS.handovers, parsedItems.data);
    },
  };
}
