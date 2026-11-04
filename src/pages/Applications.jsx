
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { applicationService } from "../services/applicationService";
import {
    Plus,
    Search,
    SlidersHorizontal,
    Eye,
    Pencil,
    X,
    Clock3,
    CheckCircle2,
    AlertCircle,
    FileText,
    Paperclip,
    ChevronDown,
} from "lucide-react";

// Empty form
const emptyForm = {
    applicationNo: "",
    receivingDate: new Date().toISOString().slice(0, 10),
    applicantName: "",
    guardianName: "",
    cnic: "",
    phone: "",
    address: "",
    approvalDate: "",
    caseType: "Grocery",
    description: "",
    deliveryDate: "",
    taskStatus: "Pending",
    remarks: "",
    fileName: "",
};

const inputClass =
    "w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

// Convert database dates into input-compatible dates
function formatInputDate(date) {
    if (!date) return "";
    return String(date).slice(0, 10);
}

// Convert database object into frontend object
function mapApplication(app) {
    return {
        id: app.id,
        applicationNo: app.application_no || "",
        receivingDate: formatInputDate(app.receiving_date),
        applicantName: app.applicant_name || "",
        guardianName: app.guardian_name || "",
        cnic: app.cnic || "",
        phone: app.phone || "",
        address: app.address || "",
        approvalDate: formatInputDate(app.approval_date),
        caseType: app.case_type || "",
        description: app.description || "",
        deliveryDate: formatInputDate(app.delivery_date),
        taskStatus: app.task_status || "Pending",
        remarks: app.remarks || "",
        fileName: app.attachment || "",
    };
}

// Convert frontend object into database object
function mapToDatabase(form) {
  return {
    receiving_date: form.receivingDate,
    applicant_name: form.applicantName,
    guardian_name: form.guardianName || null,
    cnic: form.cnic || null,
    phone: form.phone || null,
    address: form.address || null,
    approval_date: form.approvalDate || null,
    case_type: form.caseType || null,
    description: form.description || null,
    delivery_date: form.deliveryDate || null,
    task_status: form.taskStatus || "Pending",
    remarks: form.remarks || null,
    attachment: form.fileName || null,
  };
}

