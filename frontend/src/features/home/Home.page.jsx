import { Link } from 'react-router-dom';
import Card from '../../shared/components/Card/Card';
import Mascot from '../../shared/components/Mascot/Mascot';
import Button from '../../shared/components/Button/Button';

const links = [
  { to: '/explore', label: 'Explore the Map' },
  { to: '/guess', label: 'Guess the Country' },
  { to: '/neighbors', label: 'Who Is My Neighbor' },
  { to: '/capitals', label: 'Match the Capitals' },
  { to: '/dashboard', label: 'My Progress' },
];

function HomePage() {
  return (
    <Card className="flex flex-col items-center gap-6 text-center">
      <Mascot label="Hi! Let's explore ASEAN together!" />
      <h1 className="text-3xl font-extrabold text-sky-600">ASEAN Explorer</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {links.map((link) => (
          <Link key={link.to} to={link.to}>
            <Button>{link.label}</Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default HomePage;
