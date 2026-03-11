import { motion } from "framer-motion";

// Simple weekly activity chart
const weekData = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 92 },
  { day: "Wed", value: 78 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 70 },
];

export function WeeklyChart() {
  const maxValue = Math.max(...weekData.map(d => d.value));

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="font-display font-semibold text-lg mb-1">Weekly Activity</h2>
      <p className="text-sm text-muted-foreground mb-5">Habit completion rate</p>
      <div className="flex items-end justify-between gap-2 h-32">
        {weekData.map((d, i) => {
          const height = (d.value / maxValue) * 100;
          const isToday = i === 3; // Thursday
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className={`w-full rounded-md ${isToday ? "bg-primary glow-sm" : "bg-secondary"}`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: "easeOut" }}
              />
              <span className={`text-xs ${isToday ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
