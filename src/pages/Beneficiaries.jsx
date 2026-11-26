
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Plus,
    RefreshCw,
    Users,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import beneficiaryService from "../services/beneficiaryService";

import BeneficiaryTable from "../components/beneficiaries/BeneficiaryTable";
import BeneficiaryModal from "../components/beneficiaries/BeneficiaryModal";
import BeneficiaryDetailsModal from "../components/beneficiaries/BeneficiaryDetailsModal";

const PAGE_SIZE = 20;

export default function Beneficiaries() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });

    const [modal, setModal] = useState({
        open: false,
        beneficiary: null,
    });

    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

    const fetchBeneficiaries = useCallback(async (pageNumber = page) => {
        try {
            setLoading(true);

            const response = await beneficiaryService.getBeneficiaries({
                search: search.trim(),
                page: pageNumber,
            });

            setBeneficiaries(response.data || []);

            setPagination(
                response.pagination || {
                    page: pageNumber,
                    limit: PAGE_SIZE,
                    total: 0,
                    totalPages: 0,
                }
            );
        } catch (error) {
            console.error("Fetch Beneficiaries Error:", error);
            toast.error(error.message || "Failed to load beneficiaries");
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBeneficiaries();
        }, 350);

        return () => clearTimeout(timer);
    }, [fetchBeneficiaries]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleAdd = () => {
        setModal({
            open: true,
            beneficiary: null,
        });
    };

    const handleEdit = (beneficiary) => {
        setModal({
            open: true,
            beneficiary,
        });
    };

    const closeModal = () => {
        setModal({
            open: false,
            beneficiary: null,
        });
    };

    const handleSave = async (formData) => {
        try {
            if (modal.beneficiary) {
                await beneficiaryService.updateBeneficiary(
                    modal.beneficiary.id,
                    formData
                );

                toast.success("Beneficiary updated successfully");
            } else {
                await beneficiaryService.createBeneficiary(formData);

                toast.success("Beneficiary added successfully");
            }

            closeModal();

            setPage(1);

            // Load page 1 immediately, including when already on page 1.
            await fetchBeneficiaries(1);
        } catch (error) {
            console.error("Save Beneficiary Error:", error);
            toast.error(error.message || "Unable to save beneficiary");
            throw error;
        }
    };

    const totalPages = Math.max(pagination.totalPages || 0, 1);

    return (
        <div className="space-y-5 p-4 md:p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Beneficiaries
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage beneficiary personal information and records.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-800"
                >
                    <Plus size={18} />
                    Add Beneficiary
                </button>
            </div>

            {/* Count + Search + Refresh */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">

                <div className="flex shrink-0 items-center gap-3 md:min-w-[220px]">
                    <div className="rounded-xl bg-green-50 p-3 text-green-700">
                        <Users size={23} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Total Beneficiaries
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">
                            {pagination.total}
                        </h2>
                    </div>
                </div>

                <div className="hidden h-12 border-l border-gray-200 md:block" />

                {/* Search */}
                <div className="relative min-w-0 flex-1">
                    <Search
                        size={19}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search name, CNIC, phone or address..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-10 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => handleSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            title="Clear search"
                        >
                            <X size={17} />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => fetchBeneficiaries()}
                    disabled={loading}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Beneficiary Table */}
            <BeneficiaryTable
                beneficiaries={beneficiaries}
                loading={loading}
                totalCount={pagination.total}
                onEdit={handleEdit}
                onView={setSelectedBeneficiary}
            />

            {/* Pagination */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                    Showing{" "}
                    {pagination.total === 0
                        ? 0
                        : (page - 1) * PAGE_SIZE + 1}
                    {" "}to{" "}
                    {Math.min(page * PAGE_SIZE, pagination.total)}
                    {" "}of {pagination.total} beneficiaries
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={15} />
                        Previous
                    </button>

                    <span className="px-2 text-xs font-semibold text-gray-700">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={page >= totalPages || loading}
                        onClick={() =>
                            setPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {modal.open && (
                <BeneficiaryModal
                    beneficiary={modal.beneficiary}
                    onClose={closeModal}
                    onSave={handleSave}
                />
            )}

            {/* Beneficiary Details + Application History */}
            {selectedBeneficiary && (
                <BeneficiaryDetailsModal
                    beneficiary={selectedBeneficiary}
                    onClose={() => setSelectedBeneficiary(null)}
                />
            )}
        </div>
    );
}
