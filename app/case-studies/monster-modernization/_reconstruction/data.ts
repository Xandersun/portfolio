import type { CaseloadRow, CaseRecord } from "./types";

/**
 * Fictional demonstration data only. No real participants, no real PII.
 *
 * Deliberately built inside the SAME fictional social-services universe
 * as the Living Design System's own case data (lib/portfolio-v2/cases.ts):
 * same case workers (R. Whitfield, S. Boateng), the same program roster
 * (Employment Services, SNAP, TANF, Medicaid, Housing Assistance), and
 * the same case-status vocabulary. This is a demonstration choice, not a
 * claim about what Monster Government Solutions' Customer experience
 * actually managed historically — see the case-study copy above this
 * reconstruction for the full disclosure.
 *
 * Two cases are openable in the After experience: Marisol Vega (the
 * primary task — a document blocking eligibility, blocking a referral,
 * against an approaching deadline) and Anna Kowalski (a calm, healthy
 * case with no open issues), used to show the workspace's empty states
 * honestly rather than only ever showing a crisis. Every cross-reference
 * inside Marisol's record — the outstanding document, the task it
 * spawned, the note explaining the delay, the referral it's blocking,
 * the deadline it's racing — points at the same underlying case, so
 * Before and After are demonstrably rendering identical data through
 * different structures, not two different scenarios.
 */

