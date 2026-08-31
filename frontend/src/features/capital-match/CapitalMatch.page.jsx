import CapitalMatchGame from './components/CapitalMatchGame';

function CapitalMatchPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">Match the Capitals</h1>
      <CapitalMatchGame />
    </div>
  );
}

export default CapitalMatchPage;
