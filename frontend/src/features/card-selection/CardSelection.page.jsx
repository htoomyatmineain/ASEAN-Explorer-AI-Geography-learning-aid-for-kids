// Placeholder — reached by tapping "Start" on the entrance page. Real card
// grid/selection UI comes later; this is just the routing target for now.
function CardSelectionPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <button
        type="button"
        className="rounded-2xl border-b-[5px] border-lime-600 bg-lime-400 px-10 py-4 text-2xl font-extrabold text-lime-950 shadow-[0_4px_0_0_rgb(101,163,13)] transition-transform duration-100 ease-out hover:translate-y-[3px] hover:border-b-[2px] hover:shadow-[0_1px_0_0_rgb(101,163,13)] active:translate-y-[5px] active:border-b-0 active:shadow-none"
      >
        Start
      </button>
    </div>
  );
}

export default CardSelectionPage;
