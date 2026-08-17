import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../shared/components/Button/Button';

// Dropped into any other feature's screen — not a standalone page. Pass a
// getExplanation() that resolves to a { explanation } response from
// explainModeApi.js (explainNeighbor or explainMembership).
function ExplainBubble({ getExplanation }) {
  const [explanation, setExplanation] = useState(null);

  const handleWhy = async () => {
    const response = await getExplanation();
    setExplanation(response.explanation);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="secondary" onClick={handleWhy}>
        Why?
      </Button>
      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-md"
          >
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExplainBubble;
