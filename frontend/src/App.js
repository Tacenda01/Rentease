import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Footer from "./Components/Footer/footer";
import HowItWorksSection from "./Components/HowItWorks/work";
import Home from "./Components/Home/home";
import Contact from "./Components/Contact/contact";
import Login from "./Components/Login/login";
import Register from "./Components/Register/register";
import Admin from "./Components/Admin/admin";
import Landlord from "./Components/Landlord/landlord";
import Tenant from "./Components/Tenant/tenant";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorksSection />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/landlord" element={<Landlord />} />
            <Route path="/tenant" element={<Tenant />} />
          </Routes>
        </main>
        <Footer />
      </Router>

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
