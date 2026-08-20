export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export class StorageWriteError extends Error {
  constructor(key: string, cause: unknown) {
    super(`Unable to write "${key}" to browser storage.`);
    this.name = 'StorageWriteError';
    this.cause = cause;
  }
}

function getBrowserStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export const browserStorageAdapter: StorageAdapter = {
  get<T>(key: string) {
    const storage = getBrowserStorage();

    if (!storage) {
      return null;
    }

    const rawValue = storage.getItem(key);

    if (rawValue === null) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T) {
    const storage = getBrowserStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new StorageWriteError(key, error);
    }
  },

  remove(key: string) {
    const storage = getBrowserStorage();

    if (!storage) {
      return;
    }

    storage.removeItem(key);
  },
};
