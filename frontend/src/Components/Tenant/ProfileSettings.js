import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaTrashAlt
} from "react-icons/fa";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [showSaved, setShowSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = "http://localhost:5000/api/user";
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/profile`, {
          params: { email, role }
        });
        const data = res.data;

        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email,
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [email, role]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!profile.firstName) newErrors.firstName = "First name is required";
    if (!profile.lastName) newErrors.lastName = "Last name is required";
    if (profile.phone && !/^[0-9+\s]{8,15}$/.test(profile.phone))
      newErrors.phone = "Invalid phone number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.put(`${API_BASE}/profile`, {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        role
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
      setErrors({});
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const passwordErrors = {};
    if (!currentPw) passwordErrors.currentPw = "Current password is required";
    if (!newPw) passwordErrors.newPw = "New password is required";
    if (newPw !== confirmPw) passwordErrors.confirmPw = "Passwords do not match";

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    try {
      await axios.put(`${API_BASE}/password`, {
        email: profile.email,
        currentPassword: currentPw,
        newPassword: newPw,
        role
      });
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setErrors({});
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_BASE}/account`, {
        data: { email: profile.email, role }
      });
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#F9FAFB] min-h-screen pb-20">
      {showSaved && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <FaCheckCircle className="text-xl" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full flex items-center justify-center gap-2">
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6 text-center sm:text-left">
        Profile Settings
      </h1>

      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleProfileChange}
              className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3`}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleProfileChange}
              className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3`}
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full border border-slate-200 bg-gray-100 rounded-lg p-3 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <button type="submit" className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-full">
          Save Changes
        </button>
      </form>

      <div className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] mb-8">
        <h2 className="text-lg font-medium text-[#1F2937] mb-6 flex items-center gap-2">
          <FaLock className="text-emerald-500" /> Account Security
        </h2>

        <form onSubmit={handleChangePassword} className="mb-8 space-y-4">
          {["current", "new", "confirm"].map((type, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === "current" ? "Current Password" :
                  type === "new" ? "New Password" : "Confirm New Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword[type] ? "text" : "password"}
                  value={type === "current" ? currentPw : type === "new" ? newPw : confirmPw}
                  onChange={(e) => {
                    if (type === "current") setCurrentPw(e.target.value);
                    else if (type === "new") setNewPw(e.target.value);
                    else setConfirmPw(e.target.value);
                  }}
                  className={`w-full border ${errors[`${type}Pw`] ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3`}
                  placeholder={type === "confirm" ? "Confirm New Password" : `${type.charAt(0).toUpperCase() + type.slice(1)} Password`}
                />
                <button type="button" onClick={() => togglePasswordVisibility(type)} className="absolute right-3 top-3.5 text-gray-500">
                  {showPassword[type] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors[`${type}Pw`] && <p className="text-red-500 text-sm mt-1">{errors[`${type}Pw`]}</p>}
            </div>
          ))}
          <button type="submit" className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-full">
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] space-y-4">
        <h2 className="text-lg font-medium text-[#1F2937] mb-4">Account Actions</h2>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 py-2.5 rounded-full hover:bg-red-50 transition"
        >
          <FaTrashAlt /> Delete Account
        </button>
      </div>
    </div>
  );
}
