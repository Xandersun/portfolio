"use client";

import { CASELOAD, FEATURED_CASE } from "../data";

/**
 * Plain caseload list — every case looks the same until you open it.
 * No attention indicator, no priority signal, nothing to tell the worker
 * which of these six rows is the one that needs a decision today. Only
 * Marisol's row opens here — Before exists to demonstrate the one
 * documented problem, not to be a full parallel system (the After
 * experience is where a second, calm case is also openable).
 */
export function BeforeCaseload({ onSelect }: { onSelect: (caseId: string) => void }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-[#D8DEE8] bg-[#F4F5F7] text-xs text-[#6B7686]">
          <th className="px-4 py-2.5 font-semibold">Participant</th>
          <th className="px-4 py-2.5 font-semibold">Program</th>
          <th className="px-4 py-2.5 font-semibold">Assigned Worker</th>
          <th className="px-4 py-2.5 font-semibold">Last Activity</th>
          <th className="px-4 py-2.5 text-right font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {CASELOAD.map((row) => {
          const openable = row.id === FEATURED_CASE.participantId;
          return (
          <tr
            key={row.id}
            onClick={openable ? () => onSelect(row.id) : undefined}
            className={`border-b border-[#EEF0F3] last:border-0 ${openable ? "cursor-pointer hover:bg-[#F4F5F7]" : "cursor-default text-[#9AA3B2]"}`}
          >
            <td className="px-4 py-2.5 font-medium text-[#1F2937]">
              {row.name}
              <div className="text-xs font-normal text-[#9AA3B2]">{row.id}</div>
            </td>
            <td className="px-4 py-2.5">{row.program}</td>
            <td className="px-4 py-2.5">{row.assignedWorker}</td>
            <td className="px-4 py-2.5">{row.lastActivity}</td>
            <td className="px-4 py-2.5 text-right text-[#6B7686]">Active</td>
          </tr>
          );
        })}
      </tbody>
    </table>
  );
}
