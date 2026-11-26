
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Paperclip } from "lucide-react";

import {
    emptyForm,
    inputClass,
    getDeadline,
} from "./applicationUtils";

import FormField from "./FormField";
import StatusBadge from "./StatusBadge";

export default function ApplicationModal({
    open,
    onClose,
    onSave,
    editingApplication,
    saving,
}) {
    const [form, setForm] = useState({
        ...emptyForm,
        ...(editingApplication || {}),
    });

    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (open) {
            setForm({
                ...emptyForm,
                ...(editingApplication || {}),
            });

            setSelectedFile(null);
        }
    }, [open, editingApplication]);

    if (!open) return null;

    const updateField = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.applicantName.trim()) {
            toast.error("Applicant name is required");
            return;
        }

        const normalizedCNIC = form.cnic.replace(/\D/g, "");

        if (normalizedCNIC.length !== 13) {
            toast.error("Enter a valid 13-digit CNIC");
            return;
        }

        if (!form.receivingDate) {
            toast.error("Receiving date is required");
            return;
        }

        const amount = form.amount === "" || form.amount === null
            ? null
            : Number(form.amount);

        if (
            amount !== null &&
            (!Number.isFinite(amount) || amount < 0)
        ) {
            toast.error("Enter a valid assistance amount");
            return;
        }

        onSave({
            ...form,
            amount,
            cnic: form.cnic.trim(),
            applicantName: form.applicantName.trim(),
            fileName: selectedFile?.name || form.fileName || "",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5">
            <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            {editingApplication
                                ? "Edit Application"
                                : "Add New Application"}
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Enter applicant and welfare case information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto"
                >
                    <div className="space-y-5 p-5">
                        <section>
                            <h3 className="mb-3 text-sm font-bold text-[#12395f]">
                                Applicant Information
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <FormField label="Applicant Name *">
                                    <input
                                        className={inputClass}
                                        value={form.applicantName}
                                        onChange={(e) =>
                                            updateField("applicantName", e.target.value)
                                        }
                                        placeholder="Full name"
                                        required
                                    />
                                </FormField>

                                <FormField label="Father / Husband / Guardian Name">
                                    <input
                                        className={inputClass}
                                        value={form.guardianName}
                                        onChange={(e) =>
                                            updateField("guardianName", e.target.value)
                                        }
                                        placeholder="Guardian name"
                                    />
                                </FormField>

                                <FormField label="CNIC Number *">
                                    <input
                                        className={inputClass}
                                        value={form.cnic}
                                        onChange={(e) =>
                                            updateField("cnic", e.target.value)
                                        }
                                        placeholder="XXXXX-XXXXXXX-X"
                                        maxLength={15}
                                        required
                                    />
                                </FormField>

                                <FormField label="Phone Number">
                                    <input
                                        className={inputClass}
                                        value={form.phone}
                                        onChange={(e) =>
                                            updateField("phone", e.target.value)
                                        }
                                        placeholder="03XXXXXXXXX"
                                    />
                                </FormField>

                                <FormField label="Receiving Date *">
                                    <input
                                        type="date"
                                        className={inputClass}
                                        value={form.receivingDate}
                                        onChange={(e) =>
                                            updateField("receivingDate", e.target.value)
                                        }
                                        required
                                    />
                                </FormField>

                                <FormField
                                    label="Address"
                                    className="sm:col-span-2 lg:col-span-3"
                                >
                                    <textarea
                                        rows="2"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        value={form.address}
                                        onChange={(e) =>
                                            updateField("address", e.target.value)
                                        }
                                        placeholder="Complete applicant address"
                                    />
                                </FormField>
                            </div>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="mb-3 text-sm font-bold text-[#12395f]">
                                Case Information
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <FormField label="Approval Date">
                                    <input
                                        type="date"
                                        className={inputClass}
                                        value={form.approvalDate}
                                        onChange={(e) =>
                                            updateField("approvalDate", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Case Type">
                                    <select
                                        className={inputClass}
                                        value={form.caseType}
                                        onChange={(e) =>
                                            updateField("caseType", e.target.value)
                                        }
                                    >
                                        <option>Grocery</option>
                                        <option>Marriage</option>
                                        <option>Medical</option>
                                        <option>Education</option>
                                        <option>Financial Assistance</option>
                                        <option>Household Assistance</option>
                                        <option>Multiple</option>
                                        <option>Other</option>
                                    </select>
                                </FormField>

                                <FormField label="Assistance Amount (PKR)">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className={inputClass}
                                        value={form.amount}
                                        onChange={(e) =>
                                            updateField("amount", e.target.value)
                                        }
                                        placeholder="Enter amount"
                                    />
                                </FormField>

                                <FormField
                                    label="Description"
                                    className="sm:col-span-2 lg:col-span-3"
                                >
                                    <textarea
                                        rows="2"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField("description", e.target.value)
                                        }
                                        placeholder="Details about this welfare case..."
                                    />
                                </FormField>
                            </div>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="mb-3 text-sm font-bold text-[#12395f]">
                                Application Decision
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField label="Application Status">
                                    <select
                                        className={inputClass}
                                        value={form.applicationStatus}
                                        onChange={(e) =>
                                            updateField("applicationStatus", e.target.value)
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </FormField>

                                <FormField label="Task Status">
                                    <select
                                        className={inputClass}
                                        value={form.taskStatus}
                                        onChange={(e) =>
                                            updateField("taskStatus", e.target.value)
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Complete">Complete</option>
                                        <option value="Hold">Hold</option>
                                    </select>
                                </FormField>
                            </div>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="mb-3 text-sm font-bold text-[#12395f]">
                                Delivery & Deadline
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <FormField label="Delivery Date">
                                    <input
                                        type="date"
                                        className={inputClass}
                                        value={form.deliveryDate}
                                        onChange={(e) =>
                                            updateField("deliveryDate", e.target.value)
                                        }
                                    />
                                </FormField>

                                <FormField label="Days Remaining">
                                    <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                                        {form.deliveryDate
                                            ? `${getDeadline(form.deliveryDate).days} days`
                                            : "Not calculated"}
                                    </div>
                                </FormField>

                                <FormField label="Deadline Status">
                                    <div className="flex h-10 items-center">
                                        <StatusBadge
                                            status={
                                                form.deliveryDate
                                                    ? getDeadline(form.deliveryDate).status
                                                    : "Not Set"
                                            }
                                        />
                                    </div>
                                </FormField>
                            </div>
                        </section>

                        <div className="border-t border-slate-100" />

                        <section>
                            <h3 className="mb-3 text-sm font-bold text-[#12395f]">
                                Remarks & Supporting File
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField label="Remarks">
                                    <textarea
                                        rows="3"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        value={form.remarks}
                                        onChange={(e) =>
                                            updateField("remarks", e.target.value)
                                        }
                                        placeholder="Enter remarks..."
                                    />
                                </FormField>

                                <FormField label="Supporting File">
                                    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:border-blue-400">
                                        <Paperclip size={17} />

                                        <span className="min-w-0 flex-1 truncate">
                                            {selectedFile?.name ||
                                                form.fileName ||
                                                "Choose a file"}
                                        </span>

                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                setSelectedFile(e.target.files?.[0] || null)
                                            }
                                        />
                                    </label>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Only filename is saved currently, not the actual file.
                                    </p>
                                </FormField>
                            </div>
                        </section>
                    </div>

                    <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-[#12395f] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : editingApplication
                                    ? "Save Changes"
                                    : "Save Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
