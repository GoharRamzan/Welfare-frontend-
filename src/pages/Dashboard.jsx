
import {
  HeartHandshake,
  Users,
  HandHeart,
  Wallet,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  CalendarDays,
  MoveRight,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Donors",
    value: "1,284",
    change: "+12.5%",
    positive: true,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Total Donations",
    value: "Rs. 24.8M",
    change: "+8.2%",
    positive: true,
    icon: Wallet,
    color: "bg-sky-50 text-sky-600",
  },
  {
    title: "People Helped",
    value: "856",
    change: "+15.3%",
    positive: true,
    icon: HandHeart,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Pending Applications",
    value: "42",
    change: "-4.1%",
    positive: false,
    icon: FileText,
    color: "bg-cyan-50 text-cyan-600",
  },
];

const activities = [
  {
    name: "New donation received",
    detail: "Donation from Ahmed Ali",
    amount: "+ Rs. 25,000",
    time: "10 minutes ago",
    icon: HeartHandshake,
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Application submitted",
    detail: "New welfare application received",
    amount: "APP-2026-024",
    time: "35 minutes ago",
    icon: FileText,
    color: "bg-sky-50 text-sky-600",
  },
  {
    name: "Financial assistance",
    detail: "Help provided to a deserving family",
    amount: "Rs. 15,000",
    time: "1 hour ago",
    icon: HandHeart,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    name: "Application approved",
    detail: "Application successfully approved",
    amount: "APP-2026-021",
    time: "3 hours ago",
    icon: CheckCircle2,
    color: "bg-cyan-50 text-cyan-600",
  },
];

const applications = [
  {
    id: "APP-2026-024",
    name: "Muhammad Hassan",
    type: "Medical",
    date: "04 Nov 2026",
    status: "Pending",
  },
  {
    id: "APP-2026-023",
    name: "Ali Raza",
    type: "Education",
    date: "03 Nov 2026",
    status: "Approved",
  },
  {
    id: "APP-2026-022",
    name: "Usman Ahmed",
    type: "Financial",
    date: "03 Nov 2026",
    status: "Pending",
  },
  {
    id: "APP-2026-021",
    name: "Bilal Hussain",
    type: "Medical",
    date: "02 Nov 2026",
    status: "Approved",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              Welfare Management Portal
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to Fikr-e-Sadaat!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Together, we can make a difference. Manage donations,
              support deserving families, and monitor welfare activities
              all in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm">
                <CalendarDays size={17} />
                04 November 2026
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm">
                <HeartHandshake size={17} />
                Serving with compassion
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 right-36 h-64 w-64 rounded-full bg-white/5" />

          <HeartHandshake className="pointer-events-none absolute bottom-7 right-8 hidden h-36 w-36 text-white/10 sm:block" />
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Dashboard Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick look at your foundation's activities
              </p>
            </div>

            <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
              All time
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {item.title}
                      </p>

                      <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-800">
                        {item.value}
                      </h3>
                    </div>

                    <div className={`rounded-xl p-3 ${item.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs">
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        item.positive
                          ? "text-blue-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.positive ? (
                        <ArrowUpRight size={15} />
                      ) : (
                        <ArrowDownRight size={15} />
                      )}
                      {item.change}
                    </span>

                    <span className="text-slate-400">
                      vs last month
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Activity & Applications */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800">
                  Recent Activity
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Latest foundation updates
                </p>
              </div>

              <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Clock size={18} />
              </span>
            </div>

            <div className="space-y-5">
              {activities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <div key={index} className="flex gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1 border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-700">
                          {activity.name}
                        </p>

                        <span className="text-[11px] text-slate-400">
                          {activity.time}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {activity.detail}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-blue-700">
                        {activity.amount}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm xl:col-span-3">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-bold text-slate-800">
                  Recent Applications
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest submitted welfare applications
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
              >
                View all <MoveRight size={15} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs text-slate-500">
                    <th className="px-5 py-3 font-semibold">
                      Applicant
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Category
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Date
                    </th>
                    <th className="px-5 py-3 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-t border-slate-100 transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {app.name}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {app.id}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {app.type}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {app.date}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            app.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom Information */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Making a positive difference together.
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Thank you for being part of our mission to help those in need.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-blue-700">
            Fikr-e-Sadaat Welfare Foundation
          </span>
        </section>

      </div>
    </main>
  );
}
