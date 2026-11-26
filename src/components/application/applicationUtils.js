
export const emptyForm = {
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
    amount: "",
    deliveryDate: "",
    applicationStatus: "Pending",
    taskStatus: "Pending",
    remarks: "",
    fileName: "",
};

export const inputClass =
    "w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const labelClass =
    "mb-1.5 block text-xs font-semibold text-slate-600";

export function formatInputDate(date) {
    if (!date) return "";
    return String(date).slice(0, 10);
}

export function mapApplication(app) {
    return {
        id: app.id,
        beneficiaryId: app.beneficiary_id || null,
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
        amount: app.amount ?? "",
        deliveryDate: formatInputDate(app.delivery_date),
        applicationStatus: app.application_status || "Pending",
        taskStatus: app.task_status || "Pending",
        remarks: app.remarks || "",
        fileName: app.attachment || "",
    };
}

export function mapToDatabase(form) {
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
        amount:
            form.amount === "" || form.amount === null
                ? null
                : Number(form.amount),
        delivery_date: form.deliveryDate || null,
        application_status: form.applicationStatus || "Pending",
        task_status: form.taskStatus || "Pending",
        remarks: form.remarks || null,
        attachment: form.fileName || null,
    };
}

export function getDeadline(date) {
    if (!date) {
        return {
            days: null,
            status: "Not Set",
        };
    }

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

export function formatDate(date) {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}
