import { Link } from 'react-router-dom';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
const BACKGROUND_IMAGE = '/assets/background/learning.png';

const NAV_ITEMS = [
  { to: '/explore', label: 'Learning', icon: '/assets/icons/nav-00.png' },
  { to: '/card-selection', label: 'Practice', icon: '/assets/icons/nav-01.png' },
  { to: '/dashboard', label: 'Progress', icon: '/assets/icons/nav-02.png' },
  { to: '/settings', label: 'Setting', icon: '/assets/icons/nav-03.png' },
];

function Layout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-top bg-no-repeat"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
    >
      <header className="relative flex items-center justify-between rounded-b-3xl border-b-[6px] border-yellow-300 bg-sky-500 px-6 py-4 text-white shadow-[0_8px_0_rgb(0,0,0)]">
        <Link to="/">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-14 w-auto sm:h-16" />
        </Link>
        <nav className="flex gap-8 text-2xl font-semibold">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="flex items-center gap-2">
              <img src={item.icon} alt="" className="h-14 w-14" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

export default Layout;
