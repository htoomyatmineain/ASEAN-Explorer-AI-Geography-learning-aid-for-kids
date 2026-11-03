import { motion } from 'framer-motion';
import { useI18n } from '../../../shared/i18n/I18nContext';

// Classic arcade "press start" prompt — blinks to invite input, responds to
// either a click/tap or an actual keypress (the page wires up the keydown
// listener, since that has to attach/detach based on whether we've started).
function PressStartPrompt({ onTrigger }) {
  const { t } = useI18n();
  return (
    <motion.button
      onClick={onTrigger}
      animate={{ opacity: [1, 0.25, 1] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
      className="text-xl font-extrabold uppercase tracking-wide text-white
                 [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]"
    >
      {t('home.pressStart')}
    </motion.button>
  );
}

export default PressStartPrompt;
