import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PropertyModal({ property, onClose, openChat }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState(null);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);

  const openGallery = (index) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleContactOwner = () => openChat(property);

  const handleBookingSubmit = async () => {
    if (loading) return;

    if (!moveInDate || duration <= 0) {
      toast.error("Please enter a valid move-in date and duration.");
      return;
    }

    const tenantId = localStorage.getItem("userId");
    if (!tenantId) {
      toast.error("You must be logged in as a tenant to book.");
      return;
    }

    setLoading(true);

    try {
      const propertyRes = await fetch(`http://localhost:5000/api/property/${property.property_id}`);
      if (!propertyRes.ok) throw new Error("Failed to fetch property details.");

      const propertyData = await propertyRes.json();
      const unitPrice = propertyData.price;
      if (!unitPrice || unitPrice <= 0) throw new Error("Invalid property price.");

      const totalAmount = unitPrice * duration;

      const res = await fetch("http://localhost:5000/api/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          propertyId: property.property_id,
          amount: totalAmount,
          moveInDate: moveInDate.toLocaleDateString("en-CA"),
          duration,
        }),
      });

      const data = await res.json();

      if (data.url) {
        localStorage.setItem("pendingBooking", JSON.stringify({
          tenantId,
          propertyId: property.property_id,
          moveInDate: moveInDate.toLocaleDateString("en-CA"),
          duration,
        }));
        window.location.href = data.url;
      } else {
        toast.error("Stripe payment initiation failed.");
      }
    } catch (err) {
      console.error("Booking/Stripe error:", err);
      toast.error("Something went wrong during booking or payment.");
    } finally {
      setLoading(false);
    }
  };

  const availableDateObj = property.available_date
    ? new Date(property.available_date)
    : new Date();

  const minBookingDate = new Date(availableDateObj);
  minBookingDate.setDate(minBookingDate.getDate());

  const imagesForScroll = [...property.images, ...property.images];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white max-w-2xl w-full rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh] p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
          <p className="text-gray-600 mb-4">{property.city}</p>

          <div className="relative overflow-hidden mb-4" style={{ height: "6rem" }}>
            <div
              className="flex space-x-2 absolute top-0 left-0 animate-scroll-left hover:animation-play-state-paused"
              style={{ width: `${imagesForScroll.length * 8}rem` }}
            >
              {imagesForScroll.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Slide ${idx}`}
                  className="h-24 w-32 object-cover rounded cursor-pointer"
                  onClick={() => openGallery(idx % property.images.length)}
                  draggable={false}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-700 mb-6 whitespace-pre-line">
            {property.description}
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button
              className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
              onClick={handleContactOwner}
            >
              Contact Owner
            </button>
            <button
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"
                }`}
              onClick={() => setBookingModalOpen(true)}
            >
              Book this Property
            </button>
          </div>
        </div>
      </div>

      {bookingModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">Book This Property</h3>
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setBookingModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>

            <p className="text-sm text-red-500 mb-2">
              This property is available for booking on{" "}
              <strong>{minBookingDate.toLocaleDateString("en-IN")}</strong>
            </p>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Move-in Date</label>
              <DatePicker
                selected={moveInDate}
                onChange={(date) => setMoveInDate(date)}
                minDate={minBookingDate}
                placeholderText="Select a date"
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Duration (months)</label>
              <input
                type="number"
                value={duration}
                min="1"
                max="24"
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                disabled={loading}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setBookingModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"
                  }`}
                onClick={handleBookingSubmit}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {galleryOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button
            className="absolute top-5 right-5 text-white text-3xl z-110"
            onClick={(e) => {
              e.stopPropagation();
              closeGallery();
            }}
          >
            <FaTimes />
          </button>
          <button
            className="absolute left-5 text-white text-4xl p-2 hover:text-gray-300 z-110"
            onClick={prevImage}
          >
            <FaChevronLeft />
          </button>
          <img
            src={property.images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-5 text-white text-4xl p-2 hover:text-gray-300 z-110"
            onClick={nextImage}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
        .hover\\:animation-play-state-paused:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
