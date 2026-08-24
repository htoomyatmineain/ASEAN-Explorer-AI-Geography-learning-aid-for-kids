import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StartButton from './components/StartButton';

// Filenames contain spaces, so the space has to stay percent-encoded — a
// literal space in a JSX src attribute won't resolve.
const BACKGROUND_IMAGE = '/assets/background/home%20page.png';
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
    >
      {/* Logo + Start button as one pair, anchored into the empty sky pocket
          in the artwork, upper-left of center — specific to this background. */}
      <div className="absolute left-[8%] top-[6%] flex w-[85vw] max-w-[42rem] flex-col items-center gap-8 sm:left-[10%] sm:top-[8%]">
        <motion.img
          src={LOGO_IMAGE}
          alt="ASEAN Explorer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-full max-w-[440px] drop-shadow-xl sm:max-w-[640px]"
        />
        <StartButton onClick={() => navigate('/card-selection')} />
      </div>
    </div>
  );
}

export default HomePage;
