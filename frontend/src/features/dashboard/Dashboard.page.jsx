import ScoreDashboard from './components/ScoreDashboard';

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">My Progress</h1>
      <ScoreDashboard />
    </div>
  );
}

export default DashboardPage;
