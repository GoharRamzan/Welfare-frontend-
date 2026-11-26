
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";

const cards = [
    {
        key: "total_records",
        label: "Total Records",
        icon: Users,
    },
    {
        key: "approved",
        label: "Approved",
        icon: CheckCircle2,
    },
    {
        key: "rejected",
        label: "Rejected",
        icon: XCircle,
    },
    {
        key: "hold",
        label: "On Hold",
        icon: Clock,
    },
];

export default function MonthlyGroceryStats({ stats }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.key}
                        className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.label}
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-gray-800">
                                    {Number(stats?.[card.key] || 0).toLocaleString()}
                                </h3>
                            </div>

                            <div className="rounded-lg bg-green-50 p-3">
                                <Icon
                                    size={22}
                                    className="text-green-700"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
