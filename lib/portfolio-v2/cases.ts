/**
 * portfolio-v2 / Living Design System — isolated case-management dataset.
 * Content-only counterpart to lib/programs.ts (which stays untouched and
 * keeps serving the original, unmodified /sandbox). Same shape of
 * structural idea (a record + rich drill-down detail for the split-screen
 * inspector and AG Grid views), entirely fictional social-services demo
 * content instead of defense-acquisition content.
 */

export type EligibilityStatus = "Eligible" | "Ineligible" | "Pending Review" | "Verification Needed";
export type CaseStatusValue =
  | "Application Received"
  | "Pending Review"
  | "Benefits Active"
  | "Recertification Due"
  | "Referral Pending"
  | "Follow-up Required"
  | "Case Closed";
export type Priority = "Low" | "Medium" | "High";

/** How well a piece of documentation holds up against the rest of the case file. */
export type DocumentStatus = "Verified" | "Self-reported" | "Conflicting";

/** A signed contribution to the eligibility-confidence score. */
export interface EligibilityFactor {
  label: string;
  detail: string;
  impact: number;
  derivedFrom: string[];
}

export interface ConfidenceFactor {
  label: string;
  score: number;
  detail: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  source: string;
  kind: "Structured" | "Unstructured";
  retrieved: string;
  /** Share of the verification file this document accounts for, in percent. */
  weight: number;
  excerpt: string;
  status: DocumentStatus;
}

export interface TimelineStep {
  stage: string;
  detail: string;
  at: string;
}

export interface CaseRecord {
  id: string;
  participant: string;
  program: string;
  assignedWorker: string;
  applicationDate: string;
  eligibilityStatus: EligibilityStatus;
  caseStatus: CaseStatusValue;
  priority: Priority;
  nextAction: string;
  lastUpdated: string;
  /** Eligibility-confidence score, 0-100. */
  confidence: number;
  rationale: string;
  factors: EligibilityFactor[];
  confidenceFactors: ConfidenceFactor[];
  documents: CaseDocument[];
  timeline: TimelineStep[];
  caveats: string[];
  determination: {
    name: string;
    version: string;
    runId: string;
    determinedAt: string;
    reviewer: string;
  };
}

export const PRIORITY_COLOR: Record<Priority, string> = { Low: "success", Medium: "warning", High: "error" };

