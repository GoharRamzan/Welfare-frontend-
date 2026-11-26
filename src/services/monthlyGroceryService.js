import API_URL from "../services/api.js";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Request failed");
    }

    return result;
}

export const monthlyGroceryService = {
    getAll: (params = {}) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                query.set(key, value);
            }
        });

        return request(`/monthly-grocery?${query.toString()}`);
    },

    getStats: (params = {}) => {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== "" && value !== null && value !== undefined) {
                query.set(key, value);
            }
        });

        return request(`/monthly-grocery/stats?${query.toString()}`);
    },

    getById: (id) => request(`/monthly-grocery/${id}`),

    create: (data) =>
        request("/monthly-grocery", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id, data) =>
        request(`/monthly-grocery/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id) =>
        request(`/monthly-grocery/${id}`, {
            method: "DELETE",
        }),

    searchBeneficiaries: (search) => {
        const query = new URLSearchParams({
            search,
            page: "1",
            limit: "10",
        });

        return request(`/beneficiaries?${query.toString()}`);
    },
};
