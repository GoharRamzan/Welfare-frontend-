import API_URL from "../services/api.js";

async function request(endpoint = "", options = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}/applications${endpoint}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
    } catch (error) {
        console.error("Application API Network Error:", error);
        throw new Error("Unable to connect to server.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
}

const buildQuery = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            query.set(key, value);
        }
    });

    return query.toString();
};

export const applicationService = {
    getAll: (params = {}) => {
        const query = buildQuery(params);
        return request(query ? `?${query}` : "");
    },

    getById: (id) => request(`/${id}`),

    create: (application) =>
        request("", {
            method: "POST",
            body: JSON.stringify(application),
        }),

    update: (id, application) =>
        request(`/${id}`, {
            method: "PUT",
            body: JSON.stringify(application),
        }),

    delete: (id) =>
        request(`/${id}`, {
            method: "DELETE",
        }),
};