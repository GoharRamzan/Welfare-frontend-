
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  HandCoins,
  TrendingUp,
  UserCheck,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  UserRound,
  Wallet,
  History,
} from "lucide-react";

import {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  addDonation,
  deleteDonor as deleteDonorAPI,
} from "../services/donorService";

const emptyDonorForm = {
  name: "",
  phone: "",
  email: "",
  cnic: "",
  address: "",
};

const emptyDonationForm = {
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  method: "Cash",
  remarks: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "—";

  const dateString = String(date).slice(0, 10);

  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDonorTotal = (donor) =>
  donor.totalDonated ??
  (donor.donations || []).reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

const getLastDonation = (donor) => {
  if (donor.lastDonation) return donor.lastDonation;

  const sorted = [...(donor.donations || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return sorted[0]?.date || "";
};

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [donorForm, setDonorForm] = useState(emptyDonorForm);

  const [selectedDonor, setSelectedDonor] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationForm, setDonationForm] = useState(emptyDonationForm);

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  // Load donors from database
  const loadDonors = async () => {
    try {
      setLoading(true);
      const data = await getDonors();
      setDonors(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  // Dashboard calculations
  const totalDonated = useMemo(
    () =>
      donors.reduce(
        (sum, donor) => sum + Number(donor.totalDonated || 0),
        0
      ),
    [donors]
  );

  const totalDonationCount = useMemo(
    () =>
      donors.reduce(
        (sum, donor) => sum + Number(donor.donationCount || 0),
        0
      ),
    [donors]
  );

  const monthlyTotal = useMemo(
    () =>
      donors.reduce(
        (sum, donor) => sum + Number(donor.monthlyTotal || 0),
        0
      ),
    [donors]
  );

  const monthlyDonationCount = useMemo(
    () =>
      donors.reduce(
        (sum, donor) =>
          sum + Number(donor.monthlyDonationCount || 0),
        0
      ),
    [donors]
  );

  // Search and status filter
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        donor.name,
        donor.donorId,
        donor.phone,
        donor.cnic,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" || donor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [donors, search, statusFilter]);

  // Open add donor modal
  const openAddDonor = () => {
    setEditingDonor(null);
    setDonorForm(emptyDonorForm);
    setModalOpen(true);
  };

  // Open edit donor modal
  const openEditDonor = (donor) => {
    setEditingDonor(donor);

    setDonorForm({
      name: donor.name || "",
      phone: donor.phone || "",
      email: donor.email || "",
      cnic: donor.cnic || "",
      address: donor.address || "",
    });

    setModalOpen(true);
  };

  // Create or update donor
  const handleDonorSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        name: donorForm.name.trim(),
        phone: donorForm.phone.trim(),
        email: donorForm.email.trim(),
        cnic: donorForm.cnic.replace(/\D/g, ""),
        address: donorForm.address.trim(),
        status: editingDonor?.status || "Active",
      };

      if (editingDonor) {
        await updateDonor(editingDonor.id, payload);
      } else {
        await createDonor(payload);
      }

      await loadDonors();

      if (editingDonor && selectedDonor?.id === editingDonor.id) {
        const updatedProfile = await getDonorById(editingDonor.id);
        setSelectedDonor(updatedProfile);
      }

      setModalOpen(false);
      setEditingDonor(null);
      setDonorForm(emptyDonorForm);

      alert(
        editingDonor
          ? "Donor updated successfully"
          : "Donor created successfully"
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Open donor profile and fetch donation history
  const openDonorDetails = async (donor) => {
    try {
      setDetailsLoading(true);
      setSelectedDonor(null);

      const details = await getDonorById(donor.id);
      setSelectedDonor(details);
    } catch (error) {
      alert(error.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Open add donation modal
  const openDonationModal = (donor) => {
    setDonationForm(emptyDonationForm);
    setDonationModalOpen(true);
  };

  // Add donation to existing donor
  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDonor || Number(donationForm.amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      setSaving(true);

      await addDonation(selectedDonor.id, donationForm);

      const updatedProfile = await getDonorById(selectedDonor.id);
      setSelectedDonor(updatedProfile);

      await loadDonors();

      setDonationForm(emptyDonationForm);
      setDonationModalOpen(false);

      alert("Donation added successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete donor
  const handleDeleteDonor = async (donor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${donor.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteDonorAPI(donor.id);
      await loadDonors();

      if (selectedDonor?.id === donor.id) {
        setSelectedDonor(null);
      }

      alert("Donor deleted successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  // Dashboard cards
  const stats = [
    {
      title: "Total Donors",
      value: donors.length.toLocaleString(),
      subtitle: "Registered donor profiles",
      icon: Users,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Donations",
      value: formatCurrency(totalDonated),
      subtitle: `${totalDonationCount} individual donations`,
      icon: HandCoins,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "This Month",
      value: formatCurrency(monthlyTotal),
      subtitle: `${monthlyDonationCount} donations this month`,
      icon: TrendingUp,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Active Donors",
      value: donors.filter((donor) => donor.status === "Active").length,
      subtitle: "Currently active profiles",
      icon: UserCheck,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-7">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-[#174c7b]">Donors</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-800">
            Donors Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage donor profiles and track every contribution.
          </p>
        </div>

        <button
          onClick={openAddDonor}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#174c7b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103b61]"
        >
          <Plus size={18} />
          Add New Donor
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-800">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon size={23} className={stat.iconColor} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Donor Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-bold text-slate-800">All Donors</h2>
            <p className="mt-1 text-xs text-slate-500">
              Each donor appears once, regardless of donation count.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search name, ID, phone, CNIC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500"
            >
              <option value="All">All Donors</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Donor</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">CNIC</th>
                <th className="px-5 py-4 font-semibold">Total Donated</th>
                <th className="px-5 py-4 font-semibold">Last Donation</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Loading donors...
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr
                    key={donor.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-[#174c7b]">
                          {donor.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {donor.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {donor.donorId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {donor.phone || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {donor.email || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {donor.cnic || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {formatCurrency(getDonorTotal(donor))}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(getLastDonation(donor))}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          donor.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {donor.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Donor & Donation History"
                          onClick={() => openDonorDetails(donor)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Edit Donor"
                          onClick={() => openEditDonor(donor)}
                          className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title="Delete Donor"
                          onClick={() => handleDeleteDonor(donor)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredDonors.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <Users
                      className="mx-auto mb-3 text-slate-300"
                      size={35}
                    />

                    <p className="font-medium text-slate-600">
                      No donors found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try another search or add a new donor.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing {filteredDonors.length} of {donors.length} donors
          </span>

          <span>{totalDonationCount} individual donation records</span>
        </div>
      </div>

      {/* Add / Edit Donor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingDonor ? "Edit Donor" : "Add New Donor"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingDonor
                    ? "Update donor personal information."
                    : "Register a new donor profile."}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDonorSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {[
                  { label: "Full Name", key: "name", required: true },
                  { label: "Phone Number", key: "phone", required: true },
                  { label: "Email Address", key: "email" },
                  { label: "CNIC Number", key: "cnic", required: true },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>

                    <input
                      type="text"
                      required={field.required}
                      value={donorForm[field.key]}
                      onChange={(e) =>
                        setDonorForm({
                          ...donorForm,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <textarea
                    rows="3"
                    value={donorForm.address}
                    onChange={(e) =>
                      setDonorForm({
                        ...donorForm,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter complete address"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#174c7b] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#103b61] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingDonor
                    ? "Update Donor"
                    : "Save Donor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donor Details & Donation History Modal */}
      {detailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="rounded-xl bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-xl">
            Loading donor details...
          </div>
        </div>
      )}

      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:px-6">
              <div>
                <h2 className="font-bold text-slate-800">
                  Donor Profile & Donation History
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complete details and all recorded contributions.
                </p>
              </div>

              <button
                onClick={() => setSelectedDonor(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
              {/* Profile */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-[#174c7b]">
                    {selectedDonor.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {selectedDonor.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDonor.donorId}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedDonor.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {selectedDonor.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openDonationModal(selectedDonor)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#174c7b] px-4 py-3 text-sm font-semibold text-white hover:bg-[#103b61]"
                >
                  <Plus size={17} />
                  Add Donation
                </button>
              </div>

              {/* Summary Cards */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs font-medium text-blue-600">
                    Total Donated
                  </p>

                  <p className="mt-2 text-xl font-bold text-[#174c7b]">
                    {formatCurrency(getDonorTotal(selectedDonor))}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-600">
                    Total Donations
                  </p>

                  <p className="mt-2 text-xl font-bold text-emerald-700">
                    {selectedDonor.donationCount ??
                      selectedDonor.donations.length}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-xs font-medium text-purple-600">
                    Last Donation
                  </p>

                  <p className="mt-2 text-lg font-bold text-purple-700">
                    {formatDate(getLastDonation(selectedDonor))}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-7 rounded-xl border border-slate-200 p-4">
                <h3 className="mb-4 font-bold text-slate-800">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: Phone,
                      label: "Phone Number",
                      value: selectedDonor.phone,
                    },
                    {
                      icon: Mail,
                      label: "Email Address",
                      value: selectedDonor.email || "—",
                    },
                    {
                      icon: UserRound,
                      label: "CNIC Number",
                      value: selectedDonor.cnic || "—",
                    },
                    {
                      icon: MapPin,
                      label: "Address",
                      value: selectedDonor.address || "—",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-start gap-3"
                      >
                        <Icon
                          size={18}
                          className="mt-0.5 text-slate-400"
                        />

                        <div>
                          <p className="text-xs text-slate-400">
                            {item.label}
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Donation History */}
              <div>
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <History size={19} className="text-[#174c7b]" />

                    <div>
                      <h3 className="font-bold text-slate-800">
                        Donation History
                      </h3>

                      <p className="text-xs text-slate-500">
                        Each contribution is recorded separately.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-500">
                    {selectedDonor.donations.length} records
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-xs uppercase text-slate-500">
                        <th className="p-3 font-semibold">Donation ID</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Method</th>
                        <th className="p-3 font-semibold">Remarks</th>
                        <th className="p-3 text-right font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {[...selectedDonor.donations]
                        .sort(
                          (a, b) =>
                            new Date(b.date) - new Date(a.date)
                        )
                        .map((donation) => (
                          <tr key={donation.id}>
                            <td className="p-3 text-sm font-semibold text-[#174c7b]">
                              {donation.donationNo}
                            </td>

                            <td className="p-3 text-sm text-slate-600">
                              {formatDate(donation.date)}
                            </td>

                            <td className="p-3 text-sm text-slate-600">
                              {donation.method}
                            </td>

                            <td className="p-3 text-sm text-slate-500">
                              {donation.remarks || "—"}
                            </td>

                            <td className="p-3 text-right text-sm font-semibold text-slate-800">
                              {formatCurrency(donation.amount)}
                            </td>
                          </tr>
                        ))}

                      {selectedDonor.donations.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center">
                            <Wallet
                              size={30}
                              className="mx-auto mb-2 text-slate-300"
                            />

                            <p className="text-sm font-medium text-slate-600">
                              No donations recorded yet
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Click Add Donation to record the first contribution.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {selectedDonor.donations.length > 0 && (
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td
                            colSpan="4"
                            className="p-3 text-right text-sm font-bold text-slate-700"
                          >
                            Total Contributions
                          </td>

                          <td className="p-3 text-right text-sm font-bold text-[#174c7b]">
                            {formatCurrency(getDonorTotal(selectedDonor))}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="rounded-lg bg-[#174c7b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#103b61]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Donation Modal */}
      {donationModalOpen && selectedDonor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-bold text-slate-800">
                  Add Donation
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Donor: {selectedDonor.name} ({selectedDonor.donorId})
                </p>
              </div>

              <button
                onClick={() => setDonationModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleDonationSubmit}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Donation Amount (PKR) *
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  value={donationForm.amount}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      amount: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter donation amount"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Donation Date *
                </label>

                <input
                  type="date"
                  required
                  value={donationForm.date}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      date: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payment Method *
                </label>

                <select
                  required
                  value={donationForm.method}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      method: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Remarks
                </label>

                <textarea
                  rows="3"
                  value={donationForm.remarks}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      remarks: e.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter optional remarks"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setDonationModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#174c7b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#103b61] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
