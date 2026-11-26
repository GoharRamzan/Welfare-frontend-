
import { useEffect, useState } from "react";
import {
    X,
    UserRound,
    FileText,
    CalendarDays,
    RefreshCw,
    Banknote,
} from "lucide-react";
import toast from "react-hot-toast";

import beneficiaryService from "../../services/beneficiaryService";

const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(`${String(date).slice(0, 10)}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
        return "Not entered";
    }

    const value = Number(amount);

    if (!Number.isFinite(value)) return "Not entered";

    return `Rs. ${value.toLocaleString("en-PK", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

const getStatusClass = (status) => {
    const styles = {
        Pending: "bg-amber-50 text-amber-700",
        Approved: "bg-green-50 text-green-700",
        Rejected: "bg-red-50 text-red-700",
        Complete: "bg-green-50 text-green-700",
        Hold: "bg-gray-100 text-gray-600",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
};

export default function BeneficiaryDetailsModal({
    beneficiary,
    onClose,
}) {
    const [applications, setApplications] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        if (!beneficiary?.id) return;

        let cancelled = false;

        const fetchHistory = async () => {
            try {
                setLoadingHistory(true);

                const response =
                    await beneficiaryService.getBeneficiaryHistory(
                        beneficiary.id
                    );

                if (!cancelled) {
                    setApplications(response.data || []);
                }
            } catch (error) {
                console.error("Beneficiary History Error:", error);

                if (!cancelled) {
                    setApplications([]);
                    toast.error(
                        error.message || "Failed to load application history"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingHistory(false);
                }
            }
        };

        fetchHistory();

        return () => {
            cancelled = true;
        };
    }, [beneficiary?.id]);

    if (!beneficiary) return null;

    const details = [
        ["Beneficiary ID", beneficiary.beneficiary_code || `BEN-${beneficiary.id}`],
        ["Full Name", beneficiary.full_name],
        ["Father / Husband Name", beneficiary.father_name],
        ["CNIC", beneficiary.cnic],
        ["Contact Number", beneficiary.phone],
        ["WhatsApp Number", beneficiary.whatsapp_number],
        ["Complete Address", beneficiary.address],
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Beneficiary Profile
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Personal information and application history
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6 p-5 sm:p-6">

                    {/* Profile Card */}
                    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                        <div className="rounded-full bg-green-100 p-3 text-green-700">
                            <UserRound size={26} />
                        </div>

                        <div className="min-w-0">
                            <h3 className="break-words font-semibold text-gray-800">
                                {beneficiary.full_name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                {beneficiary.beneficiary_code ||
                                    `BEN-${beneficiary.id}`}
                            </p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <section>
                        <h3 className="mb-3 text-sm font-bold text-gray-800">
                            Personal Information
                        </h3>

                        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 px-4">
                            {details.slice(1).map(([label, value]) => (
                                <div
                                    key={label}
                                    className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-2"
                                >
                                    <p className="text-sm text-gray-500">
                                        {label}
                                    </p>

                                    <p className="break-words text-sm font-medium text-gray-800">
                                        {value || "-"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Application History */}
                    <section>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <FileText size={17} className="text-green-700" />
                                    Application History
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    All applications linked to this beneficiary
                                </p>
                            </div>

                            {!loadingHistory && (
                                <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                    {applications.length} Applications
                                </span>
                            )}
                        </div>

                        {loadingHistory ? (
                            <div className="rounded-xl border border-gray-100 p-8 text-center">
                                <RefreshCw
                                    size={23}
                                    className="mx-auto mb-2 animate-spin text-green-700"
                                />

                                <p className="text-sm text-gray-500">
                                    Loading application history...
                                </p>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-9 text-center">
                                <FileText
                                    size={30}
                                    className="mx-auto mb-3 text-gray-300"
                                />

                                <h4 className="text-sm font-semibold text-gray-700">
                                    No Applications Found
                                </h4>

                                <p className="mt-1 text-xs text-gray-500">
                                    No applications are currently linked to this beneficiary.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {applications.map((application) => (
                                    <div
                                        key={application.id}
                                        className="rounded-xl border border-gray-100 p-4 transition hover:border-green-200"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-bold text-green-700">
                                                    {application.application_no ||
                                                        `APP-${application.id}`}
                                                </p>

                                                <h4 className="mt-1 text-sm font-semibold text-gray-800">
                                                    {application.case_type || "General Assistance"}
                                                </h4>
                                            </div>

                                            <span
                                                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                    application.application_status
                                                )}`}
                                            >
                                                {application.application_status || "Pending"}
                                            </span>
                                        </div>

                                        {/* Dates */}
                                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={15}
                                                    className="shrink-0 text-gray-400"
                                                />

                                                <div>
                                                    <p className="text-[10px] text-gray-400">
                                                        Receiving Date
                                                    </p>

                                                    <p className="text-xs font-medium text-gray-700">
                                                        {formatDate(application.receiving_date)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={15}
                                                    className="shrink-0 text-gray-400"
                                                />

                                                <div>
                                                    <p className="text-[10px] text-gray-400">
                                                        Delivery Date
                                                    </p>

                                                    <p className="text-xs font-medium text-gray-700">
                                                        {formatDate(application.delivery_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assistance Amount */}
                                        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-green-50 px-3 py-3">
                                            <div className="flex items-center gap-2">
                                                <Banknote
                                                    size={18}
                                                    className="text-green-700"
                                                />

                                                <span className="text-xs font-medium text-gray-600">
                                                    Assistance Amount
                                                </span>
                                            </div>

                                            <span className="text-sm font-bold text-green-700">
                                                {formatAmount(application.amount)}
                                            </span>
                                        </div>

                                        {/* Task Status */}
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                                            <span className="text-xs text-gray-500">
                                                Task Status
                                            </span>

                                            <span
                                                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                    application.task_status
                                                )}`}
                                            >
                                                {application.task_status || "Pending"}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {application.description && (
                                            <div className="mt-3 border-t border-gray-100 pt-3">
                                                <p className="text-[10px] font-semibold uppercase text-gray-400">
                                                    Description
                                                </p>

                                                <p className="mt-1 whitespace-pre-wrap break-words text-xs text-gray-600">
                                                    {application.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Footer */}
                    <div className="flex justify-end border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
