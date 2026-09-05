import { motion } from 'framer-motion';
import {
  CLUE_ICON_BY_TYPE,
  CLUE_ICON_SRC_BY_TYPE,
  CLUE_LABEL_BY_TYPE,
  FLAG_IMAGE_BY_COUNTRY,
  LANDMARK_IMAGE_BY_VALUE,
} from '../clueOptions';

// Rotation cycles through 4 jaunty angles like sticky notes pinned to a corkboard.
const ROTATIONS = [-3, 2, -1.5, 3];

// Capital city clues keep the generic clue-type icon (not a flag) — a flag
// would give the answer away. Only borders/famous_for swap in a specific
// image for their value.
function thumbnailFor(clue) {
  if (clue.type === 'borders') return FLAG_IMAGE_BY_COUNTRY[clue.value];
  if (clue.type === 'famous_for') return LANDMARK_IMAGE_BY_VALUE[clue.value];
  return null;
}

function ClueCard({ clue, index, onRemove }) {
  const iconSrc = CLUE_ICON_SRC_BY_TYPE[clue.type];
  const icon = CLUE_ICON_BY_TYPE[clue.type] ?? '❓';
  const typeLabel = CLUE_LABEL_BY_TYPE[clue.type] ?? clue.type.replace(/_/g, ' ');
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const thumbnail = thumbnailFor(clue);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: rotation - 6 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="relative flex w-40 flex-col items-center gap-1 rounded-2xl bg-[#fef08a] px-3 pb-3 pt-4 shadow-[0_6px_14px_rgba(120,53,15,0.18)]"
    >
      <span className="flex h-8 items-center justify-center text-3xl leading-none" aria-hidden="true">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-8 w-8 object-contain" />
        ) : iconSrc ? (
          <img src={iconSrc} alt="" className="h-8 w-8 object-contain" />
        ) : (
          icon
        )}
      </span>
      <span className="text-xs font-bold uppercase tracking-wide text-[#92400e]">
        {typeLabel}
      </span>
      <span className="text-center text-lg font-extrabold capitalize text-stone-900">
        {clue.value.replace(/_/g, ' ')}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove clue ${clue.type}: ${clue.value}`}
          className="absolute right-2 top-1.5 text-lg font-extrabold leading-none text-[#c8a27a] hover:text-red-500"
        >
          ×
        </button>
      )}
    </motion.div>
  );
}

export default ClueCard;
