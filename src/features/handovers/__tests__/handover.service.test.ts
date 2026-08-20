import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  HANDOVER_SAVE_DELAY_MS,
  createSimulatedHandoverSaveService,
} from '../data/handover.service';
import type { HandoverItem } from '../domain/handover.types';

function createItem(caseReference = 'CASE-1234'): HandoverItem {
  return {
    id: 'item-1',
    caseReference,
    customerName: 'Nadia Kareem',
    summary: 'Payroll issue needs review before the next salary run.',
    priority: 'high',
    status: 'open',
    nextAction: 'Call the customer and confirm payroll status.',
    dueAt: '2026-08-20T12:00:00.000Z',
    tags: ['payroll'],
    acknowledged: false,
    createdAt: '2026-08-20T10:00:00.000Z',
  };
}

describe('createSimulatedHandoverSaveService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves successful creates only after the fixed delay', async () => {
    vi.useFakeTimers();
    const service = createSimulatedHandoverSaveService();
    let settled = false;

    const promise = service.create(createItem()).then((item) => {
      settled = true;
      return item;
    });

    await vi.advanceTimersByTimeAsync(HANDOVER_SAVE_DELAY_MS - 1);
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toEqual(createItem());
    expect(settled).toBe(true);
  });

  it('rejects deterministically after the fixed delay', async () => {
    vi.useFakeTimers();
    const service = createSimulatedHandoverSaveService();
    const promise = service.create(createItem('CASE-1237'));
    const expectation = expect(promise).rejects.toThrow(
      'Simulated save failure for CASE-1237.',
    );

    await vi.advanceTimersByTimeAsync(HANDOVER_SAVE_DELAY_MS);
    await expectation;
  });

  it('returns an acknowledged copy without mutating the original item', async () => {
    vi.useFakeTimers();
    const service = createSimulatedHandoverSaveService();
    const item = createItem();
    const promise = service.setAcknowledged(item, true);

    await vi.advanceTimersByTimeAsync(HANDOVER_SAVE_DELAY_MS);
    const result = await promise;

    expect(result).not.toBe(item);
    expect(result.acknowledged).toBe(true);
    expect(item.acknowledged).toBe(false);
  });
});
