"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheckBig,
  Database,
  Download,
  FileText,
  Info,
  Quote,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  Citation,
  ConfidenceFactor,
  EvidenceStatus,
  Program,
  RiskDriver,
  RiskTier,
} from "@/lib/programs";

/**
 * Diverging pair for risk attribution. Validated for CVD separation and
 * contrast against the slate-950/900 drawer surfaces; every bar also carries
 * an arrow and a signed value so direction never rests on color alone.
 */
const ELEVATES = "#ea580c";
const REDUCES = "#0d9488";

const riskStyles: Record<RiskTier, { chip: string; icon: typeof ShieldCheck }> = {
  High: { chip: "bg-red-500/10 text-red-400 border-red-500/30", icon: TriangleAlert },
  Medium: { chip: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: CircleAlert },
  Low: { chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: ShieldCheck },
};

const evidenceStyles: Record<
  EvidenceStatus,
  { chip: string; icon: typeof ShieldCheck }
> = {
  Corroborated: {
    chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    icon: CircleCheckBig,
  },
  "Single-source": {
    chip: "bg-slate-800 text-slate-300 border-slate-700",
    icon: Info,
  },
  Conflicting: {
    chip: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    icon: TriangleAlert,
  },
};

function confidenceBand(confidence: number) {
  if (confidence >= 90) return "High confidence";
  if (confidence >= 80) return "Moderate confidence";
  return "Low confidence — corroborate before use";
}

interface DriverBarProps {
  driver: RiskDriver;
  /** Largest absolute impact in the set, used to scale every bar consistently. */
  scale: number;
  onTrace: () => void;
}

function DriverBar({ driver, scale, onTrace }: DriverBarProps) {
  const elevates = driver.impact > 0;
  const width = (Math.abs(driver.impact) / scale) * 50;
  const Arrow = elevates ? ArrowUpRight : ArrowDownRight;

  return (
    <button
      type="button"
      onClick={onTrace}
      className="w-full rounded-md px-2 py-2 text-left transition-colors hover:bg-slate-800/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{driver.label}</span>
        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-slate-300">
          <Arrow
            className="size-3.5"
            style={{ color: elevates ? ELEVATES : REDUCES }}
            aria-hidden
          />
          {elevates ? "+" : "−"}
          {Math.abs(driver.impact)}
        </span>
      </div>

      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-slate-800/70">
        <div
          className={cn(
            "absolute inset-y-0",
            elevates ? "left-1/2 rounded-r-[4px]" : "right-1/2 rounded-l-[4px]"
          )}
          style={{
            width: `${width}%`,
            backgroundColor: elevates ? ELEVATES : REDUCES,
          }}
        />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-600" />
      </div>

      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{driver.detail}</p>
      <p className="mt-1 font-mono text-[10px] tracking-wide text-slate-500">
        {driver.derivedFrom.join(" · ")} → trace to evidence
      </p>
    </button>
  );
}

