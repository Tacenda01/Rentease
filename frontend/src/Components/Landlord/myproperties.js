import { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import PropertyModal from "./PropertyModal";
import AddPropertyForm from "./AddProperty";

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/property/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperties(res.data);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    };

    if (userId) fetchProperties();
  }, [userId, token]);

  const handleAddProperty = async (newProperty) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/property/add",
        {
          ...newProperty,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProperties((prev) => [...prev, res.data.property]);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add property", error);
    }
  };

  const confirmDeleteProperty = (propertyId) => {
    setPropertyToDelete(propertyId);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/property/${propertyToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProperties((prev) =>
        prev.filter((p) => p.property_id !== propertyToDelete)
      );
      setShowConfirmDelete(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error("Failed to delete property:", err?.response?.data || err.message);
      alert("Error deleting property. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 mt-4">
          <h1 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
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
                key={property.property_id}
                property={property}
                onClick={() => setSelectedProperty(property)}
                onDelete={() => confirmDeleteProperty(property.property_id)}
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
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

      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setPropertyToDelete(null);
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
