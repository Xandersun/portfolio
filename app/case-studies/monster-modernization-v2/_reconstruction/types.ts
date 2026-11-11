import type { Priority } from "@/lib/portfolio-v2/cases";

/**
 * Interactive Reconstruction — fictional data model.
 * Domain-neutral shape (case identity, plan progress, eligibility,
 * documents, tasks, referrals, notes, activity, related records) that can
 * be relabeled for a different domain later without restructuring these
 * types. Labels/actors/programs in data.ts deliberately reuse the same
 * fictional social-services universe already established by the Living
 * Design System (lib/portfolio-v2/cases.ts) — same case workers, same
 * program names, same case-status vocabulary — rather than inventing a
 * disconnected demo domain. This is a demonstration choice, not a
 * confirmed historical fact about Monster Government Solutions — see the
 * case-study copy for the disclosure. `Priority` is imported directly
 * from that file (not redeclared) so the color treatment matches exactly.
 */

export type { Priority };
export type DocumentStatus = "received" | "outstanding" | "due-soon" | "not-yet-due";
export type TaskStatus = "completed" | "open" | "overdue";
export type ReferralStatus = "completed" | "on-hold" | "scheduled";
export type AppointmentStatus = "completed" | "upcoming";
export type MilestoneStatus = "done" | "current" | "upcoming";

export interface Milestone {
  id: string;
  label: string;
  status: MilestoneStatus;
}

export interface AttentionItem {
  id: string;
  label: string;
  detail: string;
  linkedDocumentId?: string;
}

export interface DocumentItem {
  id: string;
  label: string;
  status: DocumentStatus;
  requestedDate?: string;
  dueDate?: string;
  receivedDate?: string;
}

export interface TaskItem {
  id: string;
  label: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
}

export interface ReferralItem {
  id: string;
  provider: string;
  service: string;
  referredDate: string;
  status: ReferralStatus;
  blockedByDocumentId?: string;
  note?: string;
}

export interface AppointmentItem {
  id: string;
  date: string;
  purpose: string;
  status: AppointmentStatus;
}

export interface CaseNoteItem {
  id: string;
  author: string;
  date: string;
  body: string;
}

export interface ActivityItem {
  id: string;
  date: string;
  actor: string;
  description: string;
}

export interface RelatedRecord {
  label: string;
  description: string;
}

export interface CaseRecord {
  participantName: string;
  participantId: string;
  program: string;
  caseId: string;
  statusLabel: string;
  eligibilityStatus: string;
  priority: Priority;
  nextAction: string;
  assignedWorker: string;
  supportingStaff: string;
  eligibilityDeadline: { label: string; date: string; note: string };
  milestones: Milestone[];
  attentionItems: AttentionItem[];
  documents: DocumentItem[];
  tasks: TaskItem[];
  referrals: ReferralItem[];
  appointments: AppointmentItem[];
  notes: CaseNoteItem[];
  activity: ActivityItem[];
  relatedRecords: RelatedRecord[];
}

export interface CaseloadRow {
  id: string;
  caseId: string;
  name: string;
  program: string;
  assignedWorker: string;
  statusLabel: string;
  priority: Priority;
  nextAction: string;
  needsAttention: boolean;
  dueThisWeek: boolean;
  recentlyUpdated: boolean;
  /** Openable in the After caseload for this exploratory pass — Marisol (the primary task) and Anna (a calm, no-attention case used to demonstrate empty states). Every other row is real data but not wired to a detail view, matching the existing "inert but present" convention. */
  openable: boolean;
  lastActivity: string;
}
