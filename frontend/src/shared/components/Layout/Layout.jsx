import { Link, useNavigate } from 'react-router-dom';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
const BACKGROUND_IMAGE = '/assets/background/learning.png';

const NAV_ITEMS = [
  { to: '/explore', label: 'Learning', icon: '/assets/icons/nav-00.png' },
  { to: '/card-selection', label: 'Practice', icon: '/assets/icons/nav-01.png' },
  { to: '/dashboard', label: 'Progress', icon: '/assets/icons/nav-02.png' },
];

const SETTINGS_ICON = '/assets/icons/nav-03.png';

const NAV_BUTTON =
  'flex items-center justify-center gap-3 rounded-2xl border-b-[5px] border-sky-600 bg-sky-400 px-6 py-4 text-sky-950 shadow-[0_4px_0_0_rgb(2,132,199)] transition-transform duration-100 ease-out active:translate-y-[5px] active:border-b-0 active:shadow-none';

const EXIT_BUTTON =
  'flex items-center justify-center gap-3 rounded-2xl border-b-[5px] border-rose-700 bg-rose-500 px-6 py-4 text-white shadow-[0_4px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[5px] active:border-b-0 active:shadow-none';

function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background lives on its own fixed layer so button hover/press states
          (which change border/shadow sizes and reflow the nav) never touch
          the container the background's bg-cover sizing is computed from. */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')`, backgroundPosition: 'center 20%' }}
      />
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-10">
        <Link to="/">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-[9rem] w-auto drop-shadow-lg" />
        </Link>
        <nav className="flex w-full max-w-sm flex-col gap-4 text-3xl font-bold">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={NAV_BUTTON}>
              <img src={item.icon} alt="" className="h-14 w-14" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button type="button" onClick={() => navigate('/')} className={EXIT_BUTTON}>
            Exit
          </button>
        </nav>
      </div>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>

      <Link
        to="/settings"
        aria-label="Settings"
        className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-2xl border-b-[5px] border-lime-600 bg-lime-400 shadow-[0_4px_0_0_rgb(101,163,13)] transition-transform duration-100 ease-out active:translate-y-[5px] active:border-b-0 active:shadow-none"
      >
        <img src={SETTINGS_ICON} alt="" className="h-9 w-9" />
      </Link>
    </div>
  );
}

export default Layout;
