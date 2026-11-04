
import { Menu, Bell, ChevronDown, UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/home": "Dashboard",
  "/donors": "Donors",
  "/beneficiaries": "Beneficiaries",
  "/applications": "Applications",
  "/reports": "Reports",
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-blue-950 sm:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Fikr-e-Sadaat Welfare Foundation
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50 sm:gap-3"
          aria-label="Admin profile"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-950">
            <UserRound size={21} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}
