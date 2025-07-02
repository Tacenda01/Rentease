import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Footer from "./Components/Footer/footer";
import Home from "./Components/Home/home";
import BrowseProperties from "./Components/Browse/browse";
import HowItWorksSection from "./Components/HowItWorks/work";
import Contact from "./Components/Contact/contact";
import Login from "./Components/Login/login";
import Register from "./Components/Register/register";
import AdminLogin from "./Components/Admin/adminlogin";
import AdminRoutes from "./Components/Admin/adminroutes";
import LandlordRoutes from "./Components/Landlord/landlordroutes";
import TenantRoutes from "./Components/Tenant/tenant";
import NotFound from "./notfound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Users from "./Components/Admin/Users"; // ✅ Check file name is "User.js" but component is "Users"

function AppWrapper() {
  const location = useLocation();
  const path = location.pathname;

  const isDashboardRoute =
    path.startsWith("/tenant") ||
    path.startsWith("/landlord") ||
    path.startsWith("/admin");

  const shouldHideLayout = isDashboardRoute || path === "/admin/login";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!shouldHideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorksSection />} />
          <Route path="/browse" element={<BrowseProperties />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/tenant/*" element={<TenantRoutes />} />
          <Route path="/landlord/*" element={<LandlordRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* ✅ Corrected line here */}
          <Route path="/admin/users" element={<Users />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!shouldHideLayout && <Footer />}

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

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
