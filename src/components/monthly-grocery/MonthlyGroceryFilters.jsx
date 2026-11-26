
import { Search, RotateCcw } from "lucide-react";

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

export default function MonthlyGroceryFilters({
    filters,
    setFilters,
    onReset,
}) {
    const currentYear = new Date().getFullYear();

    const years = Array.from(
        { length: 11 },
        (_, i) => currentYear - 5 + i
    );

    const update = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                {/* Search */}
                <div className="relative xl:col-span-2">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        value={filters.search}
                        onChange={(e) => update("search", e.target.value)}
                        placeholder="Name, CNIC, REF#, phone..."
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                </div>

                {/* Month */}
                <select
                    value={filters.month}
                    onChange={(e) => update("month", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                >
                    <option value="">All Months</option>

                    {months.map((month, index) => (
                        <option key={month} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>

                {/* Year */}
                <select
                    value={filters.year}
                    onChange={(e) => update("year", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                >
                    <option value="">All Years</option>

                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => update("status", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                >
                    <option value="">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hold">Hold</option>
                </select>

                {/* Reset */}
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs text-gray-500">
                        Created From
                    </label>

                    <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => update("fromDate", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs text-gray-500">
                        Created To
                    </label>

                    <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => update("toDate", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600"
                    />
                </div>
            </div>
        </div>
    );
}
