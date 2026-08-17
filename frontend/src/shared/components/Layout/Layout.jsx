import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between bg-sky-500 px-6 py-4 text-white shadow">
        <Link to="/" className="text-2xl font-extrabold">
          ASEAN Explorer
        </Link>
        <nav className="flex gap-4 font-semibold">
          <Link to="/explore">Explore</Link>
          <Link to="/guess">Guess</Link>
          <Link to="/neighbors">Neighbors</Link>
          <Link to="/capitals">Capitals</Link>
          <Link to="/dashboard">My Progress</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}

export default Layout;
