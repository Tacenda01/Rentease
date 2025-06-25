export default function NotificationSenderForm() {
  return (
    <form className="bg-white p-4 border border-slate-300 rounded-lg space-y-3">
      <input
        type="text"
        placeholder="Title"
        className="w-full border border-slate-300 rounded-md px-3 py-2"
      />
      <textarea
        placeholder="Message"
        className="w-full border border-slate-300 rounded-md px-3 py-2"
        rows={4}
      />
      <button className="bg-sky-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
        Send Notification
      </button>
    </form>
  );
}
