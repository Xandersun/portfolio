"use client";

import type { ReactNode } from "react";
import { ConfigProvider, Layout, theme } from "antd";

import { LdsSidebar } from "@/components/portfolio-v2/lds-sidebar";
import { CommandPaletteProvider } from "@/components/sandbox/command-palette-provider";
import { SandboxNotificationProvider } from "@/components/sandbox/notification-provider";
import { colorTokens, fontFamilyTokens } from "@/lib/design-tokens";

const { Content } = Layout;

/**
 * Isolated Living Design System shell for portfolio-v2/lds/*. A copy of
 * components/layout/app-shell.tsx (theme tokens + antd ConfigProvider
 * setup, unchanged) with two differences: LdsSidebar in place of the
 * generic/disconnected AppSidebar, and the same SandboxNotificationProvider
 * + CommandPaletteProvider nesting app/(defense-app)/sandbox/layout.tsx
 * already uses, so every reused module (useSandboxNotify,
 * useCommandPalette, the global ⌘K/"/"/Alt+N shortcuts) works identically
 * to its native /sandbox rendering.
 */
export function LdsShell({ children }: { children: ReactNode }) {
  return (
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
          Menu: {
            itemSelectedBg: colorTokens.menuSelectedBg,
            itemSelectedColor: colorTokens.menuSelectedColor,
          },
          Layout: {
            siderBg: colorTokens.siderBg,
          },
        },
      }}
    >
      <SandboxNotificationProvider>
        <CommandPaletteProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <LdsSidebar />
            <Layout>
              <Content style={{ minHeight: "100vh" }}>{children}</Content>
            </Layout>
          </Layout>
        </CommandPaletteProvider>
      </SandboxNotificationProvider>
    </ConfigProvider>
  );
}
