
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = {
    full_name: "",
    father_name: "",
    cnic: "",
    phone: "",
    whatsapp_number: "",
    address: "",
};

export default function BeneficiaryModal({
    beneficiary,
    onClose,
    onSave,
}) {
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (beneficiary) {
            setForm({
                full_name: beneficiary.full_name || "",
                father_name: beneficiary.father_name || "",
                cnic: beneficiary.cnic || "",
                phone: beneficiary.phone || "",
                whatsapp_number: beneficiary.whatsapp_number || "",
                address: beneficiary.address || "",
            });
        } else {
            setForm(emptyForm);
        }
    }, [beneficiary]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.full_name.trim()) {
            toast.error("Full name is required");
            return;
        }

        const normalizedCNIC = form.cnic.replace(/\D/g, "");

        if (form.cnic.trim() && normalizedCNIC.length !== 13) {
            toast.error("CNIC must contain 13 digits");
            return;
        }

        try {
            setSaving(true);

            await onSave({
                ...form,
                full_name: form.full_name.trim(),
                father_name: form.father_name.trim() || null,
                cnic: form.cnic.trim() || null,
                phone: form.phone.trim() || null,
                whatsapp_number: form.whatsapp_number.trim() || null,
                address: form.address.trim() || null,
            });
        } catch {
            // Parent page handles API errors.
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { name: "full_name", label: "Full Name", required: true },
        { name: "father_name", label: "Father / Husband Name" },
        {
            name: "cnic",
            label: "CNIC",
            placeholder: "00000-0000000-0",
            maxLength: 15,
        },
        { name: "phone", label: "Contact Number" },
        { name: "whatsapp_number", label: "WhatsApp Number" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            {beneficiary ? "Edit Beneficiary" : "Add Beneficiary"}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Enter beneficiary personal information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    {field.label}
                                    {field.required && (
                                        <span className="ml-1 text-red-500">*</span>
                                    )}
                                </label>

                                <input
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    placeholder={
                                        field.placeholder || `Enter ${field.label}`
                                    }
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Complete Address
                        </label>

                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter complete address"
                            className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : beneficiary
                                    ? "Update Beneficiary"
                                    : "Save Beneficiary"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
