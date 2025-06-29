import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import PropertyModal from "./PropertyModal";
import AddPropertyForm from "./AddProperty";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const landlordId = localStorage.getItem("landlordId");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/property/landlord/${landlordId}`);
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    };

    if (landlordId) {
      fetchProperties();
    }
  }, [landlordId]);

  const handleAddProperty = async (newProperty) => {
    try {
      const res = await fetch("http://localhost:5000/api/property/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProperty,
          landlordId,
        }),
      });

      const contentType = res.headers.get("content-type");
      const data = contentType.includes("application/json") ? await res.json() : { message: await res.text() };

      if (res.ok) {
        setProperties((prev) => [...prev, data.property]);
        setShowForm(false);
      } else {
        console.error("Failed to add property:", data.error || data.message);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
    }
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0 text-center sm:text-left">
            My Properties
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-sky-700 text-sm font-medium"
          >
            Add Property
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-center mt-24">
            <p className="text-gray-500 text-lg">You haven’t listed any properties yet.</p>
            <p className="text-sm text-gray-400 mt-2">Click the "Add Property" button to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-transparent">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] mx-auto p-6 relative overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <AddPropertyForm
              onSubmit={handleAddProperty}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
