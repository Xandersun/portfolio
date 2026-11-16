"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { App } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

/**
 * Monster case-study-only toast queue — a local twin of
 * components/sandbox/notification-provider.tsx (same pattern as this
 * folder's own LdsLightEmbed vs. the shared LdsEmbed: a separate copy so
 * this one demo can behave differently without touching the shared
 * component other pages, including /portfolio-v2/lds, still rely on).
 *
 * The only behavioral difference: toasts here stay on screen until a
 * portfolio reviewer explicitly closes them (`duration: false`) instead of
 * auto-dismissing after ~3s, and every toast carries a small muted line
 * telling the reviewer how to close it — necessary once dismissal is no
 * longer automatic.
 */

type ToastKind = "success" | "info" | "warning" | "error";

interface MonsterNotifyContextValue {
  notify: (kind: ToastKind, title: string, description?: string) => void;
}

const MonsterNotifyContext = createContext<MonsterNotifyContextValue | null>(null);

const ICONS: Record<ToastKind, ReactNode> = {
  success: <CheckCircleOutlined style={{ color: "#49aa19" }} />,
  info: <InfoCircleOutlined style={{ color: "#1668dc" }} />,
  warning: <WarningOutlined style={{ color: "#d89614" }} />,
  error: <ExclamationCircleOutlined style={{ color: "#dc4446" }} />,
};

function MonsterNotifyBridge({ children }: { children: ReactNode }) {
  const { notification } = App.useApp();

  const value = useMemo<MonsterNotifyContextValue>(
    () => ({
      notify: (kind, title, description) => {
        (notification as NotificationInstance)[kind]({
          title,
          description: (
            <>
              {description ? <div>{description}</div> : null}
              <div style={{ marginTop: description ? 4 : 0, fontSize: 12, color: "rgba(15, 23, 42, 0.45)" }}>
                Click &ldquo;×&rdquo; to close this notification
              </div>
            </>
          ),
          icon: ICONS[kind],
          placement: "topRight",
          duration: false,
          closable: true,
        });
      },
    }),
    [notification],
  );

  return <MonsterNotifyContext.Provider value={value}>{children}</MonsterNotifyContext.Provider>;
}

export function MonsterNotificationProvider({ children }: { children: ReactNode }) {
  return (
    <App>
      <MonsterNotifyBridge>{children}</MonsterNotifyBridge>
    </App>
  );
}

export function useSandboxNotify() {
  const ctx = useContext(MonsterNotifyContext);
  if (!ctx) {
    throw new Error("useSandboxNotify must be used within MonsterNotificationProvider");
  }
  return ctx.notify;
}
