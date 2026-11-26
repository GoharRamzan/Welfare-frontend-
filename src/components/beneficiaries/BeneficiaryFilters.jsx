
import { Search, X } from "lucide-react";

export default function BeneficiaryFilters({ search, setSearch }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, CNIC, phone or address..."
                    className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                        <X size={17} />
                    </button>
                )}
            </div>
        </div>
    );
}
