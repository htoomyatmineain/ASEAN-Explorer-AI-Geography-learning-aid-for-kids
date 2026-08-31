import ProgressMap from './components/ProgressMap';

function JourneyPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">Journey Mode</h1>
      <ProgressMap />
    </div>
  );
}

export default JourneyPage;