function getDeadline(date) {
    if (!date) return { days: null, status: "Not Set" };

    const today = new Date();

    const todayUTC = Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const delivery = new Date(`${date}T00:00:00`);

    const deliveryUTC = Date.UTC(
        delivery.getFullYear(),
        delivery.getMonth(),
        delivery.getDate()
    );

    const days = Math.round(
        (deliveryUTC - todayUTC) / (1000 * 60 * 60 * 24)
    );

    return {
        days,
        status: days < 0 ? "Expired" : "On Time",
    };
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-amber-50 text-amber-700 border-amber-200",
        Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Hold: "bg-slate-100 text-slate-600 border-slate-200",
        Expired: "bg-red-50 text-red-700 border-red-200",
        "On Time": "bg-blue-50 text-blue-700 border-blue-200",
        "Not Set": "bg-slate-100 text-slate-500 border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold ${styles[status] || styles["Not Set"]
                }`}
        >
            {status}
        </span>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
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

function FormField({ label, children, className = "" }) {
    return (
        <div className={className}>
            <label className={labelClass}>{label}</label>
            {children}
        </div>
    );
}

// Add / Edit Modal
function ApplicationModal({
    open,
    onClose,
    onSave,
    editingApplication,
    saving,
}) {
    const [form, setForm] = useState(
        editingApplication || emptyForm
    );

    const [selectedFile, setSelectedFile] = useState(null);

    if (!open) return null;

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.applicantName.trim()) {
            toast.error("Applicant name is required");
            return;
        }

        if (!form.cnic.trim()) {
            toast.error("CNIC number is required");
            return;
        }

        if (!form.receivingDate) {
            toast.error("Receiving date is required");
            return;
        }

        onSave({
            ...form,
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

                        {/* Applicant Information */}
                        <section>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12395f]">
                                <span className="h-5 w-1 rounded-full bg-blue-600" />
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
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                        {/* Case Information */}
                        <section>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12395f]">
                                <span className="h-5 w-1 rounded-full bg-blue-600" />
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

                                <FormField
                                    label="Description"
                                    className="sm:col-span-2 lg:col-span-3"
                                >
                                    <textarea
                                        rows="2"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField("description", e.target.value)
                                        }
                                        placeholder="Write details about this welfare case..."
                                    />
                                </FormField>
                            </div>
                        </section>

                        <div className="border-t border-slate-100" />

                        {/* Delivery Information */}
                        <section>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12395f]">
                                <span className="h-5 w-1 rounded-full bg-blue-600" />
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

                        {/* Task Status */}
                        <section>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#12395f]">
                                <span className="h-5 w-1 rounded-full bg-blue-600" />
                                Task Progress & Remarks
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <FormField label="Task Status">
                                    <select
                                        className={inputClass}
                                        value={form.taskStatus}
                                        onChange={(e) =>
                                            updateField("taskStatus", e.target.value)
                                        }
                                    >
                                        <option>Pending</option>
                                        <option>Complete</option>
                                        <option>Hold</option>
                                    </select>
                                </FormField>

                                <FormField label="Remarks for Completion / Hold">
                                    <textarea
                                        rows="2"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        value={form.remarks}
                                        onChange={(e) =>
                                            updateField("remarks", e.target.value)
                                        }
                                        placeholder="Enter remarks..."
                                    />
                                </FormField>

                                <FormField
                                    label="Supporting File"
                                    className="sm:col-span-2"
                                >
                                    <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50">
                                        <Paperclip size={17} className="text-blue-700" />

                                        <span className="min-w-0 flex-1 truncate">
                                            {selectedFile?.name ||
                                                form.fileName ||
                                                "Choose a file to attach"}
                                        </span>

                                        <span className="shrink-0 rounded-md bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                                            Browse
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
                                        Currently only the file name is saved, not the actual file.
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
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-[#12395f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0b2d4d] disabled:cursor-not-allowed disabled:opacity-60"
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

// Details Modal
function DetailsModal({ application, onClose, onEdit }) {
    if (!application) return null;

    const deadline = getDeadline(application.deliveryDate);

    const details = [
        ["Application Number", application.applicationNo],
        ["Receiving Date", formatDate(application.receivingDate)],
        ["Applicant Name", application.applicantName],
        ["Father / Husband / Guardian", application.guardianName],
        ["CNIC Number", application.cnic],
        ["Phone Number", application.phone],
        ["Address", application.address],
        ["Approval Date", formatDate(application.approvalDate)],
        ["Case Type", application.caseType],
        ["Description", application.description],
        ["Delivery Date", formatDate(application.deliveryDate)],
        [
            "Days Remaining",
            deadline.days === null ? "Not set" : `${deadline.days} days`,
        ],
        ["Deadline Status", deadline.status],
        ["Task Status", application.taskStatus],
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
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
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
                        onClick={onClose}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                    >
                        Close
                    </button>

                    <button
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

// Main Applications Page
export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [caseFilter, setCaseFilter] = useState("All");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [viewApplication, setViewApplication] = useState(null);

    // Load applications from PostgreSQL
    useEffect(() => {
        const loadApplications = async () => {
            try {
                setLoading(true);

                const response = await applicationService.getAll();

                setApplications(
                    (response.applications || []).map(mapApplication)
                );
            } catch (error) {
                console.error("Load Applications Error:", error);
                toast.error(error.message || "Failed to load applications");
            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, []);

    // Statistics
    const stats = useMemo(() => {
        return {
            total: applications.length,

            pending: applications.filter(
                (a) => a.taskStatus === "Pending"
            ).length,

            complete: applications.filter(
                (a) => a.taskStatus === "Complete"
            ).length,

            expired: applications.filter(
                (a) =>
                    a.taskStatus !== "Complete" &&
                    a.deliveryDate &&
                    getDeadline(a.deliveryDate).status === "Expired"
            ).length,
        };
    }, [applications]);

    // Search and filters
    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const query = search.toLowerCase();

            const matchesSearch = [
                app.applicationNo,
                app.applicantName,
                app.guardianName,
                app.cnic,
                app.phone,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query);

            const matchesStatus =
                activeFilter === "All" ||
                app.taskStatus === activeFilter;

            const matchesCase =
                caseFilter === "All" ||
                app.caseType === caseFilter;

            return matchesSearch && matchesStatus && matchesCase;
        });
    }, [applications, search, activeFilter, caseFilter]);

    const openAddModal = () => {
        setEditingApplication(null);
        setModalOpen(true);
    };

    const openEditModal = (application) => {
        setViewApplication(null);
        setEditingApplication(application);
        setModalOpen(true);
    };

    // Save application to PostgreSQL
   const saveApplication = async (form) => {
  try {
    setSaving(true);

    if (editingApplication) {
      // Existing application number preserve hoga
      const payload = mapToDatabase(form);

      const response = await applicationService.update(
        editingApplication.id,
        payload
      );

      const updatedApplication = mapApplication(
        response.application
      );

      setApplications((prev) =>
        prev.map((item) =>
          item.id === updatedApplication.id
            ? updatedApplication
            : item
        )
      );

      toast.success("Application updated successfully");
    } else {
      // New application: number PostgreSQL generate karega
      const payload = mapToDatabase(form);

      const response = await applicationService.create(payload);

      const newApplication = mapApplication(
        response.application
      );

      setApplications((prev) => [
        newApplication,
        ...prev,
      ]);

      toast.success(
        `Application ${newApplication.applicationNo} created successfully`
      );
    }

    setModalOpen(false);
    setEditingApplication(null);

  } catch (error) {
    console.error("Save Application Error:", error);
    toast.error(error.message || "Failed to save application");

  } finally {
    setSaving(false);
  }
};

    const filters = ["All", "Pending", "Complete", "Hold"];

    return (
        <div className="min-h-full space-y-4 bg-[#f5f7fb] p-4 sm:p-5 lg:p-6">

            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <FileText size={21} className="text-[#174c7b]" />

                        <h1 className="text-xl font-bold tracking-tight text-slate-800">
                            Applications
                        </h1>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Manage, review and track welfare applications.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex h-10 items-center gap-2 rounded-lg bg-[#12395f] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2d4d]"
                >
                    <Plus size={17} />
                    Add Application
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <StatCard
                    title="Total Applications"
                    value={stats.total}
                    icon={FileText}
                    color="bg-blue-50 text-blue-700"
                />

                <StatCard
                    title="Pending Applications"
                    value={stats.pending}
                    icon={Clock3}
                    color="bg-amber-50 text-amber-700"
                />

                <StatCard
                    title="Completed Applications"
                    value={stats.complete}
                    icon={CheckCircle2}
                    color="bg-emerald-50 text-emerald-700"
                />

                <StatCard
                    title="Expired Deadlines"
                    value={stats.expired}
                    icon={AlertCircle}
                    color="bg-red-50 text-red-700"
                />
            </div>

            {/* Main Table Panel */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">

                    <div>
                        <h2 className="text-sm font-bold text-slate-800">
                            Application Records
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {loading
                                ? "Loading records..."
                                : `${filteredApplications.length} records found`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">

                        <div className="relative min-w-0 sm:w-64">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, CNIC, application no..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                            />
                        </div>

                        <div className="relative">
                            <SlidersHorizontal
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <select
                                value={caseFilter}
                                onChange={(e) => setCaseFilter(e.target.value)}
                                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-600 outline-none focus:border-blue-500 sm:w-40"
                            >
                                <option value="All">All Case Types</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Marriage">Marriage</option>
                                <option value="Medical">Medical</option>
                                <option value="Education">Education</option>
                                <option value="Financial Assistance">Financial Assistance</option>
                                <option value="Household Assistance">Household Assistance</option>
                                <option value="Multiple">Multiple</option>
                                <option value="Other">Other</option>
                            </select>

                            <ChevronDown
                                size={14}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-2">
                    {filters.map((filter) => {
                        const count =
                            filter === "All"
                                ? applications.length
                                : applications.filter(
                                    (a) => a.taskStatus === filter
                                ).length;

                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${activeFilter === filter
                                        ? "border-[#174c7b] text-[#174c7b]"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {filter}

                                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px]">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Applications Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left">

                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Application / Applicant
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Case Type
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Receiving Date
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Delivery Date
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Deadline
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Task Status
                                </th>

                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-14 text-center text-sm text-slate-500"
                                    >
                                        Loading applications...
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => {
                                    const deadline = getDeadline(app.deliveryDate);

                                    return (
                                        <tr
                                            key={app.id}
                                            className="transition hover:bg-slate-50/80"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="text-xs font-bold text-[#174c7b]">
                                                    {app.applicationNo}
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-700">
                                                    {app.applicantName}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    {app.cnic}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                                    {app.caseType || "—"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-xs text-slate-600">
                                                {formatDate(app.receivingDate)}
                                            </td>

                                            <td className="px-4 py-3 text-xs text-slate-600">
                                                {formatDate(app.deliveryDate)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    <StatusBadge
                                                        status={
                                                            app.taskStatus === "Complete"
                                                                ? "On Time"
                                                                : deadline.status
                                                        }
                                                    />

                                                    <p className="text-[10px] text-slate-400">
                                                        {deadline.days === null
                                                            ? "No date"
                                                            : deadline.days < 0
                                                                ? `${Math.abs(deadline.days)} days overdue`
                                                                : `${deadline.days} days remaining`}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <StatusBadge status={app.taskStatus} />
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        title="View Details"
                                                        onClick={() => setViewApplication(app)}
                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        title="Edit Application"
                                                        onClick={() => openEditModal(app)}
                                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}

                            {!loading && filteredApplications.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-4 py-14 text-center">
                                        <FileText
                                            size={30}
                                            className="mx-auto mb-3 text-slate-300"
                                        />

                                        <p className="text-sm font-semibold text-slate-600">
                                            No applications found
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Try changing your search or filters.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">
                        Showing {filteredApplications.length} of{" "}
                        {applications.length} applications
                    </p>

                    <p className="text-[11px] text-slate-400">
                        Application Management
                    </p>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <ApplicationModal
                key={editingApplication?.id || "new-application"}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingApplication(null);
                }}
                onSave={saveApplication}
                editingApplication={editingApplication}
                saving={saving}
            />

            {/* Details Modal */}
            <DetailsModal
                application={viewApplication}
                onClose={() => setViewApplication(null)}
                onEdit={openEditModal}
            />
        </div>
    );
}
