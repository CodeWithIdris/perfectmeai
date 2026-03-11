import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Zap, Target, Calendar } from "lucide-react";

const stats = [
  { label: "Overall Score", value: "73", suffix: "/100", icon: <Target className="w-4 h-4" />, trend: "+5" },
  { label: "Active Streak", value: "21", suffix: " days", icon: <Zap className="w-4 h-4" />, trend: "+3" },
  { label: "Habits Today", value: "2", suffix: "/7", icon: <Calendar className="w-4 h-4" />, trend: null },
  { label: "Weekly Growth", value: "12", suffix: "%", icon: <TrendingUp className="w-4 h-4" />, trend: "+2%" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            {stat.icon}
            <span className="text-xs">{stat.label}</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-display font-bold">{stat.value}</span>
            <span className="text-sm text-muted-foreground mb-0.5">{stat.suffix}</span>
            {stat.trend && (
              <span className="ml-auto text-xs text-primary flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {stat.trend}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
