"use client";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

import { colorTokens, fontFamilyTokens } from "@/lib/design-tokens";
import { SandboxNotificationProvider } from "@/components/sandbox/notification-provider";

/**
 * Isolated antd scope for embedding one live, unmodified Living Design
 * System module inline inside a portfolio-v2 page that otherwise runs the
 * coral Tailwind system. Reuses the exact dark-navy/teal ConfigProvider
 * theme from components/layout/app-shell.tsx (the real source of truth)
 * so the embedded module looks identical to its native /sandbox rendering,
 * without either visual system leaking into the other.
 *
 * Only wraps SandboxNotificationProvider — the one context every sandbox
 * module can call into (useSandboxNotify) — not CommandPaletteProvider,
 * which registers global ⌘K/"/"/Alt+N window listeners that belong to the
 * full Living Design System shell (see lds-shell.tsx), not to a single
 * inline preview card sitting in the middle of a portfolio page.
 */
export function LdsEmbed({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: colorTokens.primary,
            colorBgBase: colorTokens.bgBase,
            colorBgContainer: colorTokens.bgContainer,
            colorBgLayout: colorTokens.bgLayout,
            colorBorder: colorTokens.border,
            fontFamily: fontFamilyTokens.sans,
          },
          components: {
            Layout: { siderBg: colorTokens.siderBg },
          },
        }}
      >
        <SandboxNotificationProvider>{children}</SandboxNotificationProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
