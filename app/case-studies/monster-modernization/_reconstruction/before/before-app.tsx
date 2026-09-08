"use client";

import { FEATURED_CASE } from "../data";
import { BeforeCaseload } from "./before-caseload";
import { BeforeShell } from "./before-shell";
import { BeforeWorkspace } from "./before-workspace";

export function BeforeApp({
  selectedCaseId,
  onSelectCase,
  onBack,
}: {
  selectedCaseId: string | null;
  onSelectCase: (caseId: string) => void;
  onBack: () => void;
}) {
  const caseOpen = selectedCaseId === FEATURED_CASE.participantId;

  return (
    <BeforeShell
      onGoToClientRecords={onBack}
      breadcrumb={
        caseOpen ? (
          <>
            <button onClick={onBack} className="cursor-pointer font-semibold text-[#2B3A55] hover:underline">
              Client Records
            </button>
            &nbsp;›&nbsp; {FEATURED_CASE.participantName}
          </>
        ) : (
          "Client Records"
        )
      }
    >
      {caseOpen ? <BeforeWorkspace record={FEATURED_CASE} /> : <BeforeCaseload onSelect={onSelectCase} />}
    </BeforeShell>
  );
}
