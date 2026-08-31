import NeighborGame from './components/NeighborGame';

function NeighborQuizPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">Who Is My Neighbor</h1>
      <NeighborGame />
    </div>
  );
}

export default NeighborQuizPage;
