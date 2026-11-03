import { motion } from 'framer-motion';

const COLORS = ['#0ea5e9', '#facc15', '#ef4444', '#34d399', '#f472b6', '#a78bfa'];
const PIECES = 34;
// 0 = square, 1 = circle, 2 = star — cycled so bursts read as mixed confetti,
// not uniform dots.
const SHAPES = [0, 1, 2];

function StarShape({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" style={{ display: 'block' }}>
      <path
        d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.8l7.1-.7z"
        fill={color}
      />
    </svg>
  );
}

// A one-shot confetti burst shown behind the success banner. `burstKey` should
// change on every new reveal so the animation replays.
function Confetti({ burstKey }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: PIECES }).map((_, i) => {
        const dx = ((i % 5) - 2) * 28;
        const duration = 2.6 + (i % 5) * 0.4;
        const delay = (i % 7) * 0.12;
        const shape = SHAPES[i % SHAPES.length];
        const color = COLORS[i % COLORS.length];
        return (
          <motion.span
            key={`${burstKey}-${i}`}
            initial={{ opacity: 1, x: 0, y: -30, rotate: 0, scale: 0.6 }}
            animate={{ opacity: 0, x: dx, y: 320, rotate: 540, scale: 1 }}
            transition={{ duration, delay, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              top: 0,
              left: `${3 + i * 2.9}%`,
              width: shape === 2 ? 14 : 12,
              height: shape === 2 ? 14 : 12,
              borderRadius: shape === 1 ? '50%' : shape === 0 ? '3px' : 0,
              background: shape === 2 ? undefined : color,
            }}
          >
            {shape === 2 && <StarShape color={color} />}
          </motion.span>
        );
      })}
    </div>
  );
}

export default Confetti;
