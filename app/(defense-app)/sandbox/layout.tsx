import type { ReactNode } from "react";

import { CommandPaletteProvider } from "@/components/sandbox/command-palette-provider";
import { SandboxNotificationProvider } from "@/components/sandbox/notification-provider";

export default function SandboxLayout({ children }: { children: ReactNode }) {
  return (
    <SandboxNotificationProvider>
      <CommandPaletteProvider>{children}</CommandPaletteProvider>
    </SandboxNotificationProvider>
  );
}
