
import { useEffect, useState } from "react";
import { X, Search, UserRound } from "lucide-react";
import { monthlyGroceryService } from "../../services/monthlyGroceryService";

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
];

const emptyForm = {
    beneficiary_id: "",
    source_serial: "",
    ref_no: "",
    month_number: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    remarks: "Approved",
};

export default function MonthlyGroceryModal({
    open,
    mode,
    record,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState("");
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const readOnly = mode === "view";

    useEffect(() => {
        if (!open) return;

        if (record) {
            setForm({
                beneficiary_id: record.beneficiary_id || "",
                source_serial: record.source_serial || "",
                ref_no: record.ref_no || "",
                month_number: record.month_number || 11,
                year: record.year || 2026,
                remarks: record.remarks || "Approved",
            });

            setSelected(record);
        } else {
            setForm({
                ...emptyForm,
                month_number: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
            });

            setSelected(null);
        }

        setSearch("");
        setBeneficiaries([]);
        setError("");
    }, [open, record]);

    useEffect(() => {
        if (!open || readOnly || !search.trim()) {
            setBeneficiaries([]);
            return;
        }

        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);

                const result =
                    await monthlyGroceryService.searchBeneficiaries(search);

                if (!cancelled) {
                    setBeneficiaries(result.data || []);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(error.message);
                    setBeneficiaries([]);
                }
            } finally {
                if (!cancelled) {
                    setSearchLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search, open, readOnly]);

    if (!open) return null;

    const update = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const chooseBeneficiary = (beneficiary) => {
        setSelected(beneficiary);

        update("beneficiary_id", beneficiary.id);

        setSearch("");
        setBeneficiaries([]);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.beneficiary_id) {
            setError("Beneficiary select karna zaroori hai.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await onSubmit({
                ...form,
                beneficiary_id: Number(form.beneficiary_id),
                month_number: Number(form.month_number),
                year: Number(form.year),
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {mode === "view"
                                ? "Grocery Record Details"
                                : mode === "edit"
                                ? "Edit Grocery Record"
                                : "Add Monthly Grocery"}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Beneficiary assistance record
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto p-5"
                >
                    <div className="space-y-4">

                        {/* Beneficiary search */}
                        {!readOnly && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Search Beneficiary
                                </label>

                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Name, CNIC, phone or beneficiary code..."
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>

                                {searchLoading && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Searching beneficiaries...
                                    </p>
                                )}

                                {beneficiaries.length > 0 && (
                                    <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-gray-200">
                                        {beneficiaries.map((beneficiary) => (
                                            <button
                                                key={beneficiary.id}
                                                type="button"
                                                onClick={() =>
                                                    chooseBeneficiary(beneficiary)
                                                }
                                                className="flex w-full items-start gap-3 border-b border-gray-100 p-3 text-left last:border-0 hover:bg-green-50"
                                            >
                                                <div className="rounded-full bg-green-100 p-2">
                                                    <UserRound
                                                        size={17}
                                                        className="text-green-700"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {beneficiary.full_name || "Unknown"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {beneficiary.beneficiary_code || "-"}
                                                        {" · "}
                                                        {beneficiary.cnic || "-"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {beneficiary.phone || "-"}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {search.trim() && !searchLoading &&
                                    beneficiaries.length === 0 && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        No beneficiaries found.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Selected Beneficiary */}
                        {selected && (
                            <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-800">
                                        Selected Beneficiary
                                    </p>

                                    {!readOnly && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelected(null);
                                                update("beneficiary_id", "");
                                            }}
                                            className="text-xs font-medium text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {[
                                        ["Name", selected.full_name],
                                        ["Beneficiary Code", selected.beneficiary_code],
                                        ["Father Name", selected.father_name],
                                        ["CNIC", selected.cnic],
                                        ["Phone", selected.phone],
                                        ["WhatsApp", selected.whatsapp_number],
                                        ["Address", selected.address],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-xs text-gray-500">
                                                {label}
                                            </p>

                                            <p className="mt-1 break-words text-sm font-medium text-gray-700">
                                                {value || "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!selected && readOnly && (
                            <p className="text-sm text-gray-500">
                                Beneficiary details unavailable.
                            </p>
                        )}

                        {/* REF */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                REF#
                            </label>

                            <input
                                value={form.ref_no}
                                disabled={readOnly}
                                onChange={(e) => update("ref_no", e.target.value)}
                                placeholder="Enter reference number"
                                className={inputClass}
                            />
                        </div>

                        {/* Source serial */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Source S.NO
                            </label>

                            <input
                                value={form.source_serial}
                                disabled={readOnly}
                                onChange={(e) =>
                                    update("source_serial", e.target.value)
                                }
                                placeholder="Optional"
                                className={inputClass}
                            />
                        </div>

                        {/* Month & Year */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Month
                                </label>

                                <select
                                    value={form.month_number}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                        update("month_number", e.target.value)
                                    }
                                    className={inputClass}
                                >
                                    {months.map((month, index) => (
                                        <option key={month} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Year
                                </label>

                                <input
                                    type="number"
                                    value={form.year}
                                    disabled={readOnly}
                                    min="2000"
                                    max="2100"
                                    onChange={(e) =>
                                        update("year", e.target.value)
                                    }
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Remarks / Status
                            </label>

                            <select
                                value={form.remarks}
                                disabled={readOnly}
                                onChange={(e) =>
                                    update("remarks", e.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hold">Hold</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Close
                        </button>

                        {!readOnly && (
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : mode === "edit"
                                    ? "Update Record"
                                    : "Add Record"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
