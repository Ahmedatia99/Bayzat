export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type HandoverStatus =
  | 'open'
  | 'in-progress'
  | 'pending-response'
  | 'escalated'
  | 'resolved';

export type DueCategory = 'upcoming' | 'due-soon' | 'overdue';

export interface HandoverItem {
  id: string;
  caseReference: string;
  customerName: string;
  summary: string;
  priority: Priority;
  status: HandoverStatus;
  nextAction: string;
  dueAt: string;
  tags: string[];
  acknowledged: boolean;
  createdAt: string;
}

export interface CreateHandoverInput {
  caseReference: string;
  customerName: string;
  summary: string;
  priority: Priority;
  status: HandoverStatus;
  nextAction: string;
  dueDate: string;
  dueTime: string;
  tags: string[];
}
