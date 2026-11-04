const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/applications${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const applicationService = {
  getAll: () => request(""),

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