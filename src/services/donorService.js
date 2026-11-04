
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


// Common API request
const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
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
};

// Convert database donation fields to frontend fields
const mapDonation = (donation) => ({
  id: donation.id,
  donationNo: `DON-${String(donation.id).padStart(3, "0")}`,
  amount: Number(donation.amount || 0),
  date: donation.donation_date,
  method: donation.payment_method || "—",
  remarks: donation.remarks || "",
});

// Convert database donor fields to frontend fields
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

export const getDonors = async () => {
  const data = await request("/donors");
  return data.donors.map(mapDonor);
};

export const getDonorById = async (id) => {
  const data = await request(`/donors/${id}`);

  return {
    ...mapDonor(data.donor),
    donations: data.donations.map(mapDonation),
  };
};

export const createDonor = async (donor) => {
  const data = await request("/donors", {
    method: "POST",
    body: JSON.stringify(donor),
  });

  return mapDonor(data.donor);
};

export const updateDonor = async (id, donor) => {
  const data = await request(`/donors/${id}`, {
    method: "PUT",
    body: JSON.stringify(donor),
  });

  return mapDonor(data.donor);
};

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

export const deleteDonor = async (id) => {
  return request(`/donors/${id}`, {
    method: "DELETE",
  });
};
