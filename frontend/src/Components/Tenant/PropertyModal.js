// src/Components/Tenant/PropertyModal.js
import { FaTimes, FaHeart } from 'react-icons/fa';

export default function PropertyModal({ property, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh] p-6">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
        >
          <FaTimes size={20} />
        </button>

        {/* 🏠 Property Title + City */}
        <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
        <p className="text-gray-600 mb-4">{property.city}</p>

        {/* 🖼️ Image Gallery */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {property.images.map((img, idx) => (
            <img key={idx} src={img} alt={`Slide ${idx}`} className="w-full h-40 object-cover rounded" />
          ))}
        </div>

        {/* 📝 Description */}
        <p className="text-gray-700 mb-6">{property.description}</p>

        {/* 🔘 Action Buttons (Centered) */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
            Contact Owner
          </button>
          <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
            Book this Property
          </button>
          <button className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 flex items-center gap-2">
            <FaHeart /> Save this Property
          </button>
        </div>
      </div>
    </div>
  );
}
