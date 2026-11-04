
// const API_URL = (
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api"
// ).replace(/\/+$/, "");
const API_URL ='https://fikre-sadat.vercel.app/api'
// Common API request
const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });

    const text = await response.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Invalid server response: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("Donor API Error:", {
      url,
      message: error.message,
    });

    throw error;
  }
};

// Map donation
const mapDonation = (donation) => ({
  id: donation.id,
  donationNo: `DON-${String(donation.id).padStart(3, "0")}`,
  amount: Number(donation.amount || 0),
  date: donation.donation_date,
  method: donation.payment_method || "—",
  remarks: donation.remarks || "",
});

// Map donor
const mapDonor = (donor) => ({
  id: donor.id,
  donorId: donor.donor_no,
  name: donor.name,
  phone: donor.phone || "",
  email: donor.email || "",
  cnic: donor.cnic || "",
  address: donor.address || "",
  status: donor.status,
  donations: (donor.donations || []).map(mapDonation),
  totalDonated: Number(donor.total_donated || 0),
  donationCount: Number(donor.donation_count || 0),
  lastDonation: donor.last_donation || "",
  monthlyTotal: Number(donor.monthly_total || 0),
  monthlyDonationCount: Number(donor.monthly_donation_count || 0),
});

// Get all donors
export const getDonors = async () => {
  const data = await request("/donors");
  return (data.donors || []).map(mapDonor);
};

// Get donor details
export const getDonorById = async (id) => {
  const data = await request(`/donors/${id}`);

  return {
    ...mapDonor(data.donor),
    donations: (data.donations || []).map(mapDonation),
  };
};

// Create donor
export const createDonor = async (donor) => {
  const data = await request("/donors", {
    method: "POST",
    body: JSON.stringify(donor),
  });

  return mapDonor(data.donor);
};

// Update donor
export const updateDonor = async (id, donor) => {
  const data = await request(`/donors/${id}`, {
    method: "PUT",
    body: JSON.stringify(donor),
  });

  return mapDonor(data.donor);
};

// Add donation
export const addDonation = async (id, donation) => {
  return request(`/donors/${id}/donations`, {
    method: "POST",
    body: JSON.stringify({
      donation_date: donation.date,
      amount: Number(donation.amount),
      payment_method: donation.method,
      remarks: donation.remarks,
    }),
  });
};

// Delete donor
export const deleteDonor = async (id) => {
  return request(`/donors/${id}`, {
    method: "DELETE",
  });
};
