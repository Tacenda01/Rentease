import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Footer from "./Components/Footer/footer";
import Home from "./Components/Home/home";
import HowItWorksSection from "./Components/HowItWorks/work";
import Contact from "./Components/Contact/contact";
import Login from "./Components/Login/login";
import Register from "./Components/Register/register";
import Admin from "./Components/Admin/admin";
import Landlord from "./Components/Landlord/landlord";
import TenantRoutes from "./Components/Tenant/tenant"; // This returns <Routes> block
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorksSection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/landlord" element={<Landlord />} />

            {/* Optional: Redirect base /tenant to /tenant/dashboard */}
            <Route path="/tenant" element={<Navigate to="/tenant/dashboard" replace />} />
          </Routes>

          {/* ✅ Tenant Routes are handled separately here */}
          <TenantRoutes />
        </main>

        <Footer />
      </Router>

      {/* Toast Messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
