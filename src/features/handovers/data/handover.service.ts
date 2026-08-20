import type { HandoverItem } from '../domain/handover.types';

export const HANDOVER_SAVE_DELAY_MS = 600;

export interface HandoverSaveService {
  create(item: HandoverItem): Promise<HandoverItem>;
  setAcknowledged(
    item: HandoverItem,
    acknowledged: boolean,
  ): Promise<HandoverItem>;
}

function delay(delayMs: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, delayMs);
  });
}

function assertSuccessfulSave(item: HandoverItem) {
  if (item.caseReference.endsWith('7')) {
    throw new Error(`Simulated save failure for ${item.caseReference}.`);
  }
}

export function createSimulatedHandoverSaveService(
  delayMs = HANDOVER_SAVE_DELAY_MS,
): HandoverSaveService {
  return {
    async create(item: HandoverItem) {
      await delay(delayMs);
      assertSuccessfulSave(item);
      return { ...item, tags: [...item.tags] };
    },

    async setAcknowledged(item: HandoverItem, acknowledged: boolean) {
      await delay(delayMs);
      assertSuccessfulSave(item);
      return { ...item, tags: [...item.tags], acknowledged };
    },
  };
}
