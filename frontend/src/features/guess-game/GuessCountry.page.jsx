import GuessGame from './components/GuessGame';

function GuessCountryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">Guess the Country</h1>
      <GuessGame />
    </div>
  );
}

export default GuessCountryPage;