export const cases: CaseRecord[] = [
  {
    id: "CASE-4821",
    participant: "M. Delgado",
    program: "SNAP",
    assignedWorker: "R. Whitfield",
    applicationDate: "2026-08-02",
    eligibilityStatus: "Eligible",
    caseStatus: "Benefits Active",
    priority: "Low",
    nextAction: "Recertification due 2027-02-02",
    lastUpdated: "2026-08-27",
    confidence: 94,
    rationale:
      "Income and household size are corroborated across three sources with no conflicts, and the participant has a clean 18-month benefits history with no missed recertifications. A minor address-verification gap and a pending employer-hours update are the only open items, and neither affects the current determination.",
    factors: [
      {
        label: "Income fully verified",
        detail: "Pay stubs and employer statement agree within $12/month.",
        impact: -22,
        derivedFrom: ["DOC-4821-A"],
      },
      {
        label: "Stable benefits history",
        detail: "No missed recertifications or eligibility gaps in 18 months.",
        impact: -16,
        derivedFrom: ["DOC-4821-B"],
      },
      {
        label: "Household composition confirmed",
        detail: "Lease and prior intake agree on household size.",
        impact: -9,
        derivedFrom: ["DOC-4821-A", "DOC-4821-C"],
      },
      {
        label: "Address verification pending",
        detail: "Updated utility bill requested but not yet received.",
        impact: 7,
        derivedFrom: ["DOC-4821-C"],
      },
      {
        label: "Employer-hours update pending",
        detail: "Recent shift change reported verbally, not yet documented.",
        impact: 6,
        derivedFrom: ["DOC-4821-B"],
      },
    ],
    confidenceFactors: [
      { label: "Document corroboration", score: 95, detail: "3 of 3 documents agree on household income." },
      { label: "Document recency", score: 91, detail: "Newest document is 9 days old." },
      { label: "Extraction fidelity", score: 93, detail: "Income matched to a tabular pay-stub field." },
    ],
    documents: [
      {
        id: "DOC-4821-A",
        title: "Employer Wage Statement — Pay Periods 14–17",
        source: "Employer Verification Portal",
        kind: "Structured",
        retrieved: "2026-08-22",
        weight: 44,
        excerpt: "Gross pay $1,840.00 biweekly across 4 consecutive pay periods, consistent with prior filing.",
        status: "Verified",
      },
      {
        id: "DOC-4821-B",
        title: "SNAP Recertification Interview Notes",
        source: "Case Worker Intake",
        kind: "Unstructured",
        retrieved: "2026-08-19",
        weight: 33,
        excerpt: "Participant reports a recent increase in scheduled hours; updated pay documentation to follow.",
        status: "Self-reported",
      },
      {
        id: "DOC-4821-C",
        title: "Lease Agreement — Household Members",
        source: "Participant Upload",
        kind: "Structured",
        retrieved: "2026-08-05",
        weight: 23,
        excerpt: "Household of 3 listed on the lease, matching the prior year's determination.",
        status: "Verified",
      },
    ],
    timeline: [
      { stage: "Intake", detail: "Recertification packet received via online portal.", at: "2026-08-02 09:14" },
      { stage: "Document review", detail: "Wage statement and lease matched against case file.", at: "2026-08-22 11:03" },
      { stage: "Verification", detail: "Household income and composition reconciled; no conflicts raised.", at: "2026-08-24 14:40" },
      { stage: "Determination", detail: "5 factors weighted; eligibility confirmed at 94% confidence.", at: "2026-08-27 10:12" },
    ],
    caveats: [
      "Updated address documentation is outstanding and does not currently affect eligibility.",
      "Employer-hours change may require a mid-certification review once documented.",
    ],
    determination: {
      name: "Eligibility Determination Engine",
      version: "v3.1.0",
      runId: "run_2f61a8",
      determinedAt: "2026-08-27",
      reviewer: "Unreviewed — automated determination",
    },
  },
  {
    id: "CASE-4796",
    participant: "T. Nakamura",
    program: "TANF",
    assignedWorker: "S. Boateng",
    applicationDate: "2026-08-11",
    eligibilityStatus: "Verification Needed",
    caseStatus: "Pending Review",
    priority: "High",
    nextAction: "Request updated income verification",
    lastUpdated: "2026-08-28",
    confidence: 68,
    rationale:
      "Two income sources disagree on hours worked, and a duplicate-application flag was raised against a case opened in a neighboring county. Neither issue is disqualifying on its own, but together they hold confidence below the threshold for an automatic determination.",
    factors: [
      {
        label: "Conflicting income documentation",
        detail: "Self-reported hours differ from employer statement by 14 hours/week.",
        impact: 27,
        derivedFrom: ["DOC-4796-A"],
      },
      {
        label: "Possible duplicate application",
        detail: "Matching participant name and DOB found in an out-of-county case.",
        impact: 24,
        derivedFrom: ["DOC-4796-B"],
      },
      {
        label: "Missing childcare verification",
        detail: "Childcare expense claimed but no invoice on file.",
        impact: 13,
        derivedFrom: ["DOC-4796-C"],
      },
      {
        label: "Prior program participation in good standing",
        detail: "No sanctions or overpayments in Employment Services history.",
        impact: -12,
        derivedFrom: ["DOC-4796-B"],
      },
    ],
    confidenceFactors: [
      { label: "Document corroboration", score: 58, detail: "2 sources disagree on weekly hours worked." },
      { label: "Document recency", score: 84, detail: "Newest document is 6 days old." },
      { label: "Extraction fidelity", score: 80, detail: "Hours figure parsed from a scanned timesheet, not a tabular field." },
    ],
    documents: [
      {
        id: "DOC-4796-A",
        title: "Employer Timesheet Scan — Weeks 31–33",
        source: "Participant Upload",
        kind: "Unstructured",
        retrieved: "2026-08-24",
        weight: 41,
        excerpt: "Handwritten timesheet shows 26 hours/week; intake interview recorded 40 hours/week.",
        status: "Conflicting",
      },
      {
        id: "DOC-4796-B",
        title: "Statewide Case Duplication Check",
        source: "Eligibility System Cross-Reference",
        kind: "Structured",
        retrieved: "2026-08-25",
        weight: 35,
        excerpt: "Name and date-of-birth match found against an open case in an adjacent county office.",
        status: "Conflicting",
      },
      {
        id: "DOC-4796-C",
        title: "Childcare Assistance Worksheet",
        source: "Case Worker Intake",
        kind: "Unstructured",
        retrieved: "2026-08-11",
        weight: 24,
        excerpt: "Participant claims weekly childcare cost of $190; no provider invoice attached.",
        status: "Self-reported",
      },
    ],
    timeline: [
      { stage: "Intake", detail: "Application submitted in person at the county office.", at: "2026-08-11 13:02" },
      { stage: "Document review", detail: "Timesheet scan and childcare worksheet logged to case file.", at: "2026-08-24 09:18" },
      { stage: "Cross-reference", detail: "Duplicate-case flag raised against an adjacent county; unresolved.", at: "2026-08-25 08:44" },
      { stage: "Determination", detail: "4 factors weighted; routed to manual review at 68% confidence.", at: "2026-08-28 15:20" },
    ],
    caveats: [
      "The hours discrepancy has not been reconciled with the participant.",
      "Duplicate-case flag requires coordination with the adjacent county office before determination.",
    ],
    determination: {
      name: "Eligibility Determination Engine",
      version: "v3.1.0",
      runId: "run_2f62d1",
      determinedAt: "2026-08-28",
      reviewer: "Flagged for case worker review",
    },
  },
  {
    id: "CASE-4750",
    participant: "A. Okafor",
    program: "Medicaid",
    assignedWorker: "R. Whitfield",
    applicationDate: "2026-07-29",
    eligibilityStatus: "Pending Review",
    caseStatus: "Referral Pending",
    priority: "Medium",
    nextAction: "Awaiting Housing Assistance referral response",
    lastUpdated: "2026-08-14",
    confidence: 86,
    rationale:
      "Income and household size are well documented, and the primary open item is a pending referral to Housing Assistance for a co-located application rather than a gap in the Medicaid file itself. The tier sits at Medium pending that referral's outcome.",
    factors: [
      {
        label: "Referral outcome pending",
        detail: "Housing Assistance eligibility not yet confirmed; may affect household composition.",
        impact: 18,
        derivedFrom: ["DOC-4750-A", "DOC-4750-B"],
      },
      {
        label: "Income within threshold",
        detail: "Verified income sits comfortably under the program limit.",
        impact: -21,
        derivedFrom: ["DOC-4750-A"],
      },
      {
        label: "Multiple supporting documents on file",
        detail: "Pay stub, ID, and prior enrollment record all corroborate.",
        impact: -14,
        derivedFrom: ["DOC-4750-C"],
      },
    ],
    confidenceFactors: [
      { label: "Document corroboration", score: 90, detail: "3 of 3 documents agree on income and identity." },
      { label: "Document recency", score: 85, detail: "Newest document is 16 days old." },
      { label: "Extraction fidelity", score: 88, detail: "Income confirmed from a structured wage record." },
    ],
    documents: [
      {
        id: "DOC-4750-A",
        title: "State Wage Verification Record",
        source: "State Income Verification System",
        kind: "Structured",
        retrieved: "2026-08-08",
        weight: 43,
        excerpt: "Quarterly wage record shows income consistent with the application, within the Medicaid threshold.",
        status: "Verified",
      },
      {
        id: "DOC-4750-B",
        title: "Housing Assistance Referral Log",
        source: "Interagency Referral Queue",
        kind: "Structured",
        retrieved: "2026-08-14",
        weight: 32,
        excerpt: "Referral submitted 2026-08-01; Housing Assistance has not yet returned a determination.",
        status: "Self-reported",
      },
      {
        id: "DOC-4750-C",
        title: "Prior Enrollment Record",
        source: "Case Management System",
        kind: "Structured",
        retrieved: "2026-07-29",
        weight: 25,
        excerpt: "Participant was previously enrolled in Medicaid for 14 months with no compliance issues.",
        status: "Verified",
      },
    ],
    timeline: [
      { stage: "Intake", detail: "Application received alongside a Housing Assistance referral.", at: "2026-07-29 10:40" },
      { stage: "Document review", detail: "Wage record and prior enrollment matched to case file.", at: "2026-08-08 09:55" },
      { stage: "Referral", detail: "Housing Assistance referral submitted; awaiting response.", at: "2026-08-14 12:10" },
      { stage: "Determination", detail: "3 factors weighted; held at Medium pending referral outcome.", at: "2026-08-14 12:15" },
    ],
    caveats: [
      "Final determination may change once the Housing Assistance referral resolves.",
      "Household composition could be revised depending on the referral outcome.",
    ],
    determination: {
      name: "Eligibility Determination Engine",
      version: "v3.1.0",
      runId: "run_2f5e90",
      determinedAt: "2026-08-14",
      reviewer: "Reviewed — R. Whitfield, 2026-08-14",
    },
  },
  {
    id: "CASE-4712",
    participant: "K. Vance",
    program: "Employment Services",
    assignedWorker: "S. Boateng",
    applicationDate: "2026-07-14",
    eligibilityStatus: "Eligible",
    caseStatus: "Follow-up Required",
    priority: "Medium",
    nextAction: "Schedule 30-day employment check-in",
    lastUpdated: "2026-07-30",
    confidence: 90,
    rationale:
      "Enrollment requirements are fully met and documentation is corroborated across all sources. The case is in good standing; the only open item is a routine 30-day follow-up check-in, standard for this program.",
    factors: [
      {
        label: "Enrollment requirements met",
        detail: "Orientation and skills assessment both completed on schedule.",
        impact: -19,
        derivedFrom: ["DOC-4712-A"],
      },
      {
        label: "Job-search log up to date",
        detail: "Weekly job-search log submitted on time for 6 consecutive weeks.",
        impact: -15,
        derivedFrom: ["DOC-4712-B"],
      },
      {
        label: "Routine follow-up scheduled",
        detail: "Standard 30-day check-in due; not indicative of any concern.",
        impact: 4,
        derivedFrom: ["DOC-4712-C"],
      },
    ],
    confidenceFactors: [
      { label: "Document corroboration", score: 93, detail: "All required enrollment documents on file." },
      { label: "Document recency", score: 96, detail: "Newest document is 3 days old." },
      { label: "Extraction fidelity", score: 91, detail: "Job-search log matched to a structured weekly submission." },
    ],
    documents: [
      {
        id: "DOC-4712-A",
        title: "Orientation & Skills Assessment Completion Record",
        source: "Employment Services Case System",
        kind: "Structured",
        retrieved: "2026-07-16",
        weight: 40,
        excerpt: "Orientation completed 2026-07-15; skills assessment score on file.",
        status: "Verified",
      },
      {
        id: "DOC-4712-B",
        title: "Weekly Job-Search Log — Weeks 1–6",
        source: "Participant Portal",
        kind: "Structured",
        retrieved: "2026-07-28",
        weight: 36,
        excerpt: "6 consecutive weekly logs submitted, each listing 3 or more employer contacts.",
        status: "Verified",
      },
      {
        id: "DOC-4712-C",
        title: "Case Note — 30-Day Check-in Scheduled",
        source: "Case Worker Intake",
        kind: "Unstructured",
        retrieved: "2026-07-30",
        weight: 24,
        excerpt: "Standard 30-day check-in scheduled for 2026-08-13; no issues noted.",
        status: "Self-reported",
      },
    ],
    timeline: [
      { stage: "Intake", detail: "Enrollment application received.", at: "2026-07-14 08:30" },
      { stage: "Document review", detail: "Orientation and assessment records confirmed.", at: "2026-07-16 09:00" },
      { stage: "Compliance check", detail: "Weekly job-search logs reconciled; all on time.", at: "2026-07-28 16:45" },
      { stage: "Determination", detail: "3 factors weighted; eligibility confirmed at 90% confidence.", at: "2026-07-30 11:05" },
    ],
    caveats: ["Follow-up check-in outcome will be logged as a new case note once completed."],
    determination: {
      name: "Eligibility Determination Engine",
      version: "v3.1.0",
      runId: "run_2f4c22",
      determinedAt: "2026-07-30",
      reviewer: "Reviewed — S. Boateng, 2026-07-30",
    },
  },
];
