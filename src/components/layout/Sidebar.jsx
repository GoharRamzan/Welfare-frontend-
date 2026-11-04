
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HandHeart,
  FileCheck2,
  ChartNoAxesCombined,
  X,
  HeartHandshake,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Donors",
    path: "/donors",
    icon: Users,
  },
  // {
  //   name: "Beneficiaries",
  //   path: "/beneficiaries",
  //   icon: HandHeart,
  // },
  {
    name: "Applications",
    path: "/applications",
    icon: FileCheck2,
  },
  // {
  //   name: "Reports",
  //   path: "/reports",
  //   icon: ChartNoAxesCombined,
  // },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Fixed sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72
          flex-col overflow-hidden border-r border-slate-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:z-auto lg:shrink-0 lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white">
              <HeartHandshake size={25} />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-blue-950">
                FSWF
              </h2>
              <p className="text-xs text-slate-500">
                Welfare Management
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Independently scrollable navigation */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Main Menu
          </p>

          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-950"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer remains fixed */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-800">
              Fikr-e-Sadaat
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Welfare Foundation
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
