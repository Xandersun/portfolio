export type RiskTier = "High" | "Medium" | "Low";

/** How well a citation holds up against the rest of the evidence pool. */
export type EvidenceStatus = "Corroborated" | "Single-source" | "Conflicting";

/**
 * A signed contribution to the risk score.
 * Positive `impact` elevates execution risk, negative reduces it.
 */
export interface RiskDriver {
  label: string;
  detail: string;
  impact: number;
  /** Citation ids this driver was derived from. */
  derivedFrom: string[];
}

export interface ConfidenceFactor {
  label: string;
  score: number;
  detail: string;
}

export interface Citation {
  id: string;
  title: string;
  publisher: string;
  kind: "Structured" | "Unstructured";
  classification: string;
  retrieved: string;
  /** Share of the evidence pool behind this program's score, in percent. */
  weight: number;
  excerpt: string;
  status: EvidenceStatus;
}

export interface ProvenanceStep {
  stage: string;
  detail: string;
  at: string;
}

export interface Program {
  id: string;
  name: string;
  agency: string;
  budget: string;
  risk: RiskTier;
  confidence: number;
  /** Plain-language account of how the tier was reached. */
  rationale: string;
  drivers: RiskDriver[];
  confidenceFactors: ConfidenceFactor[];
  citations: Citation[];
  provenance: ProvenanceStep[];
  caveats: string[];
  model: {
    name: string;
    version: string;
    runId: string;
    scoredAt: string;
    reviewer: string;
  };
}

