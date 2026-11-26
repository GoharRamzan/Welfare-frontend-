
import { Edit, Eye, Users } from "lucide-react";

export default function BeneficiaryTable({
    beneficiaries = [],
    loading = false,
    totalCount,
    onEdit,
    onView,
}) {
    if (loading) {
        return (
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />
                <p className="text-sm text-gray-500">
                    Loading beneficiaries...
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-800">
                    All Beneficiaries
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    {totalCount ?? beneficiaries.length} total records
                </p>
            </div>

            {beneficiaries.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
                    <Users size={32} className="mb-3 text-gray-400" />

                    <h3 className="font-semibold text-gray-700">
                        No beneficiaries found
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a beneficiary or try another search.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-5 py-4">ID</th>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">CNIC</th>
                                <th className="px-5 py-4">Contact</th>
                                <th className="px-5 py-4">Address</th>
                                <th className="px-5 py-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {beneficiaries.map((item) => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-green-50/50"
                                >
                                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-700">
                                        {item.beneficiary_code || `BEN-${item.id}`}
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-800">
                                            {item.full_name || "-"}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.father_name || "-"}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {item.cnic || "-"}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                                        {item.phone || "-"}
                                    </td>

                                    <td className="max-w-[220px] px-5 py-4 text-gray-600">
                                        <p className="line-clamp-2">
                                            {item.address || "-"}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onView(item)}
                                                title="View"
                                                className="rounded-lg border border-gray-200 p-2 text-green-700 hover:bg-green-50"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onEdit(item)}
                                                title="Edit"
                                                className="rounded-lg border border-gray-200 p-2 text-blue-600 hover:bg-blue-50"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
