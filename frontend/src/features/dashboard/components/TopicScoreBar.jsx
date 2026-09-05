import { motion } from 'framer-motion';

// Bar color reflects how confident the topic is: green for 80+, sky for
// 60-79, amber below 60 so the child can see which topic needs practice.
function barColor(score) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-sky-500';
  return 'bg-amber-400';
}

function TopicScoreBar({ topic, score }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-bold capitalize text-stone-800">{topic.replace(/_/g, ' ')}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-extrabold text-stone-700">
          {score}%
        </span>
      </div>
      <div className="h-5 w-full overflow-hidden rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor(score)}`}
        />
      </div>
    </div>
  );
}

export default TopicScoreBar;
