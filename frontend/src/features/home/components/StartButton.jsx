import { motion } from 'framer-motion';

// Matches the blue "START" pill from Ui ref/button-01.jpg — glossy gradient,
// sparkle highlights, soft outer glow.
function StartButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.3 },
        y: { repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.8 },
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group relative isolate overflow-hidden rounded-full border-2 border-blue-700
                 bg-gradient-to-b from-sky-300 via-blue-500 to-blue-600
                 px-16 py-4 text-3xl font-extrabold uppercase tracking-wide text-white
                 shadow-[0_0_22px_rgba(59,130,246,0.65),0_6px_0_rgb(29,78,216)]
                 [text-shadow:_0_2px_2px_rgb(0_0_0_/_35%)]
                 transition-shadow hover:shadow-[0_0_28px_rgba(59,130,246,0.85),0_4px_0_rgb(29,78,216)]
                 active:shadow-none active:translate-y-1"
    >
      {/* glossy top highlight */}
      <span className="pointer-events-none absolute inset-x-3 top-1.5 h-1/2 rounded-full bg-white/30 blur-[2px]" />
      {/* sparkle accents */}
      <span className="pointer-events-none absolute left-5 top-2.5 h-2.5 w-2.5 rotate-45 rounded-[2px] bg-white/90" />
      <span className="pointer-events-none absolute bottom-3 right-7 h-1.5 w-1.5 rotate-45 rounded-[1px] bg-white/80" />
      <span className="relative">START</span>
    </motion.button>
  );
}

export default StartButton;
