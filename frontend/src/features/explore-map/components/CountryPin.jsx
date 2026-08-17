import { motion } from 'framer-motion';

function CountryPin({ name, label, onSelect }) {
  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(name)}
      className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow"
    >
      {label}
    </motion.button>
  );
}

export default CountryPin;
