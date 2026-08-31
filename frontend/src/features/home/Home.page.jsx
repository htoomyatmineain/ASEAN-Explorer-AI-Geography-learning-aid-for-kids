import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PressStartPrompt from './components/PressStartPrompt';
import LoadingBar from './components/LoadingBar';

// Filenames contain spaces, so the space has to stay percent-encoded — a
// literal space in a JSX src attribute won't resolve.
const BACKGROUND_IMAGE = '/assets/background/home%20page.png';
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';

function HomePage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    const handleKeydown = () => setStarted(true);
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [started]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
    >
      {/* Logo, anchored into the empty sky pocket in the artwork, upper-left
          of center — specific to this background. */}
      <div className="absolute left-[8%] top-[6%] flex w-[85vw] max-w-[42rem] flex-col items-center sm:left-[10%] sm:top-[8%]">
        <motion.img
          src={LOGO_IMAGE}
          alt="ASEAN Explorer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-full max-w-[440px] drop-shadow-xl sm:max-w-[640px]"
        />
      </div>

      {/* Press-start prompt / loading bar, anchored to the bottom-middle of the page. */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 justify-center sm:bottom-16">
        {started ? (
          <LoadingBar onComplete={() => navigate('/card-selection')} />
        ) : (
          <PressStartPrompt onTrigger={() => setStarted(true)} />
        )}
      </div>
    </div>
  );
}

export default HomePage;
