
import { useState } from "react";
import { X, CalendarDays } from "lucide-react";

const monthNames = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function MonthlyRecordModal({
  beneficiary,
  selectedMonth,
  selectedYear,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    month: selectedMonth || String(new Date().getMonth() + 1),
    year: selectedYear || String(new Date().getFullYear()),
    list_status: "Approved",
    remarks: "",
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.month || !form.year) return;

    try {
      setSaving(true);

      await onSave({
        month: Number(form.month),
        year: Number(form.year),
        list_status: form.list_status,
        remarks: form.remarks.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Monthly Grocery Record
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Update monthly status for this beneficiary.
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

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CalendarDays size={18} />
              <span className="text-sm font-semibold">
                {beneficiary?.full_name}
              </span>
            </div>
            <p className="mt-1 text-xs text-green-700">
              CNIC: {beneficiary?.cnic || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                value={form.month}
                onChange={(e) =>
                  setForm({ ...form, month: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Grocery Status
            </label>
            <select
              value={form.list_status}
              onChange={(e) =>
                setForm({ ...form, list_status: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            >
              <option value="Approved">Approved</option>
              <option value="Canceled">Canceled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              value={form.remarks}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              rows={3}
              placeholder="Enter remarks (optional)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Monthly Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
