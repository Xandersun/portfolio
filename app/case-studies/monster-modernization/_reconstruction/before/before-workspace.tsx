"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { CaseRecord } from "../types";
import { documentLabel, documentTone, referralTone, taskTone, StatusBadge } from "../status-badge";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "contact", label: "Contact Info" },
  { value: "documents", label: "Case Documents" },
  { value: "appointments", label: "Appointment History" },
  { value: "notes", label: "Case Notes" },
  { value: "billing", label: "Billing Details" },
  { value: "activity", label: "Event Log" },
  { value: "referrals", label: "Referrals" },
];

/**
 * Customer-level + nested + tertiary navigation, all in one legacy
 * workspace, sitting inside BeforeShell's global left nav + application
 * header. A Profile/Dashboard toggle competes with a tab bar wide enough
 * to require cycling arrows (customer-level); Case Notes reveals its own
 * Add Note / View All Notes / Recent Notes destinations without leaving
 * the tab (nested); Referrals splits into Active/Completed (tertiary).
 * Nothing here hides information — the outstanding document, the note
 * explaining it, and the blocked referral are all present, and each tab
 * carries real, substantive content — but nothing connects them across
 * these destinations, so reconstructing the story means visiting several
 * of them and holding the thread yourself. That illustrates the
 * historical critique; it is not a claim about specific Monster screens.
 */
