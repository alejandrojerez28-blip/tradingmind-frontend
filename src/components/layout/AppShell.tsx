"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatusBar } from "./StatusBar";
import { SystemSync } from "./SystemSync";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-void">
      <SystemSync />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pl-16">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
        <StatusBar />
      </div>
    </div>
  );
}
