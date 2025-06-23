import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar";
import Footer from "./Components/Footer/footer";
import About from "./Components/About/about";
import Home from "./Components/Home/home";
import Contact from "./Components/Contact/contact";
import FAQs from "./Components/Faqs/faq";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Router>
        <Navbar />

        {/* Main content area that grows to fill screen */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
