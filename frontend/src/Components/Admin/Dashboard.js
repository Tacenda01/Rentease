import MetricCards from './pages-component/MetricCards';
import RecentActivityChart from './pages-component/RecentActivityChart';

export default function Dashboard() {
    return (
        <div className="p-4">
            <MetricCards />
            <RecentActivityChart />
        </div>
    );
}
