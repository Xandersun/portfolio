"use client";

/**
 * portfolio-v2 / Living Design System — Live Telemetry.
 * Content-only isolated copy of app/(defense-app)/sandbox/telemetry/page.tsx
 * (untouched, still serves the original /sandbox): identical
 * streaming-feed + threshold-crossing-toast mechanic, reframed from
 * physical sensor readings to fictional case-management system events
 * (queue backlogs, determination latency, deadline risk) instead of
 * defense sensor/asset telemetry.
 */

import { useEffect, useRef, useState } from "react";
import { Button, Switch, Typography } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import { useSandboxNotify } from "@/components/sandbox/notification-provider";

const { Title, Paragraph, Text } = Typography;

interface Source {
  id: string;
  label: string;
  baseline: number;
  noise: number;
  threshold: number;
  unit: string;
  decimals: number;
}

const SOURCES: Source[] = [
  { id: "EVT-01", label: "Document Verification Queue", baseline: 8, noise: 4, threshold: 25, unit: " docs", decimals: 0 },
  { id: "EVT-02", label: "Eligibility Determination Latency", baseline: 6, noise: 3, threshold: 18, unit: "h", decimals: 1 },
  { id: "EVT-03", label: "Recertification Deadline Risk", baseline: 0.2, noise: 0.6, threshold: 3, unit: "d overdue", decimals: 1 },
  { id: "EVT-04", label: "Referral Response Wait", baseline: 2.1, noise: 1.2, threshold: 7, unit: "d", decimals: 1 },
  { id: "EVT-05", label: "Supervisor Review Backlog", baseline: 3, noise: 2, threshold: 10, unit: " cases", decimals: 0 },
];

interface Reading {
  key: string;
  time: string;
  source: Source;
  value: number;
  isAnomaly: boolean;
}

const MAX_ROWS = 300;
const TICK_MS = 850;
const ANOMALY_CHANCE = 0.14;
const NEAR_BOTTOM_PX = 48;

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour12: false });
}

function generateReading(): Reading {
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
  const isAnomaly = Math.random() < ANOMALY_CHANCE;
  const value = isAnomaly
    ? source.threshold + source.noise * (0.6 + Math.random() * 1.8)
    : source.baseline + (Math.random() - 0.5) * 2 * source.noise;
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: formatTime(new Date()),
    source,
    value: Math.max(0, value),
    isAnomaly,
  };
}

export default function TelemetryPage() {
  const notify = useSandboxNotify();
  const [rows, setRows] = useState<Reading[]>([]);
  const [running, setRunning] = useState(true);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasAnomalousRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const reading = generateReading();

      if (reading.isAnomaly && !wasAnomalousRef.current[reading.source.id]) {
        notify(
          "warning",
          "Threshold exceeded",
          `${reading.source.label} reads ${reading.value.toFixed(reading.source.decimals)}${reading.source.unit}, above ${reading.source.threshold}${reading.source.unit}.`,
        );
      }
      wasAnomalousRef.current[reading.source.id] = reading.isAnomaly;

      setRows((prev) => {
        const next = [...prev, reading];
        return next.length > MAX_ROWS ? next.slice(next.length - MAX_ROWS) : next;
      });
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, [running, notify]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinnedToBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [rows, pinnedToBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setPinnedToBottom(distanceFromBottom < NEAR_BOTTOM_PX);
  };

  const handleClear = () => {
    setRows([]);
    wasAnomalousRef.current = {};
  };

  return (
    <div style={{ padding: 32, maxWidth: 980, marginInline: "auto" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Live Telemetry
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Simulated case-management system event feed. Rows crossing their operational threshold
        flash red and raise a toast the moment they cross it.
      </Paragraph>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Switch checked={running} onChange={setRunning} />
          <Text>{running ? "Streaming" : "Paused"}</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: running ? "#49aa19" : "rgba(255,255,255,0.25)",
              animation: running ? "telemetry-pulse 1.4s ease-in-out infinite" : "none",
            }}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {running ? "LIVE" : "IDLE"}
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {rows.length} events
        </Text>
        <Button size="small" icon={<ClearOutlined />} onClick={handleClear} style={{ marginLeft: "auto" }}>
          Clear log
        </Button>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          height: 460,
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          background: "#0b1220",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 12,
        }}
      >
        {rows.length === 0 && (
          <div style={{ padding: 32, textAlign: "center" }}>
            <Text type="secondary">Waiting for events…</Text>
          </div>
        )}
        {rows.map((row) => (
          <div
            key={row.key}
            className={row.isAnomaly ? "telemetry-anomaly-row" : undefined}
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              color: row.isAnomaly ? "#fecaca" : "rgba(255,255,255,0.75)",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)", width: 84, flexShrink: 0 }}>{row.time}</span>
            <span style={{ width: 72, flexShrink: 0, color: "rgba(255,255,255,0.5)" }}>{row.source.id}</span>
            <span style={{ flex: 1 }}>{row.source.label}</span>
            <span style={{ width: 110, textAlign: "right", fontWeight: row.isAnomaly ? 700 : 400 }}>
              {row.value.toFixed(row.source.decimals)}
              {row.source.unit}
            </span>
            <span style={{ width: 90, textAlign: "right", color: "rgba(255,255,255,0.35)" }}>
              limit {row.source.threshold}
            </span>
          </div>
        ))}
      </div>

      {!pinnedToBottom && (
        <div style={{ marginTop: 8, textAlign: "center" }}>
          <Button
            size="small"
            onClick={() => {
              setPinnedToBottom(true);
              const el = scrollRef.current;
              if (el) el.scrollTop = el.scrollHeight;
            }}
          >
            Jump to latest ↓
          </Button>
        </div>
      )}

      <style>{`
        @keyframes telemetry-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes telemetry-anomaly-flash {
          0%, 100% { background-color: rgba(220, 68, 70, 0.28); }
          50% { background-color: rgba(220, 68, 70, 0.06); }
        }
        .telemetry-anomaly-row {
          animation: telemetry-anomaly-flash 1.1s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}
