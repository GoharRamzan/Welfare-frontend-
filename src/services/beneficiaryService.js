import API_URL from "../services/api.js";

const request = async (endpoint, options = {}) => {
    let response;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
    } catch (error) {
        console.error("Beneficiary API Network Error:", error);
        throw new Error("Unable to connect to server.");
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
};

const buildQuery = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            query.set(key, value);
        }
    });

    return query.toString();
};

const beneficiaryService = {
    // Search + pagination
    getBeneficiaries: (params = {}) => {
        const query = buildQuery(params);
        return request(`/beneficiaries${query ? `?${query}` : ""}`);
    },

    // Single beneficiary
    getBeneficiaryById: (id) =>
        request(`/beneficiaries/${id}`),

    // Application history of beneficiary
    getBeneficiaryHistory: (id, params = {}) => {
        const query = buildQuery(params);
        return request(
            `/beneficiaries/${id}/applications${query ? `?${query}` : ""}`
        );
    },

    // Create beneficiary
    createBeneficiary: (data) =>
        request("/beneficiaries", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Update beneficiary
    updateBeneficiary: (id, data) =>
        request(`/beneficiaries/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),
};

export default beneficiaryService;