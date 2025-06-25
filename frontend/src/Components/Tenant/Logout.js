import { FiLogOut } from "react-icons/fi";

export default function Logout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
      <FiLogOut className="text-6xl text-[#EF4444] mb-4" />
      <h2 className="text-xl font-semibold text-[#1F2937]">You have been logged out</h2>
    </div>
  );
}
