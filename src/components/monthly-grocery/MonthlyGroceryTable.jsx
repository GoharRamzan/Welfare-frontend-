
import {
    Eye,
    Pencil,
    Trash2,
    UserRound,
} from "lucide-react";

function statusStyle(status) {
    const styles = {
        Approved: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
        Hold: "bg-yellow-100 text-yellow-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
}

export default function MonthlyGroceryTable({
    records,
    loading,
    onView,
    onEdit,
    onDelete,
}) {
    if (loading) {
        return (
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500">
                Loading grocery records...
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            {[
                                "S.No",
                                "REF#",
                                "Beneficiary",
                                "CNIC",
                                "Contact",
                                "WhatsApp",
                                "Month",
                                "Status",
                                "Actions",
                            ].map((heading) => (
                                <th
                                    key={heading}
                                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {records.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No grocery records found.
                                </td>
                            </tr>
                        ) : (
                            records.map((record, index) => (
                                <tr
                                    key={record.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {record.source_serial || index + 1}
                                    </td>

                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                        {record.ref_no || "-"}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50">
                                                <UserRound
                                                    size={17}
                                                    className="text-green-700"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {record.full_name || "Unknown"}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {record.beneficiary_code || "-"}
                                                </p>

                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    Father: {record.father_name || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {record.cnic || "-"}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {record.phone || "-"}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {record.whatsapp_number || "-"}
                                    </td>

                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {record.month_number}/{record.year}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(record.remarks)}`}
                                        >
                                            {record.remarks}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                title="View"
                                                onClick={() => onView(record)}
                                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                            >
                                                <Eye size={17} />
                                            </button>

                                            <button
                                                title="Edit"
                                                onClick={() => onEdit(record)}
                                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                title="Delete"
                                                onClick={() => onDelete(record)}
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
