
const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",

    Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Hold: "bg-slate-100 text-slate-600 border-slate-200",

    Expired: "bg-red-50 text-red-700 border-red-200",
    "On Time": "bg-blue-50 text-blue-700 border-blue-200",
    "Not Set": "bg-slate-100 text-slate-500 border-slate-200",
};

export default function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold ${
                styles[status] || styles["Not Set"]
            }`}
        >
            {status || "Not Set"}
        </span>
    );
}
