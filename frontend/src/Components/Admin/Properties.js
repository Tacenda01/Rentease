import PropertyTable from './pages-component/PropertyTable';
import StatusToggle from './pages-component/StatusToggle';

export default function Properties() {
    return (
        <div className="p-4 space-y-4">
            <StatusToggle />
            <PropertyTable />
        </div>
    );
}