const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../db"); // PostgreSQL pool connection

// User profile-related model methods
const {
  getTenantByEmail,
  getLandlordByEmail,
  updateTenantProfile,
  updateLandlordProfile,
  updateTenantPassword,
  updateLandlordPassword,
  deleteTenantAccount,
  deleteLandlordAccount,
} = require("../models/user");

// =========================
// ✅ ADMIN: Get All Users
// =========================
router.get("/admin/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =========================
// ✅ USER: Get Profile
// =========================
router.get("/profile", async (req, res) => {
  const { email, role } = req.query;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  try {
    const user =
      role === "tenant"
        ? await getTenantByEmail(email)
        : await getLandlordByEmail(email);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone || "",
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// =========================
// ✅ USER: Update Profile
// =========================
router.put("/profile", async (req, res) => {
  const { email, role, firstName, lastName, phone } = req.body;

  if (!email || !role || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedUser =
      role === "tenant"
        ? await updateTenantProfile(email, firstName, lastName, phone)
        : await updateLandlordProfile(email, firstName, lastName, phone);

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
});

// =========================
// ✅ USER: Change Password
// =========================
router.put("/password", async (req, res) => {
  const { email, role, currentPassword, newPassword } = req.body;

  if (!email || !role || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All password fields are required" });
  }

  try {
    const user =
      role === "tenant"
        ? await getTenantByEmail(email)
        : await getLandlordByEmail(email);

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (role === "tenant") {
      await updateTenantPassword(email, hashedPassword);
    } else {
      await updateLandlordPassword(email, hashedPassword);
    }

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Password update failed" });
  }
});

// =========================
// ✅ USER: Delete Account
// =========================
router.delete("/account", async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  try {
    if (role === "tenant") {
      await deleteTenantAccount(email);
    } else {
      await deleteLandlordAccount(email);
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ error: "Account deletion failed" });
  }
});

module.exports = router;
