import { motion } from 'framer-motion';

function TopicScoreBar({ topic, score }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold capitalize">{topic.replace(/_/g, ' ')}</span>
      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className="h-full rounded-full bg-sky-500"
        />
      </div>
    </div>
  );
}

export default TopicScoreBar;
