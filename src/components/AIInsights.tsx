import { motion } from "framer-motion";
import { Bot, ChevronRight } from "lucide-react";

const insights = [
  "Your meditation streak is strong — consider extending to 15 min this week.",
  "Productivity score peaked on Tuesdays. Schedule deep work sessions then.",
  "You've missed finance reviews 3x this month. Set a recurring reminder.",
];

export function AIInsights() {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-display font-semibold text-lg">AI Coach</h2>
        <span className="ml-auto text-xs text-primary animate-pulse-glow">● Live</span>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
          >
            <p className="text-sm text-secondary-foreground flex-1">{insight}</p>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
