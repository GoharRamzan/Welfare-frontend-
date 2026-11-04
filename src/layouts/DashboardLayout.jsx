
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      {/* Fixed sidebar with its own scroll */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main application area */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header stays in place */}
        <Header onMenuClick={openSidebar} />

        {/* Only page content scrolls */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