export function BeforeWorkspace({ record }: { record: CaseRecord }) {
  const [view, setView] = useState<"profile" | "dashboard">("profile");
  const [activeTab, setActiveTab] = useState("overview");
  const [notesSub, setNotesSub] = useState<"add" | "all" | "recent">("all");
  const [referralsSub, setReferralsSub] = useState<"active" | "completed">("active");
  const tabListRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (dir: 1 | -1) => tabListRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  const upcomingAppointment = record.appointments.find((a) => a.status === "upcoming");
  const openTasks = record.tasks.filter((t) => t.status !== "completed");
  const mostRecentActivity = record.activity[record.activity.length - 1];

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
        <div>
          <div className="text-base font-semibold text-[#1F2937]">{record.participantName}</div>
          <div className="text-xs text-[#9AA3B2]">
            {record.participantId} · {record.program}
          </div>
        </div>
        <div className="flex overflow-hidden rounded-sm border border-[#D8DEE8]">
          <button
            onClick={() => setView("profile")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === "profile" ? "bg-[#2B3A55] text-white" : "bg-transparent text-[#6B7686] hover:text-[#1F2937]"}`}
          >
            Profile
          </button>
          <button
            onClick={() => setView("dashboard")}
            className={`border-l border-[#D8DEE8] px-3 py-1.5 text-xs font-semibold transition-colors ${view === "dashboard" ? "bg-[#2B3A55] text-white" : "bg-transparent text-[#6B7686] hover:text-[#1F2937]"}`}
          >
            Dashboard
          </button>
        </div>
      </div>

      {view === "profile" ? (
        <div className="grid grid-cols-2 gap-4 border-b border-[#EEF0F3] px-5 py-4 text-sm sm:grid-cols-4">
          <Field label="Assigned Worker" value={record.assignedWorker.split(" — ")[0]} />
          <Field label="Program" value={record.program} />
          <Field label="Case ID" value={record.caseId} />
          <Field label="Status" value="Active" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 border-b border-[#EEF0F3] px-5 py-4 text-sm sm:grid-cols-4">
          <Field label="My Caseload" value="42 active" />
          <Field label="Appointments This Week" value="6" />
          <Field label="Pending Reviews" value="11" />
          <Field label="New This Week" value="3" />
        </div>
      )}

      <div className="relative flex items-center border-b border-[#EEF0F3] bg-[#FAFBFC]">
        <button onClick={() => scrollTabs(-1)} className="flex h-10 w-8 shrink-0 items-center justify-center text-[#9AA3B2] hover:text-[#1F2937]" aria-label="Scroll tabs left">
          <ChevronLeft className="size-4" />
        </button>
        <div ref={tabListRef} className="scrollbar-hide flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`h-10 shrink-0 border-b-2 px-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.value ? "border-[#2B3A55] text-[#1F2937]" : "border-transparent text-[#6B7686] hover:text-[#1F2937]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={() => scrollTabs(1)} className="flex h-10 w-8 shrink-0 items-center justify-center text-[#9AA3B2] hover:text-[#1F2937]" aria-label="Scroll tabs right">
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="px-5 py-5 text-sm">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <SectionLabel>Case Summary</SectionLabel>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Field label="Eligibility Status" value="Pending Verification" />
                <Field label="Case Status" value="Active" />
                <Field label="Enrolled" value="Apr 2" />
                <Field label="Case Office" value="Regional Office 4" />
              </div>
            </div>
            <div>
              <SectionLabel>Next Appointment</SectionLabel>
              {upcomingAppointment ? (
                <p className="mt-2 text-[#1F2937]">
                  {upcomingAppointment.purpose} — {upcomingAppointment.date}
                </p>
              ) : (
                <p className="mt-2 text-[#9AA3B2]">None scheduled.</p>
              )}
              <SectionLabel className="mt-4">Most Recent Activity</SectionLabel>
              <p className="mt-2 text-[#1F2937]">
                {mostRecentActivity.description} <span className="text-[#9AA3B2]">— {mostRecentActivity.date}</span>
              </p>
            </div>
            <div className="sm:col-span-2">
              <SectionLabel>Open Tasks</SectionLabel>
              <div className="mt-2 flex flex-col gap-2">
                {openTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between border-b border-[#EEF0F3] pb-2 last:border-0">
                    <span className="text-[#1F2937]">
                      {task.label} <span className="text-[#9AA3B2]">— {task.assignee}, due {task.dueDate}</span>
                    </span>
                    <StatusBadge tone={taskTone(task.status)}>{task.status === "overdue" ? "Overdue" : "Open"}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Preferred Contact" value="Email" />
            <Field label="Case Office" value="Regional Office 4" />
            <Field label="Language" value="English" />
          </div>
        )}

        {activeTab === "documents" && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEF0F3] text-xs text-[#9AA3B2]">
                <th className="py-2 font-medium">Document</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Due</th>
              </tr>
            </thead>
            <tbody>
              {record.documents.map((doc) => (
                <tr key={doc.id} className="border-b border-[#EEF0F3] last:border-0">
                  <td className="py-2.5">{doc.label}</td>
                  <td className="py-2.5">
                    <StatusBadge tone={documentTone(doc.status)}>{documentLabel(doc.status)}</StatusBadge>
                  </td>
                  <td className="py-2.5 text-[#9AA3B2]">{doc.dueDate ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "appointments" && (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEF0F3] text-xs text-[#9AA3B2]">
                <th className="py-2 font-medium">Purpose</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {record.appointments.map((appt) => (
                <tr key={appt.id} className="border-b border-[#EEF0F3] last:border-0">
                  <td className="py-2.5">{appt.purpose}</td>
                  <td className="py-2.5 text-[#9AA3B2]">{appt.date}</td>
                  <td className="py-2.5">
                    <StatusBadge tone={appt.status === "completed" ? "emerald" : "blue"}>{appt.status === "completed" ? "Completed" : "Upcoming"}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === "notes" && (
          <div>
            <div className="mb-4 flex gap-1 border-b border-[#EEF0F3]">
              {(["add", "all", "recent"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setNotesSub(sub)}
                  className={`px-3 py-2 text-xs font-semibold ${notesSub === sub ? "border-b-2 border-[#2B3A55] text-[#1F2937]" : "text-[#9AA3B2] hover:text-[#1F2937]"}`}
                >
                  {sub === "add" ? "Add Note" : sub === "all" ? "View All Notes" : "Recent Notes"}
                </button>
              ))}
            </div>
            {notesSub === "add" && <p className="text-[#9AA3B2] italic">New-note form not available in this reconstruction.</p>}
            {notesSub === "all" && (
              <div className="flex flex-col gap-4">
                {record.notes.map((note) => (
                  <div key={note.id} className="border-b border-[#EEF0F3] pb-4 last:border-0">
                    <div className="text-xs font-semibold text-[#9AA3B2]">
                      {note.author} · {note.date}
                    </div>
                    <p className="mt-1 text-[#1F2937]">{note.body}</p>
                  </div>
                ))}
              </div>
            )}
            {notesSub === "recent" && (
              <div>
                <div className="text-xs font-semibold text-[#9AA3B2]">
                  {record.notes[record.notes.length - 1].author} · {record.notes[record.notes.length - 1].date}
                </div>
                <p className="mt-1 text-[#1F2937]">{record.notes[record.notes.length - 1].body}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "billing" && (
          <p className="text-[#9AA3B2] italic">No billable activity on this case — Employment Services does not generate participant billing.</p>
        )}

        {activeTab === "referrals" && (
          <div>
            <div className="mb-4 flex gap-1 border-b border-[#EEF0F3]">
              {(["active", "completed"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setReferralsSub(sub)}
                  className={`px-3 py-2 text-xs font-semibold capitalize ${referralsSub === sub ? "border-b-2 border-[#2B3A55] text-[#1F2937]" : "text-[#9AA3B2] hover:text-[#1F2937]"}`}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {record.referrals
                .filter((ref) => (referralsSub === "active" ? ref.status !== "completed" : ref.status === "completed"))
                .map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between border-b border-[#EEF0F3] pb-3 last:border-0">
                    <div>
                      <div className="font-medium text-[#1F2937]">{ref.provider}</div>
                      <div className="text-xs text-[#9AA3B2]">{ref.service}</div>
                    </div>
                    <StatusBadge tone={referralTone(ref.status)}>
                      {ref.status === "completed" ? "Completed" : ref.status === "on-hold" ? "On Hold" : "Scheduled"}
                    </StatusBadge>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <ul className="flex flex-col gap-2 text-xs text-[#9AA3B2]">
            {record.activity.map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <span className="w-10 shrink-0 text-[#6B7686]">{entry.date}</span>
                <span>{entry.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-[#9AA3B2] uppercase">{label}</div>
      <div className="mt-0.5 text-[#1F2937]">{value}</div>
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[11px] font-semibold tracking-wide text-[#9AA3B2] uppercase ${className}`}>{children}</div>;
}
