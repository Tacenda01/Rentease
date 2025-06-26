import { useState } from 'react';
import dummyProperties from './DummyPropertyList';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';

const uniqueCities = [...new Set(dummyProperties.map(p => p.city))];

export default function SearchProperties() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const filteredProperties = selectedCity
    ? dummyProperties.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase())
    : dummyProperties;

  const matchedCities = uniqueCities.filter(city =>
    city.toLowerCase().startsWith(searchCity.toLowerCase()) && searchCity
  );

  return (
    <div className="p-4 bg-[#F9FAFB] min-h-screen">
      {/* 🔍 Title */}
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-6 text-center">Search Properties</h1>

      {/* 🔍 Search Box Centered */}
      <div className="flex justify-center mb-8 relative z-20">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          {/* City Dropdown */}
          {matchedCities.length > 0 && (
            <ul className="absolute top-full left-0 w-full border border-slate-300 rounded shadow bg-white mt-1 max-h-60 overflow-y-auto">
              {matchedCities.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedCity(city);
                    setSearchCity('');
                  }}
                  className="px-4 py-2 text-sm hover:bg-sky-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🧹 Clear Filter Button */}
        {selectedCity && (
          <button
            onClick={() => setSelectedCity('')}
            className="ml-3 px-4 py-2 text-sm text-white bg-rose-500 hover:bg-rose-600 rounded transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* 🏘️ Property Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => setSelectedProperty(property)}
          />
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No properties found for "{selectedCity || searchCity}"
          </div>
        )}
      </div>

      {/* 📌 Popup Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
