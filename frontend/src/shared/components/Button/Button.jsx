import { motion } from 'framer-motion';

function Button({ children, onClick, variant = 'primary' }) {
  const styles =
    variant === 'primary'
      ? 'bg-sky-500 hover:bg-sky-600 text-white'
      : 'bg-yellow-300 hover:bg-yellow-400 text-slate-900';

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`rounded-full px-6 py-3 font-bold shadow-md transition-colors ${styles}`}
    >
      {children}
    </motion.button>
  );
}

export default Button;
