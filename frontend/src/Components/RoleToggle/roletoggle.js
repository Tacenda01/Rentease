export default function RoleToggle({ role, setRole }) {
    return (
        <div className="relative bg-gray-100 rounded-full flex p-1 w-full">
            <div
                className={`absolute top-1 left-1 w-1/2 h-8 bg-[#3B82F6] rounded-full shadow-md transition-transform duration-300 ${role === 'landlord' ? 'translate-x-full' : ''
                    }`}
            />
            <button
                onClick={() => setRole('tenant')}
                className={`w-1/2 z-10 text-sm font-semibold py-1.5 transition-colors duration-200 ${role === 'tenant' ? 'text-white' : 'text-gray-600'
                    }`}
            >
                Tenant
            </button>
            <button
                onClick={() => setRole('landlord')}
                className={`w-1/2 z-10 text-sm font-semibold py-1.5 transition-colors duration-200 ${role === 'landlord' ? 'text-white' : 'text-gray-600'
                    }`}
            >
                Landlord
            </button>
        </div>
    );
}
