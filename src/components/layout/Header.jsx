
import { useState } from "react";
import { Menu, Bell, ChevronDown, UserRound, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";

const pageTitles = {
  "/home": "Dashboard",
  "/donors": "Donors",
  "/beneficiaries": "Beneficiaries",
  "/applications": "Applications",
  "/reports": "Reports",
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[pathname] || "Dashboard";

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await api.logout();

      setProfileOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);

      // Logout API error ki surat mein bhi login par bhej do
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

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
            Fikhre Saadat Welfare Foundation
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

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
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
              className={`hidden text-slate-400 transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut size={18} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