export const FEATURED_CASE: CaseRecord = {
  participantName: "Marisol Vega",
  participantId: "PTC-04871",
  program: "Employment Services",
  caseId: "CASE-4901",
  statusLabel: "Follow-up Required",
  eligibilityStatus: "Verification Needed",
  priority: "High",
  nextAction: "Follow up on outstanding Proof of Income before the Jul 1 determination deadline",
  assignedWorker: "R. Whitfield — Case Worker",
  supportingStaff: "S. Boateng — Employment Specialist",
  eligibilityDeadline: {
    label: "Eligibility determination due",
    date: "Jul 1",
    note: "90-day determination window",
  },
  milestones: [
    { id: "enrolled", label: "Enrolled", status: "done" },
    { id: "assessed", label: "Assessed", status: "done" },
    { id: "eligibility", label: "Eligibility Determined", status: "current" },
    { id: "referred", label: "Training Referred", status: "upcoming" },
    { id: "placed", label: "Placed", status: "upcoming" },
  ],
  attentionItems: [
    {
      id: "income-doc",
      label: "Proof of Income overdue — 36 days",
      detail: "Blocking the eligibility determination and the training referral below.",
      linkedDocumentId: "income",
    },
    {
      id: "referral-hold",
      label: "Training referral on hold",
      detail: "Cascade Technical Institute funding can't be authorized until eligibility is determined.",
      linkedDocumentId: "income",
    },
    {
      id: "deadline",
      label: "Eligibility determination due in 21 days",
      detail: "90-day window closes Jul 1 — the outstanding document is the only blocker.",
      linkedDocumentId: "income",
    },
  ],
  documents: [
    { id: "separation", label: "Employer Separation Notice", status: "received", receivedDate: "Apr 5" },
    { id: "income", label: "Proof of Income", status: "outstanding", requestedDate: "Apr 5", dueDate: "May 1" },
    { id: "identity", label: "Identity Verification", status: "due-soon", requestedDate: "May 28", dueDate: "Jun 10" },
    { id: "enrollment-agreement", label: "Training Provider Enrollment Agreement", status: "not-yet-due", dueDate: "Jul 15" },
  ],
  tasks: [
    { id: "welcome-packet", label: "Send intake welcome packet", assignee: "R. Whitfield", dueDate: "Apr 3", status: "completed" },
    { id: "follow-up-income", label: "Follow up: request updated income documentation", assignee: "R. Whitfield", dueDate: "May 5", status: "overdue" },
    { id: "confirm-seat", label: "Confirm training seat availability with Cascade Technical", assignee: "S. Boateng", dueDate: "Jun 20", status: "open" },
    { id: "review-identity", label: "Review identity verification once submitted", assignee: "R. Whitfield", dueDate: "Jun 12", status: "open" },
  ],
  referrals: [
    { id: "orientation", provider: "Regional Career Center", service: "Intake Orientation Workshop", referredDate: "Apr 8", status: "completed" },
    {
      id: "cnc-training",
      provider: "Cascade Technical Institute",
      service: "CNC Machinist Certification Program",
      referredDate: "Apr 18",
      status: "on-hold",
      blockedByDocumentId: "income",
      note: "Funding authorization pending eligibility determination.",
    },
  ],
  appointments: [
    { id: "appt-orientation", date: "Apr 8", purpose: "Intake Orientation", status: "completed" },
    { id: "appt-followup", date: "Jun 12", purpose: "Eligibility Follow-Up Call", status: "upcoming" },
  ],
  notes: [
    {
      id: "note-intake",
      author: "R. Whitfield",
      date: "Apr 8",
      body: "Completed intake orientation. Participant is motivated and has identified CNC machining as target occupation based on prior manufacturing experience.",
    },
    {
      id: "note-checkin",
      author: "R. Whitfield",
      date: "Apr 15",
      body: "Routine 2-week check-in. Participant confirmed continued interest in Cascade Technical's certification program; no additional needs identified at this time.",
    },
    {
      id: "note-followup",
      author: "R. Whitfield",
      date: "Apr 22",
      body: "Left voicemail regarding outstanding income verification. Participant reported a recent address change and may not have received the mailed request. Re-sending electronically.",
    },
  ],
  activity: [
    { id: "a1", date: "Apr 2", actor: "System", description: "Case created; enrolled in Employment Services" },
    { id: "a2", date: "Apr 2", actor: "System", description: "Task assigned — Send intake welcome packet (R. Whitfield)" },
    { id: "a3", date: "Apr 5", actor: "System", description: "Employer Separation Notice received" },
    { id: "a4", date: "Apr 5", actor: "System", description: "Proof of Income requested" },
    { id: "a5", date: "Apr 8", actor: "R. Whitfield", description: "Intake orientation completed; case note added" },
    { id: "a6", date: "Apr 15", actor: "R. Whitfield", description: "Case note added — routine check-in" },
    { id: "a7", date: "Apr 18", actor: "S. Boateng", description: "Referred to Cascade Technical Institute — CNC Machinist Certification" },
    { id: "a8", date: "Apr 20", actor: "System", description: "Reminder sent for Proof of Income" },
    { id: "a9", date: "Apr 22", actor: "R. Whitfield", description: "Case note added — phone follow-up on outstanding document" },
    { id: "a10", date: "Apr 23", actor: "System", description: "Proof of Income re-requested via email" },
    { id: "a11", date: "May 1", actor: "System", description: "Proof of Income became overdue" },
    { id: "a12", date: "May 6", actor: "System", description: "Training referral placed on hold pending eligibility determination" },
    { id: "a13", date: "May 28", actor: "System", description: "Identity Verification requested" },
    { id: "a14", date: "Jun 1", actor: "System", description: "Eligibility review updated — status remains Verification Needed pending Proof of Income" },
  ],
  relatedRecords: [
    { label: "Prior Program Episode", description: "Rapid Response orientation attended at time of layoff (Redline Fabrication plant closure), Mar 18." },
  ],
};

/**
 * A calm, no-issues case — used only to demonstrate the After workspace's
 * empty states (no attention items, no open tasks, no referrals, no
 * notes) honestly, rather than only ever showing a case in crisis.
 */
