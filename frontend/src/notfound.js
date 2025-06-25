import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
    const location = useLocation();

    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-5xl font-bold text-rose-600">404</h1>
            <p className="text-lg text-gray-600 mt-2">Page Not Found</p>
            <p className="text-sm text-gray-400 mt-1">You tried: <code>{location.pathname}</code></p>

            <Link
                to="/"
                className="mt-6 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition"
            >
                Go to Home
            </Link>
        </div>
    );
}
