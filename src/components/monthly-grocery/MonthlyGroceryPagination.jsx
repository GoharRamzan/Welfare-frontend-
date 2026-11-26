
export default function MonthlyGroceryPagination({
    pagination,
    setPage,
    setLimit,
}) {
    const page = pagination.page || 1;
    const totalPages = pagination.totalPages || 0;
    const total = pagination.total || 0;
    const limit = pagination.limit || 20;

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>
                    Showing {start}–{end} of {total}
                </span>

                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="rounded-lg border border-gray-200 px-2 py-1.5 outline-none"
                >
                    {[10, 20, 50, 100].map((value) => (
                        <option key={value} value={value}>
                            {value} / page
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
                >
                    Previous
                </button>

                <span className="min-w-20 text-center text-sm text-gray-600">
                    {totalPages === 0 ? 0 : page} / {totalPages}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