export const programs: Program[] = [
  {
    id: "PRG-091",
    name: "Next-Gen Tactical Cloud (N-GTC)",
    agency: "US Army",
    budget: "$482M",
    risk: "Low",
    confidence: 94,
    rationale:
      "Three consecutive marks funded at or above request, a single incumbent holding exercised option years, and no PEO turnover in 24 months. A two-quarter Milestone C slip and a pending IL-6 authorization are the only material drags, and neither has moved the appropriation.",
    drivers: [
      {
        label: "Sustained appropriation history",
        detail: "Funded at or above request across FY25–FY27 marks.",
        impact: -24,
        derivedFrom: ["CIT-091-A"],
      },
      {
        label: "Incumbent option years exercised",
        detail: "No re-compete signal in option-year notices.",
        impact: -18,
        derivedFrom: ["CIT-091-B"],
      },
      {
        label: "Stable program leadership",
        detail: "No PEO or PM turnover recorded in 24 months.",
        impact: -9,
        derivedFrom: ["CIT-091-A", "CIT-091-C"],
      },
      {
        label: "Milestone C schedule slip",
        detail: "Two-quarter variance reported in the Q3 SAR annex.",
        impact: 12,
        derivedFrom: ["CIT-091-C"],
      },
      {
        label: "IL-6 authorization dependency",
        detail: "Full-rate deployment gated on a pending ATO.",
        impact: 8,
        derivedFrom: ["CIT-091-C"],
      },
    ],
    confidenceFactors: [
      {
        label: "Source corroboration",
        score: 96,
        detail: "3 of 3 citations agree on the funding line.",
      },
      {
        label: "Document recency",
        score: 93,
        detail: "Newest source is 11 days old.",
      },
      {
        label: "Extraction fidelity",
        score: 92,
        detail: "Budget line matched to a tabular field, not prose.",
      },
    ],
    citations: [
      {
        id: "CIT-091-A",
        title: "FY27 President's Budget — Army RDT&E, Vol. II, Line 118",
        publisher: "DoD Comptroller",
        kind: "Structured",
        classification: "UNCLASS",
        retrieved: "2026-08-22",
        weight: 46,
        excerpt:
          "Next-Gen Tactical Cloud (N-GTC) … FY27 request $482.0M; FY26 enacted $455.3M; FY25 enacted $431.0M.",
        status: "Corroborated",
      },
      {
        id: "CIT-091-B",
        title: "SAM.gov Award Notice #8841 — Option Year 3 Exercise",
        publisher: "SAM.gov",
        kind: "Structured",
        classification: "UNCLASS",
        retrieved: "2026-08-19",
        weight: 33,
        excerpt:
          "The Government exercises Option Year 3 under the base IDIQ. No follow-on solicitation is contemplated at this time.",
        status: "Corroborated",
      },
      {
        id: "CIT-091-C",
        title: "House Appropriations Mark-up, Vol. IV — Defense Subcommittee",
        publisher: "Congressional Record",
        kind: "Unstructured",
        classification: "UNCLASS",
        retrieved: "2026-08-27",
        weight: 21,
        excerpt:
          "The Committee notes a two-quarter delay to Milestone C attributable to authorization timelines, and directs a quarterly update. Funding is sustained at the requested level.",
        status: "Corroborated",
      },
    ],
    provenance: [
      {
        stage: "Ingest",
        detail: "3 documents retrieved across 2 structured feeds and 1 transcript corpus.",
        at: "2026-08-27 04:12Z",
      },
      {
        stage: "Extraction",
        detail: "Budget lines parsed from tabular fields; narrative claims parsed by span model.",
        at: "2026-08-27 04:19Z",
      },
      {
        stage: "Cross-reference",
        detail: "Appropriation figures reconciled across 3 sources; no conflicts raised.",
        at: "2026-08-27 04:24Z",
      },
      {
        stage: "Scoring",
        detail: "5 drivers weighted; tier assigned Low at 94% confidence.",
        at: "2026-08-27 04:26Z",
      },
    ],
    caveats: [
      "Classified annexes are out of scope; the score reflects unclassified reporting only.",
      "Option-year exercise does not preclude a re-compete announced after the retrieval date.",
    ],
    model: {
      name: "Obviant Acquisition Risk",
      version: "v4.2.1",
      runId: "run_8f31c0",
      scoredAt: "2026-08-27",
      reviewer: "Unreviewed — automated scoring",
    },
  },
  {
    id: "PRG-104",
    name: "Autonomous Maritime Recon System",
    agency: "US Navy",
    budget: "$1.2B",
    risk: "High",
    confidence: 78,
    rationale:
      "The tier is driven by an unresolved requirements dispute in the NAVSEA RFI record and a 41% cost-estimate spread between the program office and CAPE. Two sources disagree on the FY27 top line, which is what holds confidence at 78 rather than the low 90s.",
    drivers: [
      {
        label: "Unresolved requirements churn",
        detail: "Three RFI amendments changed autonomy thresholds in 90 days.",
        impact: 31,
        derivedFrom: ["CIT-104-A"],
      },
      {
        label: "Independent cost-estimate spread",
        detail: "CAPE estimate exceeds program office figure by 41%.",
        impact: 26,
        derivedFrom: ["CIT-104-B"],
      },
      {
        label: "Single-vendor autonomy stack",
        detail: "No qualified second source for the perception subsystem.",
        impact: 17,
        derivedFrom: ["CIT-104-A", "CIT-104-C"],
      },
      {
        label: "Congressional interest sustained",
        detail: "Named in report language for two consecutive cycles.",
        impact: -11,
        derivedFrom: ["CIT-104-B"],
      },
      {
        label: "Prototype fielding demonstrated",
        detail: "Two hulls delivered against the FY26 objective.",
        impact: -14,
        derivedFrom: ["CIT-104-C"],
      },
    ],
    confidenceFactors: [
      {
        label: "Source corroboration",
        score: 62,
        detail: "2 sources disagree on the FY27 top line.",
      },
      {
        label: "Document recency",
        score: 88,
        detail: "Newest source is 6 days old.",
      },
      {
        label: "Extraction fidelity",
        score: 84,
        detail: "Top line inferred from prose; no tabular confirmation.",
      },
    ],
    citations: [
      {
        id: "CIT-104-A",
        title: "NAVSEA RFI Log — Amendments 04 through 06",
        publisher: "NAVSEA",
        kind: "Unstructured",
        classification: "UNCLASS // FOUO",
        retrieved: "2026-08-28",
        weight: 42,
        excerpt:
          "Amendment 06 revises the autonomy threshold from Level 3 to Level 4 for the persistent-surveillance mission profile. Responses previously submitted must be resubmitted.",
        status: "Corroborated",
      },
      {
        id: "CIT-104-B",
        title: "DARPA Industry Day Transcript — Maritime Autonomy Panel",
        publisher: "DARPA",
        kind: "Unstructured",
        classification: "UNCLASS",
        retrieved: "2026-08-25",
        weight: 34,
        excerpt:
          "The independent estimate lands about forty percent above what the program office is carrying. That gap has to close before a production decision.",
        status: "Conflicting",
      },
      {
        id: "CIT-104-C",
        title: "FY27 Navy SCN Justification Book — Excerpt",
        publisher: "DoD Comptroller",
        kind: "Structured",
        classification: "UNCLASS",
        retrieved: "2026-08-14",
        weight: 24,
        excerpt:
          "Two prototype hulls delivered in FY26. FY27 request supports low-rate production pending a Milestone B decision.",
        status: "Conflicting",
      },
    ],
    provenance: [
      {
        stage: "Ingest",
        detail: "3 documents retrieved; 2 of 3 from unstructured corpora.",
        at: "2026-08-28 06:02Z",
      },
      {
        stage: "Extraction",
        detail: "Cost figures resolved by span model; no tabular confirmation available.",
        at: "2026-08-28 06:09Z",
      },
      {
        stage: "Cross-reference",
        detail: "Conflict raised between CIT-104-B and CIT-104-C on the FY27 top line; unresolved.",
        at: "2026-08-28 06:15Z",
      },
      {
        stage: "Scoring",
        detail: "5 drivers weighted; tier assigned High, confidence capped at 78% by the open conflict.",
        at: "2026-08-28 06:17Z",
      },
    ],
    caveats: [
      "The FY27 top line is contested between two sources and has not been reconciled.",
      "Transcript figures are approximations spoken aloud, not published estimates.",
      "Requirements may have changed again after the 2026-08-28 retrieval date.",
    ],
    model: {
      name: "Obviant Acquisition Risk",
      version: "v4.2.1",
      runId: "run_8f31d4",
      scoredAt: "2026-08-28",
      reviewer: "Flagged for analyst review",
    },
  },
  {
    id: "PRG-220",
    name: "AI-Enabled Joint Fires Network",
    agency: "OSD / Joint Staff",
    budget: "$890M",
    risk: "Medium",
    confidence: 88,
    rationale:
      "Joint governance across three services is the dominant risk contributor; funding itself is stable and well documented. The tier sits at Medium because integration authority remains unassigned in the FY27 justification material.",
    drivers: [
      {
        label: "Split integration authority",
        detail: "No single service designated as integrating agent.",
        impact: 28,
        derivedFrom: ["CIT-220-A", "CIT-220-B"],
      },
      {
        label: "Interface standard unratified",
        detail: "Joint data schema still in draft at the time of scoring.",
        impact: 15,
        derivedFrom: ["CIT-220-B"],
      },
      {
        label: "Funding line stable",
        detail: "Request tracks within 2% of the FY26 enacted level.",
        impact: -19,
        derivedFrom: ["CIT-220-A"],
      },
      {
        label: "Multiple qualified vendors",
        detail: "Four responses on the most recent industry day.",
        impact: -13,
        derivedFrom: ["CIT-220-C"],
      },
    ],
    confidenceFactors: [
      {
        label: "Source corroboration",
        score: 91,
        detail: "3 of 3 citations agree on funding; governance is single-sourced.",
      },
      {
        label: "Document recency",
        score: 86,
        detail: "Newest source is 19 days old.",
      },
      {
        label: "Extraction fidelity",
        score: 87,
        detail: "Governance finding drawn from prose in a Q&A transcript.",
      },
    ],
    citations: [
      {
        id: "CIT-220-A",
        title: "J6 Budget Justification Book — Joint Fires, Exhibit R-2",
        publisher: "Joint Staff",
        kind: "Structured",
        classification: "UNCLASS",
        retrieved: "2026-08-14",
        weight: 44,
        excerpt:
          "FY27 request $890.4M against FY26 enacted $874.1M. Program executes across Army, Navy, and Air Force components.",
        status: "Corroborated",
      },
      {
        id: "CIT-220-B",
        title: "Defense One Industry Day — Q&A Transcript",
        publisher: "Defense One",
        kind: "Unstructured",
        classification: "UNCLASS",
        retrieved: "2026-08-11",
        weight: 32,
        excerpt:
          "Asked who owns integration, the panel indicated the designation is still under discussion at the OSD level and no integrating agent has been named.",
        status: "Single-source",
      },
      {
        id: "CIT-220-C",
        title: "Industry Day Attendance & Response Roster",
        publisher: "SAM.gov",
        kind: "Structured",
        classification: "UNCLASS",
        retrieved: "2026-08-09",
        weight: 24,
        excerpt: "Four vendors submitted qualifying white papers against the draft requirement.",
        status: "Corroborated",
      },
    ],
    provenance: [
      {
        stage: "Ingest",
        detail: "3 documents retrieved across 3 distinct publishers.",
        at: "2026-08-14 09:41Z",
      },
      {
        stage: "Extraction",
        detail: "Funding parsed from Exhibit R-2; governance finding parsed from transcript prose.",
        at: "2026-08-14 09:47Z",
      },
      {
        stage: "Cross-reference",
        detail: "Funding reconciled across 3 sources; governance finding left single-sourced.",
        at: "2026-08-14 09:52Z",
      },
      {
        stage: "Scoring",
        detail: "4 drivers weighted; tier assigned Medium at 88% confidence.",
        at: "2026-08-14 09:54Z",
      },
    ],
    caveats: [
      "The integration-authority finding rests on a single transcript and has not been corroborated.",
      "An integrating agent may have been designated after the retrieval date.",
    ],
    model: {
      name: "Obviant Acquisition Risk",
      version: "v4.2.1",
      runId: "run_8e77a2",
      scoredAt: "2026-08-14",
      reviewer: "Reviewed — J. Okafor, 2026-08-18",
    },
  },
  {
    id: "PRG-315",
    name: "Hypersonic Defense Sensors",
    agency: "MDA",
    budget: "$2.4B",
    risk: "Medium",
    confidence: 85,
    rationale:
      "A well-funded line with strong hearing-record support, offset by supplier concentration in the focal-plane array and a contractor performance rating that dropped a band year over year.",
    drivers: [
      {
        label: "Focal-plane supplier concentration",
        detail: "One qualified foundry for the sensor array.",
        impact: 29,
        derivedFrom: ["CIT-315-B"],
      },
      {
        label: "Performance rating decline",
        detail: "CPARS rating fell from Exceptional to Very Good.",
        impact: 18,
        derivedFrom: ["CIT-315-C"],
      },
      {
        label: "Test schedule compression",
        detail: "Two flight tests consolidated into one window.",
        impact: 10,
        derivedFrom: ["CIT-315-A"],
      },
      {
        label: "Strong appropriations support",
        detail: "Plussed up $180M above request in the FY27 mark.",
        impact: -26,
        derivedFrom: ["CIT-315-A"],
      },
      {
        label: "Mature production baseline",
        detail: "Fourth production lot delivered on the contracted schedule.",
        impact: -12,
        derivedFrom: ["CIT-315-C"],
      },
    ],
    confidenceFactors: [
      {
        label: "Source corroboration",
        score: 89,
        detail: "3 of 3 citations agree on funding and lot status.",
      },
      {
        label: "Document recency",
        score: 79,
        detail: "Newest source is 34 days old.",
      },
      {
        label: "Extraction fidelity",
        score: 88,
        detail: "Supplier finding parsed from hearing testimony.",
      },
    ],
    citations: [
      {
        id: "CIT-315-A",
        title: "MDA Congressional Hearing Record — FY27 Posture",
        publisher: "Senate Armed Services Committee",
        kind: "Unstructured",
        classification: "UNCLASS",
        retrieved: "2026-07-30",
        weight: 41,
        excerpt:
          "The Committee adds $180.0M above the request for sensor production and directs consolidation of the FY27 flight-test windows.",
        status: "Corroborated",
      },
      {
        id: "CIT-315-B",
        title: "Supplier Qualification Registry — Focal Plane Arrays",
        publisher: "MDA Industrial Base Office",
        kind: "Structured",
        classification: "UNCLASS // FOUO",
        retrieved: "2026-07-24",
        weight: 33,
        excerpt: "Qualified sources for the LWIR focal-plane array: 1. Second-source qualification in progress.",
        status: "Single-source",
      },
      {
        id: "CIT-315-C",
        title: "Contractor Performance Assessment Report (CPARS) Summary",
        publisher: "DoD CPARS",
        kind: "Structured",
        classification: "UNCLASS // FOUO",
        retrieved: "2026-07-19",
        weight: 26,
        excerpt:
          "Overall rating: Very Good (prior period: Exceptional). Lot 4 delivered within the contracted schedule.",
        status: "Corroborated",
      },
    ],
    provenance: [
      {
        stage: "Ingest",
        detail: "3 documents retrieved; 2 carry FOUO handling markings.",
        at: "2026-07-30 13:20Z",
      },
      {
        stage: "Extraction",
        detail: "Supplier count read from the registry; test guidance parsed from hearing prose.",
        at: "2026-07-30 13:26Z",
      },
      {
        stage: "Cross-reference",
        detail: "Funding and lot status reconciled across 3 sources; no conflicts raised.",
        at: "2026-07-30 13:31Z",
      },
      {
        stage: "Scoring",
        detail: "5 drivers weighted; tier assigned Medium at 85% confidence.",
        at: "2026-07-30 13:33Z",
      },
    ],
    caveats: [
      "The newest source is 34 days old; recency is the weakest confidence factor here.",
      "Second-source qualification status may have advanced since retrieval.",
    ],
    model: {
      name: "Obviant Acquisition Risk",
      version: "v4.2.1",
      runId: "run_8d02b9",
      scoredAt: "2026-07-30",
      reviewer: "Reviewed — M. Delacroix, 2026-08-04",
    },
  },
];
