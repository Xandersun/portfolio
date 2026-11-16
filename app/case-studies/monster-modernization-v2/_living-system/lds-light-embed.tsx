"use client";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import { fontFamilyTokens } from "@/lib/design-tokens";
import { MonsterNotificationProvider } from "./monster-notification-provider";

/**
 * Light-mode counterpart to components/portfolio-v2/lds-embed.tsx, used
 * only by the Monster case-study's Living Design System section. That
 * shared LdsEmbed hardcodes the dark-navy/teal ConfigProvider theme used
 * everywhere else the real LDS is embedded, so it's left untouched; this
 * file exists specifically so the Monster reconstruction can present a
 * conventional light enterprise-SaaS palette instead, without affecting
 * any other embed of the real LDS pages elsewhere in the portfolio.
 */
export function LdsLightEmbed({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0f766e",
            colorBgBase: "#F8FAFC",
            colorBgContainer: "#FFFFFF",
            colorBgLayout: "#F8FAFC",
            colorBorder: "#CBD5E1",
            colorBorderSecondary: "#E2E8F0",
            colorText: "#0F172A",
            colorTextSecondary: "#334155",
            colorTextTertiary: "#475569",
            fontFamily: fontFamilyTokens.sans,
          },
          components: {
            Menu: {
              itemSelectedBg: "#F0FDFA",
              itemSelectedColor: "#115E59",
              itemHoverBg: "#F1F5F9",
            },
          },
        }}
      >
        <MonsterNotificationProvider>{children}</MonsterNotificationProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
