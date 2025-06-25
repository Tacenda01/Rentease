export default function FilterControls() {
  return (
    <div className="mb-4 flex gap-4">
      <select className="border border-slate-300 rounded-md px-3 py-1">
        <option>Status</option>
        <option>Confirmed</option>
        <option>Cancelled</option>
      </select>
      <input
        type="date"
        className="border border-slate-300 rounded-md px-3 py-1"
      />
    </div>
  );
}
