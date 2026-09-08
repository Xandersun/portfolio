import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { LdsShell } from "@/components/portfolio-v2/lds-shell";

/**
 * Route group layout for the isolated Living Design System experience
 * inside portfolio-v2. Mirrors app/(defense-app)/layout.tsx (AntdRegistry
 * scoped here, not the true root layout, so the antd theme/sidebar chrome
 * never reaches the coral portfolio pages) — the only difference is
 * LdsShell in place of AppShell.
 */
export default function LdsLayout({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <LdsShell>{children}</LdsShell>
    </AntdRegistry>
  );
}
