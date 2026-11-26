
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    Plus,
    Search,
    SlidersHorizontal,
    Eye,
    Pencil,
    Clock3,
    CheckCircle2,
    AlertCircle,
    FileText,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
    RefreshCw,
} from "lucide-react";

import { applicationService } from "../services/applicationService";

import {
    mapApplication,
    mapToDatabase,
    getDeadline,
    formatDate,
} from "../components/application/applicationUtils";

import StatusBadge from "../components/application/StatusBadge";
import StatCard from "../components/application/StatCard";
import ApplicationModal from "../components/application/ApplicationModal";
import DetailsModal from "../components/application/DetailsModal";

const PAGE_SIZE = 20;

const CASE_TYPES = [
    "Grocery",
    "Marriage",
    "Medical",
    "Education",
    "Financial Assistance",
    "Household Assistance",
    "Multiple",
    "Other",
];

const TASK_FILTERS = ["All", "Pending", "Complete", "Hold"];

const APPLICATION_FILTERS = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
];

const EMPTY_PAGINATION = {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
};

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [caseFilter, setCaseFilter] = useState("All");
    const [statusType, setStatusType] = useState("Application");

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(EMPTY_PAGINATION);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [viewApplication, setViewApplication] = useState(null);

    // Load applications from backend
    const loadApplications = useCallback(async (pageNumber = page) => {
        try {
            setLoading(true);

            const response = await applicationService.getAll({
                search: search.trim(),
                page: pageNumber,
            });

            setApplications(
                (response.data || []).map(mapApplication)
            );

            setPagination(
                response.pagination || {
                    ...EMPTY_PAGINATION,
                    page: pageNumber,
                }
            );
        } catch (error) {
            console.error("Load Applications Error:", error);
            toast.error(error.message || "Failed to load applications");
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    // Search debounce and pagination
    useEffect(() => {
        const timer = setTimeout(() => {
            loadApplications();
        }, 350);

        return () => clearTimeout(timer);
    }, [loadApplications]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    // Current page statistics
    const stats = useMemo(() => {
        return {
            total: pagination.total,

            pending: applications.filter(
                (item) => item.applicationStatus === "Pending"
            ).length,

            approved: applications.filter(
                (item) => item.applicationStatus === "Approved"
            ).length,

            rejected: applications.filter(
                (item) => item.applicationStatus === "Rejected"
            ).length,

            completed: applications.filter(
                (item) => item.taskStatus === "Complete"
            ).length,

            expired: applications.filter(
                (item) =>
                    item.taskStatus !== "Complete" &&
                    item.deliveryDate &&
                    getDeadline(item.deliveryDate).status === "Expired"
            ).length,
        };
    }, [applications, pagination.total]);

    // Status and case filters apply to the currently loaded page.
    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const currentStatus =
                statusType === "Application"
                    ? app.applicationStatus
                    : app.taskStatus;

            const matchesStatus =
                activeFilter === "All" ||
                currentStatus === activeFilter;

            const matchesCase =
                caseFilter === "All" ||
                app.caseType === caseFilter;

            return matchesStatus && matchesCase;
        });
    }, [applications, activeFilter, caseFilter, statusType]);

    const filters =
        statusType === "Application"
            ? APPLICATION_FILTERS
            : TASK_FILTERS;

    const openAddModal = () => {
        setEditingApplication(null);
        setModalOpen(true);
    };

    const openEditModal = (application) => {
        setViewApplication(null);
        setEditingApplication(application);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingApplication(null);
    };

    // Save application
    const saveApplication = async (form) => {
        try {
            setSaving(true);

            const payload = mapToDatabase(form);

            if (editingApplication) {
                await applicationService.update(
                    editingApplication.id,
                    payload
                );

                toast.success("Application updated successfully");
            } else {
                const response = await applicationService.create(payload);

                const applicationNumber =
                    response.data?.application_no ||
                    response.data?.applicationNo ||
                    "created";

                toast.success(
                    `Application ${applicationNumber} successfully created`
                );
            }

            closeModal();

            // Reload from page 1 so new records are visible.
            setPage(1);
            await loadApplications(1);
        } catch (error) {
            console.error("Save Application Error:", error);
            toast.error(error.message || "Failed to save application");
        } finally {
            setSaving(false);
        }
    };

    const totalPages = Math.max(pagination.totalPages || 0, 1);

    // Current page status counts
    const getFilterCount = (filter) => {
        if (filter === "All") return applications.length;

        return applications.filter((app) =>
            statusType === "Application"
                ? app.applicationStatus === filter
                : app.taskStatus === filter
        ).length;
    };

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
                    type="button"
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
                    title="Pending (Current Page)"
                    value={stats.pending}
                    icon={Clock3}
                    color="bg-amber-50 text-amber-700"
                />

                <StatCard
                    title="Approved (Current Page)"
                    value={stats.approved}
                    icon={CheckCircle2}
                    color="bg-emerald-50 text-emerald-700"
                />

                <StatCard
                    title="Rejected (Current Page)"
                    value={stats.rejected}
                    icon={AlertCircle}
                    color="bg-red-50 text-red-700"
                />
            </div>

            {/* Records Panel */}
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
                                : `${filteredApplications.length} records on this page`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        {/* Search */}
                        <div className="relative min-w-0 sm:w-64">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search name, CNIC, application no..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-xs outline-none focus:border-blue-500 focus:bg-white"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => handleSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    title="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Case Type */}
                        <div className="relative">
                            <SlidersHorizontal
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <select
                                value={caseFilter}
                                onChange={(e) => setCaseFilter(e.target.value)}
                                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-xs font-medium text-slate-600 outline-none focus:border-blue-500 sm:w-44"
                            >
                                <option value="All">All Case Types</option>

                                {CASE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={14}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>

                        {/* Refresh */}
                        <button
                            type="button"
                            onClick={() => loadApplications()}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={14}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filter Type */}
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
                    <span className="text-xs font-semibold text-slate-500">
                        Filter by:
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            setStatusType("Application");
                            setActiveFilter("All");
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                            statusType === "Application"
                                ? "bg-[#12395f] text-white"
                                : "bg-slate-100 text-slate-600"
                        }`}
                    >
                        Application Status
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setStatusType("Task");
                            setActiveFilter("All");
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                            statusType === "Task"
                                ? "bg-[#12395f] text-white"
                                : "bg-slate-100 text-slate-600"
                        }`}
                    >
                        Task Status
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-2">
                    {filters.map((filter) => (
                        <button
                            type="button"
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                                activeFilter === filter
                                    ? "border-[#174c7b] text-[#174c7b]"
                                    : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {filter}

                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px]">
                                {getFilterCount(filter)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[1100px] border-collapse text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Application / Applicant
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Case Type
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Receiving Date
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Delivery Date
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Application Status
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Task Status
                                </th>

                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-slate-500">
                                    Deadline
                                </th>

                                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="8"
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
                                                <StatusBadge status={app.applicationStatus} />
                                            </td>

                                            <td className="px-4 py-3">
                                                <StatusBadge status={app.taskStatus} />
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
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        title="View Details"
                                                        onClick={() => setViewApplication(app)}
                                                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Edit Application"
                                                        onClick={() => openEditModal(app)}
                                                        className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
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
                                    <td colSpan="8" className="px-4 py-14 text-center">
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

                {/* Pagination Footer */}
                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        {pagination.total === 0
                            ? 0
                            : (page - 1) * PAGE_SIZE + 1}
                        {" "}to{" "}
                        {Math.min(page * PAGE_SIZE, pagination.total)}
                        {" "}of {pagination.total} applications
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={15} />
                            Previous
                        </button>

                        <span className="px-2 text-xs font-semibold text-slate-700">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() =>
                                setPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <ApplicationModal
                key={editingApplication?.id || "new-application"}
                open={modalOpen}
                onClose={closeModal}
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
