export default function SettingsForm() {
  return (
    <form className="space-y-4 bg-white p-4 border border-slate-300 rounded-lg">
      <div>
        <label className="block mb-1 text-sm">Platform Name</label>
        <input
          type="text"
          className="w-full border border-slate-300 rounded-md px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm">Support Email</label>
        <input
          type="email"
          className="w-full border border-slate-300 rounded-md px-3 py-2"
        />
      </div>
      <button className="bg-sky-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
        Save Changes
      </button>
    </form>
  );
}
