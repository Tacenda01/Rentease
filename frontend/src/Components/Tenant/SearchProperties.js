export default function SearchProperties() {
  return (
    <div className="p-4 bg-[#F9FAFB] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#1F2937] mb-4">Search Properties</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#D1D5DB] col-span-1">Filters</div>
        <div className="bg-white p-4 rounded-2xl border border-[#D1D5DB] col-span-3">Map + Listings</div>
      </div>
    </div>
  );
}
