import { motion } from 'framer-motion';

// Placeholder mascot until final character art lands in public/assets/characters/.
function Mascot({ label }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-6xl" role="img" aria-label="mascot">
        🦉
      </span>
      {label && <p className="font-bold text-slate-700">{label}</p>}
    </motion.div>
  );
}

export default Mascot;
