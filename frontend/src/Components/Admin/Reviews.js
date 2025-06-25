import ReviewList from './pages-component/ReviewList';
import ReportAbuseButton from './pages-component/ReportAbuseButton';

export default function Reviews() {
    return (
        <div className="p-4 space-y-4">
            <ReportAbuseButton />
            <ReviewList />
        </div>
    );
}