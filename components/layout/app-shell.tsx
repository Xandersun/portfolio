"use client";

import type { ReactNode } from "react";
import { ConfigProvider, Layout, theme } from "antd";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { colorTokens, fontFamilyTokens } from "@/lib/design-tokens";

const { Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
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
            // Default dark-theme itemSelectedBg (solid colorPrimary) puts white
            // label text at ~3.34:1 against the fill, under the 4.5:1 WCAG AA
            // floor for 14px text. A translucent tint keeps the near-white
            // label text at its normal ~18:1 contrast against the dark sider
            // instead of testing contrast against a saturated fill.
            itemSelectedBg: colorTokens.menuSelectedBg,
            itemSelectedColor: colorTokens.menuSelectedColor,
          },
          Layout: {
            // Layout.siderBg defaults to a hardcoded '#001529', independent of
            // colorBgContainer/the dark algorithm. Pin it to the same surface
            // color as the rest of the shell so Sider isn't a mismatched,
            // untracked color when the palette changes.
            siderBg: colorTokens.siderBg,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar />
        <Layout>
          <Content style={{ minHeight: "100vh" }}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
