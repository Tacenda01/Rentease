// import PropertyTable from './pages-component/PropertyTable';
// import StatusToggle from './pages-component/StatusToggle';

import { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import PropertyModal from "./PropertyModal";

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [uniqueCities, setUniqueCities] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/property");
        setProperties(res.data);
        const cities = [...new Set(res.data.map((p) => p.city))];
        setUniqueCities(cities);
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (selectedCity) {
      return p.city.toLowerCase() === selectedCity.toLowerCase();
    } else if (searchCity) {
      return p.city.toLowerCase().includes(searchCity.toLowerCase());
    }
    return true;
  });

  const matchedCities = uniqueCities.filter(
    (city) =>
      city.toLowerCase().startsWith(searchCity.toLowerCase()) && searchCity
  );

  return (
    <div className="p-4 mt-16 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6 text-center">
        Search Properties
      </h1>

      <div className="flex justify-center mb-8 relative z-20">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          {matchedCities.length > 0 && (
            <ul className="absolute top-full left-0 w-full border border-slate-300 rounded shadow bg-white mt-1 max-h-60 overflow-y-auto">
              {matchedCities.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedCity(city);
                    setSearchCity("");
                  }}
                  className="px-4 py-2 text-sm hover:bg-sky-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedCity && (
          <button
            onClick={() => setSelectedCity("")}
            className="ml-3 px-4 py-2 text-sm text-white bg-rose-500 hover:bg-rose-600 rounded transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => setSelectedProperty(property)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            {selectedCity || searchCity
              ? `No properties found for "${selectedCity || searchCity}"`
              : "No properties found"}
          </div>
        )}
      </div>

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
