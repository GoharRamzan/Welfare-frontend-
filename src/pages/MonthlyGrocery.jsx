
import { useCallback, useEffect, useState } from "react";
import { Plus, ShoppingBasket } from "lucide-react";
import toast from "react-hot-toast";

import { monthlyGroceryService } from "../services/monthlyGroceryService";

import MonthlyGroceryStats from "../components/monthly-grocery/MonthlyGroceryStats";
import MonthlyGroceryFilters from "../components/monthly-grocery/MonthlyGroceryFilters";
import MonthlyGroceryTable from "../components/monthly-grocery/MonthlyGroceryTable";
import MonthlyGroceryPagination from "../components/monthly-grocery/MonthlyGroceryPagination";
import MonthlyGroceryModal from "../components/monthly-grocery/MonthlyGroceryModal";

const initialFilters = {
    search: "",
    month: "",
    year: "",
    status: "",
    fromDate: "",
    toDate: "",
};

export default function MonthlyGrocery() {
    const [filters, setFilters] = useState(initialFilters);

    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({
        total_records: 0,
        approved: 0,
        rejected: 0,
        hold: 0,
    });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedRecord, setSelectedRecord] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);

        const params = {
            ...filters,
            page,
            limit,
        };

        try {
            const [recordsResult, statsResult] = await Promise.all([
                monthlyGroceryService.getAll(params),
                monthlyGroceryService.getStats(filters),
            ]);

            setRecords(recordsResult.data || []);

            setPagination(
                recordsResult.pagination || {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                }
            );

            setStats(statsResult.data || {
                total_records: 0,
                approved: 0,
                rejected: 0,
                hold: 0,
            });
        } catch (error) {
            toast.error(error.message || "Records load nahi ho sake.");
        } finally {
            setLoading(false);
        }
    }, [filters, page, limit]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadData]);

    useEffect(() => {
        setPage(1);
    }, [filters, limit]);

    const resetFilters = () => {
        setFilters(initialFilters);
        setPage(1);
    };

    const openAdd = () => {
        setSelectedRecord(null);
        setModalMode("add");
        setModalOpen(true);
    };

    const openEdit = (record) => {
        setSelectedRecord(record);
        setModalMode("edit");
        setModalOpen(true);
    };

    const openView = (record) => {
        setSelectedRecord(record);
        setModalMode("view");
        setModalOpen(true);
    };

    const handleSubmit = async (data) => {
        if (modalMode === "edit" && selectedRecord) {
            await monthlyGroceryService.update(
                selectedRecord.id,
                data
            );

            toast.success("Grocery record update ho gaya.");
        } else {
            await monthlyGroceryService.create(data);

            toast.success("Grocery record add ho gaya.");
        }

        setModalOpen(false);
        setSelectedRecord(null);

        await loadData();
    };

    const handleDelete = async (record) => {
        const confirmed = window.confirm(
            `Kya aap ${record.full_name || "Unknown"} ka Monthly Grocery record delete karna chahte hain?`
        );

        if (!confirmed) return;

        try {
            await monthlyGroceryService.delete(record.id);

            toast.success("Record delete ho gaya.");

            if (records.length === 1 && page > 1) {
                setPage((prev) => prev - 1);
            } else {
                await loadData();
            }
        } catch (error) {
            toast.error(error.message || "Record delete nahi ho saka.");
        }
    };

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-green-50 p-2">
                            <ShoppingBasket
                                size={23}
                                className="text-green-700"
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Monthly Grocery
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage monthly grocery assistance records and beneficiaries.
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-800"
                >
                    <Plus size={18} />
                    Add Grocery
                </button>
            </div>

            {/* Statistics */}
            <MonthlyGroceryStats stats={stats} />

            {/* Filters */}
            <MonthlyGroceryFilters
                filters={filters}
                setFilters={setFilters}
                onReset={resetFilters}
            />

            {/* Table */}
            <MonthlyGroceryTable
                records={records}
                loading={loading}
                onView={openView}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            <MonthlyGroceryPagination
                pagination={pagination}
                setPage={setPage}
                setLimit={setLimit}
            />

            {/* Modal */}
            <MonthlyGroceryModal
                open={modalOpen}
                mode={modalMode}
                record={selectedRecord}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
