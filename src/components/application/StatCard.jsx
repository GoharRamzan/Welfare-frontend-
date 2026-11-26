
export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
}) {
    return (
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
            >
                <Icon size={19} />
            </div>

            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500">
                    {title}
                </p>

                <h3 className="mt-0.5 text-xl font-bold text-slate-800">
                    {value}
                </h3>
            </div>
        </div>
    );
}
