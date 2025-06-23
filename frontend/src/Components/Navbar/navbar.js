import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-semibold text-blue-500">
              RentEase
            </a>
            <div className="hidden md:flex space-x-6">
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
              <a href="/browse" className="hover:text-blue-600">
                Browse
              </a>
              <a href="/how-it-works" className="hover:text-blue-600">
                How It Works
              </a>
              <a href="/contact" className="hover:text-blue-600">
                Contact
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="text-blue-500 hover:text-blue-600">
              Login
            </a>
            <a
              href="/register"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <a href="/" className="block text-blue-500">
            Home
          </a>
          <a href="/browse" className="block hover:text-blue-600">
            Browse
          </a>
          <a href="/how-it-works" className="block hover:text-blue-600">
            How It Works
          </a>
          <a href="/contact" className="block hover:text-blue-600">
            Contact
          </a>
          <a href="/login" className="block text-blue-500">
            Login
          </a>
          <a
            href="/register"
            className="block bg-blue-500 text-white px-4 py-2 rounded-lg text-center"
          >
            Register
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