function ConfidenceMeter({ factor }: { factor: ConfidenceFactor }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-slate-300">{factor.label}</span>
        <span className="font-mono text-xs text-slate-400">{factor.score}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-r-[4px] bg-emerald-400"
          style={{ width: `${factor.score}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{factor.detail}</p>
    </div>
  );
}

function CitationCard({
  citation,
  traced,
  dimmed,
}: {
  citation: Citation;
  traced: boolean;
  dimmed: boolean;
}) {
  const status = evidenceStyles[citation.status];
  const StatusIcon = status.icon;

  return (
    <article
      className={cn(
        "rounded-lg border border-slate-800 bg-slate-950/60 p-3 transition-opacity",
        traced && "border-emerald-500/40 ring-1 ring-emerald-500/20",
        dimmed && "opacity-40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-slate-200">{citation.title}</h4>
          <p className="mt-0.5 text-xs text-slate-500">
            {citation.publisher} · retrieved {citation.retrieved}
          </p>
        </div>
        <Badge variant="outline" className={cn("shrink-0 gap-1", status.chip)}>
          <StatusIcon aria-hidden />
          {citation.status}
        </Badge>
      </div>

      <blockquote className="mt-3 flex gap-2 rounded border-l-2 border-cyan-500/40 bg-slate-900/60 p-2.5">
        <Quote className="mt-0.5 size-3.5 shrink-0 text-cyan-400" aria-hidden />
        <p className="text-xs leading-relaxed text-slate-300">{citation.excerpt}</p>
      </blockquote>

      <div className="mt-3 flex items-center gap-3">
        <span className="w-28 shrink-0 text-[10px] tracking-wide text-slate-500 uppercase">
          Evidence weight
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-r-[4px] bg-cyan-400"
            style={{ width: `${citation.weight}%` }}
          />
        </div>
        <span className="font-mono text-xs text-slate-400">{citation.weight}%</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-500">
        <span className="rounded border border-slate-800 px-1.5 py-0.5">{citation.id}</span>
        <span className="rounded border border-slate-800 px-1.5 py-0.5">{citation.kind}</span>
        <span className="rounded border border-slate-800 px-1.5 py-0.5">
          {citation.classification}
        </span>
      </div>
    </article>
  );
}

function exportAuditRecord(program: Program) {
  const blob = new Blob([JSON.stringify(program, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${program.id}-audit-record.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export interface ExplainabilityDrawerProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExplainabilityDrawer({
  program,
  open,
  onOpenChange,
}: ExplainabilityDrawerProps) {
  const [tab, setTab] = useState("rationale");
  const [tracedDriver, setTracedDriver] = useState<RiskDriver | null>(null);
  const [shownProgramId, setShownProgramId] = useState(program?.id);

  // A new row means a new explanation: drop the previous trace and start at the top.
  if (program?.id !== shownProgramId) {
    setShownProgramId(program?.id);
    setTab("rationale");
    setTracedDriver(null);
  }

  if (!program) return null;

  const risk = riskStyles[program.risk];
  const RiskIcon = risk.icon;
  const driverScale = Math.max(...program.drivers.map((d) => Math.abs(d.impact)));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-slate-800 bg-slate-900 p-0 text-slate-100 data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        <SheetHeader className="gap-0 border-b border-slate-800 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                <FileText className="size-4" aria-hidden />
                AI EXPLAINABILITY AUDIT
              </div>
              <SheetTitle className="mt-2 text-lg leading-snug font-semibold text-slate-100">
                {program.name}
              </SheetTitle>
              <SheetDescription className="mt-1 font-mono text-xs text-slate-400">
                {program.id} · {program.agency} · FY27 {program.budget}
              </SheetDescription>
            </div>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                />
              }
            >
              <X aria-hidden />
              <span className="sr-only">Close explainability panel</span>
            </SheetClose>
          </div>

          <div className="mt-4 flex items-stretch gap-3">
            <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[10px] tracking-wide text-slate-500 uppercase">Risk tier</p>
              <Badge variant="outline" className={cn("mt-1.5 gap-1", risk.chip)}>
                <RiskIcon aria-hidden />
                {program.risk}
              </Badge>
            </div>
            <div className="flex-[1.6] rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <p className="text-[10px] tracking-wide text-slate-500 uppercase">
                Model confidence
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl leading-none font-semibold text-slate-100">
                  {program.confidence}%
                </span>
                <span className="text-xs text-slate-400">
                  {confidenceBand(program.confidence)}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(String(value))}
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <TabsList
            variant="line"
            className="w-full justify-start gap-4 border-b border-slate-800 px-5 py-0"
          >
            {[
              ["rationale", "Rationale"],
              ["evidence", `Evidence (${program.citations.length})`],
              ["provenance", "Provenance"],
            ].map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-none px-0 text-slate-400 after:bg-emerald-400 hover:text-slate-200 data-active:text-slate-50"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <TabsContent value="rationale" className="space-y-6">
              <section>
                <h3 className="font-mono text-xs tracking-wide text-emerald-400 uppercase">
                  Why this tier
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {program.rationale}
                </p>
              </section>

              <Separator className="bg-slate-800" />

              <section>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono text-xs tracking-wide text-emerald-400 uppercase">
                    Risk attribution
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: ELEVATES }}
                        aria-hidden
                      />
                      Elevates risk
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: REDUCES }}
                        aria-hidden
                      />
                      Reduces risk
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Signed contribution to the composite score. Select a driver to see the
                  sources behind it.
                </p>
                <div className="mt-3 -mx-2 divide-y divide-slate-800/60">
                  {program.drivers.map((driver) => (
                    <DriverBar
                      key={driver.label}
                      driver={driver}
                      scale={driverScale}
                      onTrace={() => {
                        setTracedDriver(driver);
                        setTab("evidence");
                      }}
                    />
                  ))}
                </div>
              </section>

              <Separator className="bg-slate-800" />

              <section>
                <h3 className="font-mono text-xs tracking-wide text-emerald-400 uppercase">
                  Confidence breakdown
                </h3>
                <div className="mt-3 space-y-4">
                  {program.confidenceFactors.map((factor) => (
                    <ConfidenceMeter key={factor.label} factor={factor} />
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-3">
              {tracedDriver && (
                <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="text-xs leading-relaxed text-slate-300">
                    Showing the {tracedDriver.derivedFrom.length} source
                    {tracedDriver.derivedFrom.length === 1 ? "" : "s"} behind{" "}
                    <span className="font-medium text-slate-100">{tracedDriver.label}</span>.
                  </p>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setTracedDriver(null)}
                    className="shrink-0 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    Show all
                  </Button>
                </div>
              )}
              {program.citations.map((citation) => {
                const traced = tracedDriver?.derivedFrom.includes(citation.id) ?? false;
                return (
                  <CitationCard
                    key={citation.id}
                    citation={citation}
                    traced={traced}
                    dimmed={Boolean(tracedDriver) && !traced}
                  />
                );
              })}
            </TabsContent>

            <TabsContent value="provenance" className="space-y-6">
              <section>
                <h3 className="font-mono text-xs tracking-wide text-emerald-400 uppercase">
                  Pipeline trace
                </h3>
                <ol className="mt-3 space-y-0">
                  {program.provenance.map((step, index) => (
                    <li key={step.stage} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-cyan-400" />
                        {index < program.provenance.length - 1 && (
                          <span className="w-px flex-1 bg-slate-800" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-medium text-slate-200">
                            {step.stage}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {step.at}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <Separator className="bg-slate-800" />

              <section>
                <h3 className="font-mono text-xs tracking-wide text-emerald-400 uppercase">
                  Model record
                </h3>
                <dl className="mt-3 grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2 text-xs">
                  {[
                    ["Model", `${program.model.name} ${program.model.version}`],
                    ["Run ID", program.model.runId],
                    ["Scored", program.model.scoredAt],
                    ["Human review", program.model.reviewer],
                  ].map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="font-mono text-slate-300">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <Separator className="bg-slate-800" />

              <section>
                <h3 className="flex items-center gap-1.5 font-mono text-xs tracking-wide text-amber-400 uppercase">
                  <TriangleAlert className="size-3.5" aria-hidden />
                  Known limitations
                </h3>
                <ul className="mt-3 space-y-2">
                  {program.caveats.map((caveat) => (
                    <li
                      key={caveat}
                      className="rounded border border-slate-800 bg-slate-950/60 p-2.5 text-xs leading-relaxed text-slate-400"
                    >
                      {caveat}
                    </li>
                  ))}
                </ul>
              </section>
            </TabsContent>
          </div>
        </Tabs>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 p-4">
          <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
            <Database className="size-3.5 text-cyan-400" aria-hidden />
            {program.citations.length} fused sources · {program.model.runId}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAuditRecord(program)}
            className="border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800 hover:text-slate-100"
          >
            <Download aria-hidden />
            Export audit record
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
