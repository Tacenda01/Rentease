import { FaTrash } from "react-icons/fa";

export default function PropertyCard({ property, onClick, onDelete }) {
  const imageUrl =
    property.images?.[0] ||
    "https://via.placeholder.com/300x160?text=No+Image";

  return (
    <div
      className="relative group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden shadow hover:shadow-md transition"
    >
      <img
        src={imageUrl}
        alt={property.title || "Property"}
        className="w-full h-40 object-cover"
        onClick={onClick}
      />

      <div className="p-4" onClick={onClick}>
        <h2 className="text-lg font-semibold text-[#1F2937]">{property.title}</h2>
        <p className="text-sm text-gray-500">{property.city}</p>
      </div>

      <button
        onClick={() => onDelete(property.property_id)}
        className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-2 hover:bg-red-100 shadow z-10"
        title="Delete"
      >
        <FaTrash />
      </button>

      <div
        className="absolute inset-0 bg-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-center items-center text-center"
        onClick={onClick}
      >
        <h2 className="text-lg font-semibold text-sky-600">{property.property_type}</h2>
        <h2 className="text-xl font-semibold text-sky-600">{property.title}</h2>
        <p className="text-sm text-gray-600">{property.city}</p>
        <p className="text-md font-bold text-emerald-600 mt-2">₹{property.price}/month</p>
      </div>
    </div>
  );
}
