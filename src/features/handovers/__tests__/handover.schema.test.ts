import { describe, expect, it } from 'vitest';
import { createHandoverInputSchema } from '../domain/handover.schema';

const now = new Date(2026, 7, 20, 10, 0, 0, 0);

function validInput() {
  return {
    caseReference: 'CASE-1234',
    customerName: 'Nadia Kareem',
    summary: 'Payroll issue needs review.',
    priority: 'high' as const,
    status: 'open' as const,
    nextAction: 'Call the customer.',
    dueDate: '2026-08-20',
    dueTime: '11:00',
    tags: ['Payroll', ' urgent '],
  };
}

function parse(input: ReturnType<typeof validInput>) {
  return createHandoverInputSchema({ now }).safeParse(input);
}

describe('createHandoverInputSchema', () => {
  it('accepts a valid case reference', () => {
    expect(parse(validInput()).success).toBe(true);
  });

  it.each(['case-1234', 'CASE1234', 'CASE-123', ''])(
    'rejects invalid case reference %s',
    (caseReference) => {
      expect(parse({ ...validInput(), caseReference }).success).toBe(false);
    },
  );

  it('validates summary length boundaries', () => {
    expect(parse({ ...validInput(), summary: 'a'.repeat(19) }).success).toBe(
      false,
    );
    expect(parse({ ...validInput(), summary: 'a'.repeat(20) }).success).toBe(
      true,
    );
    expect(parse({ ...validInput(), summary: 'a'.repeat(200) }).success).toBe(
      true,
    );
    expect(parse({ ...validInput(), summary: 'a'.repeat(201) }).success).toBe(
      false,
    );
  });

  it('validates next-action length boundaries', () => {
    expect(parse({ ...validInput(), nextAction: 'a'.repeat(9) }).success).toBe(
      false,
    );
    expect(parse({ ...validInput(), nextAction: 'a'.repeat(10) }).success).toBe(
      true,
    );
    expect(parse({ ...validInput(), nextAction: 'a'.repeat(300) }).success).toBe(
      true,
    );
    expect(parse({ ...validInput(), nextAction: 'a'.repeat(301) }).success).toBe(
      false,
    );
  });

  it('normalizes valid tags', () => {
    const result = parse(validInput());

    expect(result.success && result.data.tags).toEqual(['payroll', 'urgent']);
  });

  it('validates tag count and duplicate rules', () => {
    expect(parse({ ...validInput(), tags: [] }).success).toBe(true);
    expect(parse({ ...validInput(), tags: ['a', 'b', 'c', 'd', 'e'] }).success).toBe(
      true,
    );
    expect(
      parse({ ...validInput(), tags: ['a', 'b', 'c', 'd', 'e', 'f'] }).success,
    ).toBe(false);
    expect(parse({ ...validInput(), tags: ['payroll', 'payroll'] }).success).toBe(
      false,
    );
    expect(parse({ ...validInput(), tags: ['Payroll', 'payroll'] }).success).toBe(
      false,
    );
    expect(parse({ ...validInput(), tags: [' payroll ', 'payroll'] }).success).toBe(
      false,
    );
  });

  it('validates due date and time together', () => {
    expect(parse({ ...validInput(), dueTime: '11:00' }).success).toBe(true);
    expect(parse({ ...validInput(), dueTime: '09:00' }).success).toBe(false);
    expect(parse({ ...validInput(), dueDate: '' }).success).toBe(false);
    expect(parse({ ...validInput(), dueTime: '' }).success).toBe(false);
  });

  it('returns useful required-field messages', () => {
    const result = parse({
      ...validInput(),
      caseReference: '',
      customerName: '',
      summary: '',
      nextAction: '',
      dueDate: '',
      dueTime: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);

      expect(messages).toContain('Case reference is required.');
      expect(messages).toContain('Customer name is required.');
      expect(messages).toContain('Summary must be at least 20 characters.');
      expect(messages).toContain('Next action must be at least 10 characters.');
      expect(messages).toContain('Due date is required.');
      expect(messages).toContain('Due time is required.');
    }
  });
});
