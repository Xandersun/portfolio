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
 * @design-spec Global toast/notification queue for the sandbox suite.
 * Placement: topRight · Duration: 3.2s · Stack: antd default (max ~visible
 * viewport height, oldest dismissed first) · Icon size: 16px · Title weight:
 * 600 · Body: 13px / rgba(255,255,255,0.65).
 *
 * Any sandbox page calls useSandboxNotify() to emit a canned enterprise-style
 * toast through this single shared queue, rather than each page instancing
 * its own message.useMessage(). Wired in app/sandbox/layout.tsx.
 */

type ToastKind = "success" | "info" | "warning" | "error";

interface SandboxNotifyContextValue {
  notify: (kind: ToastKind, title: string, description?: string) => void;
}

const SandboxNotifyContext = createContext<SandboxNotifyContextValue | null>(null);

const ICONS: Record<ToastKind, ReactNode> = {
  success: <CheckCircleOutlined style={{ color: "#49aa19" }} />,
  info: <InfoCircleOutlined style={{ color: "#1668dc" }} />,
  warning: <WarningOutlined style={{ color: "#d89614" }} />,
  error: <ExclamationCircleOutlined style={{ color: "#dc4446" }} />,
};

function SandboxNotifyBridge({ children }: { children: ReactNode }) {
  const { notification } = App.useApp();

  const value = useMemo<SandboxNotifyContextValue>(
    () => ({
      notify: (kind, title, description) => {
        (notification as NotificationInstance)[kind]({
          title,
          description,
          icon: ICONS[kind],
          placement: "topRight",
          duration: 3.2,
        });
      },
    }),
    [notification],
  );

  return <SandboxNotifyContext.Provider value={value}>{children}</SandboxNotifyContext.Provider>;
}

export function SandboxNotificationProvider({ children }: { children: ReactNode }) {
  return (
    <App>
      <SandboxNotifyBridge>{children}</SandboxNotifyBridge>
    </App>
  );
}

export function useSandboxNotify() {
  const ctx = useContext(SandboxNotifyContext);
  if (!ctx) {
    throw new Error("useSandboxNotify must be used within SandboxNotificationProvider");
  }
  return ctx.notify;
}
