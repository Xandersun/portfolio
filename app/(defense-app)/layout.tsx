import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { AppShell } from "@/components/layout/app-shell";

/**
 * Route group for the earlier "Defense Analytics Platform" prototype
 * (moved to /dashboard) and its /sandbox demo suite. Scoped here — not in
 * the true root layout — so the antd theme/sidebar chrome only wraps this
 * subtree and doesn't leak into the portfolio site at "/".
 */
export default function DefenseAppLayout({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <AppShell>{children}</AppShell>
    </AntdRegistry>
  );
}
