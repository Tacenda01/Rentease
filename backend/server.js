const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const propertyRoutes = require("./routes/property");

const { initializeTables } = require("./models/user");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
// or ./routes/admin if it's in admin
app.use("/api/user", userRoutes); // this means /admin/users becomes /api/user/admin/users

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);

// ✅ Server Port
const PORT = process.env.PORT || 5000;

// ✅ Start Server + DB Init
app.listen(PORT, async () => {
  try {
    await initializeTables(); // ensure required tables exist
    console.log(`✅ Tables initialized`);
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Failed to initialize tables:", error);
  }
});
