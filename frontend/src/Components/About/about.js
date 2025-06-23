import {
  CheckCircle,
  ShieldCheck,
  Home,
  Search,
  MessageSquare,
  ClipboardCheck,
  Star,
  Users,
  MapPin,
  Rocket,
} from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20 text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h2 className="text-4xl font-bold text-center mb-4">How RentEase Works</h2>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-12">
          Whether you’re a landlord or a tenant, RentEase makes the rental process seamless, secure, and efficient.
        </p>

        {/* Quick 3-Step Summary */}
        <div className="grid sm:grid-cols-3 gap-6 text-center mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Search className="text-sky-500 mx-auto w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg">Find Properties</h4>
            <p className="text-sm text-gray-600">Explore homes with advanced search filters & map view.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <MessageSquare className="text-emerald-500 mx-auto w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg">Connect Instantly</h4>
            <p className="text-sm text-gray-600">Chat in real-time with landlords or tenants for quick answers.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <CheckCircle className="text-amber-500 mx-auto w-8 h-8 mb-2" />
            <h4 className="font-semibold text-lg">Book & Move In</h4>
            <p className="text-sm text-gray-600">Securely pay, receive confirmation, and move into your new space.</p>
          </div>
        </div>

        {/* Detailed Steps Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Tenants */}
          <div>
            <h3 className="text-2xl font-semibold text-sky-600 mb-6">For Tenants</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-sky-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">Discover Local Listings</h4>
                  <p>Search verified rentals near your desired area with map-integrated results.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MessageSquare className="text-sky-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">Talk to Property Owners</h4>
                  <p>Initiate a chat and clear all your doubts before you book.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <ClipboardCheck className="text-sky-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">Book, Pay & Track</h4>
                  <p>Make secure payments and get instant booking updates and receipts.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Landlords */}
          <div>
            <h3 className="text-2xl font-semibold text-emerald-600 mb-6">For Landlords</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Home className="text-emerald-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">List Your Property</h4>
                  <p>Upload images, set rental terms, and go live instantly with our listing wizard.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Users className="text-emerald-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">Engage with Tenants</h4>
                  <p>Answer questions directly from your dashboard via live chat.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Rocket className="text-emerald-500 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold">Manage & Grow</h4>
                  <p>View insights, handle booking requests, and expand your rental business efficiently.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Why RentEase? */}
        <div className="bg-white p-10 rounded-2xl shadow-md mb-20 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Why Choose RentEase?</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Star className="text-amber-500 mx-auto w-8 h-8 mb-2" />
              <h4 className="font-semibold">Verified Listings</h4>
              <p className="text-gray-600 text-sm">We manually verify properties to ensure you get what you see.</p>
            </div>
            <div>
              <ShieldCheck className="text-emerald-500 mx-auto w-8 h-8 mb-2" />
              <h4 className="font-semibold">Safe Transactions</h4>
              <p className="text-gray-600 text-sm">All payments are encrypted and protected with buyer-seller safeguards.</p>
            </div>
            <div>
              <Users className="text-sky-500 mx-auto w-8 h-8 mb-2" />
              <h4 className="font-semibold">Community Reviewed</h4>
              <p className="text-gray-600 text-sm">Both parties leave feedback, building a trustworthy network.</p>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
}