export const SECOND_CASE: CaseRecord = {
  participantName: "Anna Kowalski",
  participantId: "PTC-04711",
  program: "Housing Assistance",
  caseId: "CASE-4933",
  statusLabel: "Benefits Active",
  eligibilityStatus: "Eligible",
  priority: "Low",
  nextAction: "None — case in good standing until next recertification",
  assignedWorker: "R. Whitfield — Case Worker",
  supportingStaff: "S. Boateng — Employment Specialist",
  eligibilityDeadline: {
    label: "Next recertification",
    date: "Jan 15",
    note: "Annual recertification cycle",
  },
  milestones: [
    { id: "enrolled", label: "Enrolled", status: "done" },
    { id: "verified", label: "Verified", status: "done" },
    { id: "active", label: "Benefits Active", status: "current" },
  ],
  attentionItems: [],
  documents: [
    { id: "income-anna", label: "Proof of Income", status: "received", receivedDate: "Feb 2" },
    { id: "lease-anna", label: "Lease Agreement", status: "received", receivedDate: "Feb 2" },
  ],
  tasks: [],
  referrals: [],
  appointments: [{ id: "appt-anna-1", date: "Feb 5", purpose: "Intake Review", status: "completed" }],
  notes: [],
  activity: [
    { id: "b1", date: "Feb 1", actor: "System", description: "Case created; enrolled in Housing Assistance" },
    { id: "b2", date: "Feb 2", actor: "System", description: "Proof of Income and Lease Agreement received" },
    { id: "b3", date: "Feb 5", actor: "R. Whitfield", description: "Intake review completed; benefits activated" },
  ],
  relatedRecords: [],
};

export function getCaseRecord(participantId: string): CaseRecord | undefined {
  return [FEATURED_CASE, SECOND_CASE].find((c) => c.participantId === participantId);
}

export const CASELOAD: CaseloadRow[] = [
  {
    id: "PTC-04871",
    caseId: "CASE-4901",
    name: "Marisol Vega",
    program: "Employment Services",
    assignedWorker: "R. Whitfield",
    statusLabel: "Follow-up Required",
    priority: "High",
    nextAction: "Follow up on outstanding Proof of Income",
    needsAttention: true,
    dueThisWeek: true,
    recentlyUpdated: true,
    openable: true,
    lastActivity: "Jun 1",
  },
  {
    id: "PTC-04766",
    caseId: "CASE-4822",
    name: "Devon Okafor",
    program: "SNAP",
    assignedWorker: "S. Boateng",
    statusLabel: "Benefits Active",
    priority: "Low",
    nextAction: "Recertification due 2026-11-02",
    needsAttention: false,
    dueThisWeek: false,
    recentlyUpdated: false,
    openable: false,
    lastActivity: "Apr 20",
  },
  {
    id: "PTC-04902",
    caseId: "CASE-4877",
    name: "Priya Chandrasekaran",
    program: "TANF",
    assignedWorker: "R. Whitfield",
    statusLabel: "Pending Review",
    priority: "Medium",
    nextAction: "Awaiting updated income verification",
    needsAttention: true,
    dueThisWeek: false,
    recentlyUpdated: true,
    openable: false,
    lastActivity: "May 30",
  },
  {
    id: "PTC-04588",
    caseId: "CASE-4650",
    name: "Terrence Boyd",
    program: "Medicaid",
    assignedWorker: "S. Boateng",
    statusLabel: "Referral Pending",
    priority: "Medium",
    nextAction: "Awaiting Housing Assistance referral response",
    needsAttention: false,
    dueThisWeek: true,
    recentlyUpdated: true,
    openable: false,
    lastActivity: "May 29",
  },
  {
    id: "PTC-04711",
    caseId: "CASE-4933",
    name: "Anna Kowalski",
    program: "Housing Assistance",
    assignedWorker: "R. Whitfield",
    statusLabel: "Benefits Active",
    priority: "Low",
    nextAction: "None — case in good standing",
    needsAttention: false,
    dueThisWeek: false,
    recentlyUpdated: false,
    openable: true,
    lastActivity: "Feb 5",
  },
  {
    id: "PTC-04833",
    caseId: "CASE-4711",
    name: "Luis Fontaine",
    program: "Employment Services",
    assignedWorker: "S. Boateng",
    statusLabel: "Recertification Due",
    priority: "Medium",
    nextAction: "Schedule recertification appointment",
    needsAttention: true,
    dueThisWeek: true,
    recentlyUpdated: false,
    openable: false,
    lastActivity: "Apr 27",
  },
];
