import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
} as const;

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONE_CLASSES;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("h-auto rounded-sm px-2 py-0.5 text-[11px] font-semibold shadow-none", TONE_CLASSES[tone], className)}>
      {children}
    </Badge>
  );
}

export function documentTone(status: "received" | "outstanding" | "due-soon" | "not-yet-due") {
  if (status === "received") return "emerald";
  if (status === "outstanding") return "red";
  if (status === "due-soon") return "amber";
  return "neutral";
}

export function documentLabel(status: "received" | "outstanding" | "due-soon" | "not-yet-due") {
  if (status === "received") return "Received";
  if (status === "outstanding") return "Outstanding";
  if (status === "due-soon") return "Due Soon";
  return "Not Yet Due";
}

export function taskTone(status: "completed" | "open" | "overdue") {
  if (status === "completed") return "emerald";
  if (status === "overdue") return "red";
  return "blue";
}

export function referralTone(status: "completed" | "on-hold" | "scheduled") {
  if (status === "completed") return "emerald";
  if (status === "on-hold") return "amber";
  return "blue";
}
