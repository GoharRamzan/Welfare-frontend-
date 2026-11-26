
import { X, Pencil } from "lucide-react";

import {
    getDeadline,
    formatDate,
} from "./applicationUtils";

import StatusBadge from "./StatusBadge";

export default function DetailsModal({
    application,
    onClose,
    onEdit,
}) {
    if (!application) return null;

    const deadline = getDeadline(application.deliveryDate);

    const formattedAmount =
        application.amount !== null &&
        application.amount !== undefined &&
        application.amount !== ""
            ? `Rs. ${Number(application.amount).toLocaleString("en-PK", {
                maximumFractionDigits: 2,
            })}`
            : "Not entered";

    const details = [
        ["Application Number", application.applicationNo],
        ["Linked Beneficiary ID", application.beneficiaryId || "Not Linked"],
        ["Receiving Date", formatDate(application.receivingDate)],
        ["Applicant Name", application.applicantName],
        ["Father / Husband / Guardian", application.guardianName],
        ["CNIC Number", application.cnic],
        ["Phone Number", application.phone],
        ["Address", application.address],
        ["Approval Date", formatDate(application.approvalDate)],
        ["Case Type", application.caseType],
        ["Assistance Amount", formattedAmount],
        ["Description", application.description],
        ["Delivery Date", formatDate(application.deliveryDate)],
        [
            "Days Remaining",
            deadline.days === null ? "Not set" : `${deadline.days} days`,
        ],
        ["Deadline Status", deadline.status],
        ["Remarks", application.remarks],
        ["Attached File", application.fileName],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Application Details
                        </h2>

                        <p className="text-xs text-slate-500">
                            {application.applicationNo}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
                    <div className="border-b border-slate-100 pb-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Application Status
                        </p>
                        <StatusBadge status={application.applicationStatus} />
                    </div>

                    <div className="border-b border-slate-100 pb-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Task Status
                        </p>
                        <StatusBadge status={application.taskStatus} />
                    </div>

                    {details.map(([label, value]) => (
                        <div
                            key={label}
                            className="min-w-0 border-b border-slate-100 pb-3"
                        >
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                {label}
                            </p>

                            <p className="break-words text-sm font-medium text-slate-700">
                                {value || "—"}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={() => onEdit(application)}
                        className="flex items-center gap-2 rounded-lg bg-[#12395f] px-4 py-2 text-sm font-semibold text-white"
                    >
                        <Pencil size={15} />
                        Edit Application
                    </button>
                </div>
            </div>
        </div>
    );
}
