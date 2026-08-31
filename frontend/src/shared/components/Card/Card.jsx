import { motion } from 'framer-motion';

function Card({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`rounded-2xl bg-white p-6 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;
