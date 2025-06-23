import { FaTwitter, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 py-8 mt-12 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h3 className="text-xl font-semibold text-blue-500">RentEase</h3>
          <p className="text-gray-500 mt-2">
            Helping you find your next perfect stay.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a href="/browse" className="hover:text-blue-500">
                Browse
              </a>
            </li>
            <li>
              <a href="/how-it-works" className="hover:text-blue-500">
                How It Works
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-500">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-gray-600">
            <li>
              <a href="/privacy" className="hover:text-blue-500">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-blue-500">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-[#1DA1F2] hover:opacity-80"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#0077B5] hover:opacity-80"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#E4405F] hover:opacity-80"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[#171515] hover:opacity-80"
            >
              <FaGithub className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-6 text-sm">
        © 2025 RentEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
