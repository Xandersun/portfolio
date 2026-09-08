"use client";

import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { Layout, Typography } from "antd";

import { LdsEmbed } from "@/components/portfolio-v2/lds-embed";

import { FEATURED_CASE, SECOND_CASE, getCaseRecord } from "../data";
import { AfterCaseload } from "./after-caseload";
import { AfterSidebar } from "./after-sidebar";
import { AfterWorkspace } from "./after-workspace";
import { MonsterCommandPalette, PALETTE_ICONS, useMonsterCommandPalette } from "./command-palette";
import { InspectorDrawer } from "./inspector-drawer";

const { Text } = Typography;
const { Content } = Layout;

/**
 * The After application shell: Living Design System sidebar (global nav)
 * + a persistent orientation bar (customer-level context, always visible)
 * + the workspace itself. Wrapped in LdsEmbed — the same isolated antd
 * scope portfolio-v2 already uses to embed one live LDS module inside a
 * Tailwind portfolio page — so this inherits the real design system
 * rather than approximating its colors.
 *
 * Two cases are openable here: Marisol Vega (the primary task) and Anna
 * Kowalski (a calm case with no open issues, used to show the workspace's
 * empty states honestly). Every other caseload row is real but inert,
 * matching the existing "present but not wired up" convention already
 * used for the sidebar's other global-nav items.
 */
export function AfterApp({
  selectedCaseId,
  onSelectCase,
  onBack,
  inspectorOpen,
  onOpenInspector,
  onCloseInspector,
}: {
  selectedCaseId: string | null;
  onSelectCase: (caseId: string) => void;
  onBack: () => void;
  inspectorOpen: boolean;
  onOpenInspector: () => void;
  onCloseInspector: () => void;
}) {
  const record = selectedCaseId ? getCaseRecord(selectedCaseId) : undefined;

  const palette = useMonsterCommandPalette([
    { id: "goto-caseload", label: "Go to Caseload", category: "Navigation", icon: PALETTE_ICONS.app, run: onBack },
    { id: "open-marisol", label: `Open ${FEATURED_CASE.participantName}`, description: FEATURED_CASE.caseId, category: "Cases", icon: PALETTE_ICONS.user, run: () => onSelectCase(FEATURED_CASE.participantId) },
    { id: "open-anna", label: `Open ${SECOND_CASE.participantName}`, description: SECOND_CASE.caseId, category: "Cases", icon: PALETTE_ICONS.user, run: () => onSelectCase(SECOND_CASE.participantId) },
  ]);

  return (
    <LdsEmbed>
      <div
        ref={palette.containerRef}
        tabIndex={-1}
        onKeyDownCapture={palette.onKeyDownCapture}
        style={{ height: 720, overflow: "hidden", borderRadius: 8, outline: "none" }}
      >
        <Layout style={{ height: "100%" }}>
          <AfterSidebar />
          <Layout>
            <div
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingInline: 16,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                background: "#0b1220",
                flexShrink: 0,
              }}
            >
              {record && (
                <button
                  onClick={onBack}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: 12, padding: 0 }}
                >
                  <ArrowLeftOutlined /> Caseload
                </button>
              )}
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                {record ? (
                  <>
                    {record.participantName} <Text type="secondary">· {record.caseId}</Text>
                  </>
                ) : (
                  "Caseload"
                )}
              </Text>

              <button
                onClick={() => palette.setOpen(true)}
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  color: "rgba(255,255,255,0.55)",
                  cursor: "pointer",
                  fontSize: 12,
                  padding: "4px 10px",
                }}
              >
                <SearchOutlined style={{ fontSize: 11 }} /> Jump to… <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}>⌘K</span>
              </button>
            </div>
            <Content style={{ overflow: "auto", flex: 1 }}>
              {record ? (
                <AfterWorkspace key={record.caseId} record={record} onOpenInspector={onOpenInspector} />
              ) : (
                <div style={{ padding: 20 }}>
                  <AfterCaseload onSelect={onSelectCase} />
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
        {record && record.participantId === FEATURED_CASE.participantId && (
          <InspectorDrawer record={record} open={inspectorOpen} onClose={onCloseInspector} />
        )}
      </div>
      <MonsterCommandPalette open={palette.open} onClose={() => palette.setOpen(false)} actions={palette.actions} />
    </LdsEmbed>
  );
}
