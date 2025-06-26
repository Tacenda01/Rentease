import { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaCreditCard,
  FaTrashAlt,
  FaSignOutAlt,
  FaCamera,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

export default function ProfileSettings() {
  // Consolidated profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emailVerified: false,
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    notifications: {
      booking: true,
      messages: true,
      reviews: false,
      promotions: true,
    },
    security: {
      twoFactorEnabled: false,
      lastLogin: "June 26, 2023 at 14:30 (Chrome, Windows)",
    },
    paymentMethods: [
      { id: 1, type: "Mastercard", last4: "1234", expires: "04/26" }
    ]
  });

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // UI states
  const [showSaved, setShowSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data (simulated)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        firstName: "Abhinav",
        lastName: "Sharma",
        email: "abhinav@example.com",
        phone: "+91 98765 43210",
        emailVerified: false,
        address: {
          street: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          zip: "400001",
        },
        notifications: {
          booking: true,
          messages: true,
          reviews: false,
          promotions: true,
        },
        security: {
          twoFactorEnabled: false,
          lastLogin: "June 26, 2023 at 14:30 (Chrome, Windows)",
        },
        paymentMethods: [
          { id: 1, type: "Mastercard", last4: "1234", expires: "04/26" }
        ]
      };
      
      setProfile(mockUser);
      setIsLoading(false);
    }, 800);
  }, []);

  // Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!profile.firstName) newErrors.firstName = "First name is required";
    if (!profile.lastName) newErrors.lastName = "Last name is required";
    if (profile.phone && !/^[0-9+\s]{8,15}$/.test(profile.phone)) 
      newErrors.phone = "Invalid phone number";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log("Saving profile", profile);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
    setErrors({});
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Password validation
    const passwordErrors = {};
    if (!currentPw) passwordErrors.currentPw = "Current password is required";
    if (!newPw) passwordErrors.newPw = "New password is required";
    if (newPw.length < 8) passwordErrors.newPw = "Password must be at least 8 characters";
    if (!/[A-Z]/.test(newPw)) passwordErrors.newPw = "Include at least one uppercase letter";
    if (!/\d/.test(newPw)) passwordErrors.newPw = "Include at least one number";
    if (newPw !== confirmPw) passwordErrors.confirmPw = "Passwords do not match";
    
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }
    
    console.log("Change password", { currentPw, newPw });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setErrors({});
  };

  const handleToggleNotification = (field) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const handleToggleTwoFactor = () => {
    setProfile(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account");
    // API call would go here
    setShowDeleteConfirm(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getInitials = () => {
    const { firstName, lastName } = profile;
    if (!firstName && !lastName) return "?";
    return `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}`.toUpperCase();
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
      {/* Success Toast */}
      {showSaved && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fadeIn">
          <FaCheckCircle className="text-xl" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete your account and all associated data. 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full flex items-center justify-center gap-2"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6">Profile Settings</h1>

      {/* Profile Information */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] mb-8"
      >
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <div className="relative">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-sky-500 w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
              <FaCamera className="text-gray-600" />
              <input
                type="file"
                className="hidden"
                onChange={handlePhotoUpload}
                accept="image/*"
              />
            </label>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-[#1F2937] flex items-center gap-2">
              <FaUser className="text-sky-500" /> Personal Information
            </h2>
            <p className="text-gray-600 mt-1">
              Update your personal details and contact information
            </p>
            
            {!profile.emailVerified && (
              <div className="flex items-center text-amber-600 mt-3 bg-amber-50 px-3 py-2 rounded-lg">
                <FaExclamationTriangle className="mr-2" />
                <span>Email not verified</span>
                <button className="ml-2 text-sky-600 hover:underline font-medium">
                  Resend verification
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleProfileChange}
              className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400`}
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
              className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400`}
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
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              type="text"
              name="address.street"
              value={profile.address.street}
              onChange={handleProfileChange}
              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="address.city"
              value={profile.address.city}
              onChange={handleProfileChange}
              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="address.state"
              value={profile.address.state}
              onChange={handleProfileChange}
              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              name="address.zip"
              value={profile.address.zip}
              onChange={handleProfileChange}
              className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-full transition flex items-center justify-center"
        >
          Save Changes
        </button>
      </form>

      {/* Security Section */}
      <div className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] mb-8">
        <h2 className="text-lg font-medium text-[#1F2937] mb-6 flex items-center gap-2">
          <FaLock className="text-emerald-500" /> Account Security
        </h2>
        
        {/* Password Change */}
        <form onSubmit={handleChangePassword} className="mb-8">
          <h3 className="font-medium text-gray-800 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className={`w-full border ${errors.currentPw ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400`}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.currentPw && <p className="text-red-500 text-sm mt-1">{errors.currentPw}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  placeholder="New Password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className={`w-full border ${errors.newPw ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400`}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.newPw && <p className="text-red-500 text-sm mt-1">{errors.newPw}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with one uppercase letter and one number
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className={`w-full border ${errors.confirmPw ? 'border-red-500' : 'border-slate-200'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400`}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPw && <p className="text-red-500 text-sm mt-1">{errors.confirmPw}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-full transition"
          >
            Update Password
          </button>
        </form>
        
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100">
          <div>
            <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleToggleTwoFactor}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.security.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-2 text-sm font-medium">
              {profile.security.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-medium text-gray-800 mb-2">Recent Activity</h3>
          <p className="text-sm text-gray-600">
            Last login: {profile.security.lastLogin}
          </p>
          <button className="mt-3 text-sky-600 hover:underline text-sm font-medium">
            View all login activity
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] mb-8">
        <h2 className="text-lg font-medium text-[#1F2937] mb-6 flex items-center gap-2">
          <FaBell className="text-amber-500" /> Notification Preferences
        </h2>
        
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-4 rounded-lg ${profile.notifications.booking ? 'bg-sky-50' : ''}`}>
            <div>
              <h3 className="font-medium text-gray-800">Booking Confirmations</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive updates about your bookings
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('booking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notifications.booking ? 'bg-sky-500' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.notifications.booking ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-lg ${profile.notifications.messages ? 'bg-sky-50' : ''}`}>
            <div>
              <h3 className="font-medium text-gray-800">Messages & Inquiries</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get notified about new messages
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('messages')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notifications.messages ? 'bg-sky-500' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.notifications.messages ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-lg ${profile.notifications.reviews ? 'bg-sky-50' : ''}`}>
            <div>
              <h3 className="font-medium text-gray-800">Reviews Received</h3>
              <p className="text-sm text-gray-600 mt-1">
                Notify me when I receive new reviews
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('reviews')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notifications.reviews ? 'bg-sky-500' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.notifications.reviews ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-lg ${profile.notifications.promotions ? 'bg-sky-50' : ''}`}>
            <div>
              <h3 className="font-medium text-gray-800">Promotions & Offers</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive special offers and discounts
              </p>
            </div>
            <button
              onClick={() => handleToggleNotification('promotions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${profile.notifications.promotions ? 'bg-sky-500' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.notifications.promotions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] mb-8">
        <h2 className="text-lg font-medium text-[#1F2937] mb-6 flex items-center gap-2">
          <FaCreditCard className="text-purple-500" /> Payment Methods
        </h2>
        
        <div className="space-y-4">
          {profile.paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">
                  {method.type} ending in **** {method.last4}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Expires {method.expires}
                </p>
              </div>
              <button className="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          ))}
          
          <button className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-5 rounded-full transition flex items-center justify-center gap-2">
            <FaCreditCard /> Add New Payment Method
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white p-6 rounded-2xl shadow border border-[#D1D5DB] space-y-4">
        <h2 className="text-lg font-medium text-[#1F2937] mb-4">Account Actions</h2>
        
        <button
          onClick={() => console.log("Logout all devices")}
          className="w-full flex items-center justify-center gap-2 border border-sky-500 text-sky-500 py-2.5 rounded-full hover:bg-sky-50 transition"
        >
          <FaSignOutAlt /> Log Out of All Devices
        </button>
        
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