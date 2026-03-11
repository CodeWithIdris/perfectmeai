import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

interface Habit {
  id: string;
  name: string;
  domain: string;
  completed: boolean;
  time?: string;
}

const initialHabits: Habit[] = [
  { id: "1", name: "Morning meditation — 10 min", domain: "emotional", completed: true, time: "6:30 AM" },
  { id: "2", name: "Cold shower", domain: "discipline", completed: true, time: "7:00 AM" },
  { id: "3", name: "Read 20 pages", domain: "knowledge", completed: false, time: "8:00 AM" },
  { id: "4", name: "Workout — Upper body", domain: "health", completed: false, time: "10:00 AM" },
  { id: "5", name: "Deep work block — 90 min", domain: "productivity", completed: false, time: "11:00 AM" },
  { id: "6", name: "Review finances", domain: "finance", completed: false, time: "2:00 PM" },
  { id: "7", name: "Evening journaling", domain: "emotional", completed: false, time: "9:00 PM" },
];

const domainColorMap: Record<string, string> = {
  health: "bg-domain-health",
  productivity: "bg-domain-productivity",
  knowledge: "bg-domain-knowledge",
  finance: "bg-domain-finance",
  emotional: "bg-domain-emotional",
  discipline: "bg-domain-discipline",
  lifestyle: "bg-domain-lifestyle",
};

export function HabitsTracker() {
  const [habits, setHabits] = useState(initialHabits);
  const completed = habits.filter(h => h.completed).length;
  const progress = (completed / habits.length) * 100;

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-lg">Today's Habits</h2>
          <p className="text-sm text-muted-foreground">{completed}/{habits.length} completed</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-display font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-2">
        {habits.map((habit, i) => (
          <motion.button
            key={habit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left
              ${habit.completed ? "bg-primary/5" : "hover:bg-secondary"}`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
              ${habit.completed ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
              {habit.completed && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${domainColorMap[habit.domain]}`} />
            <span className={`text-sm flex-1 ${habit.completed ? "line-through text-muted-foreground" : ""}`}>
              {habit.name}
            </span>
            <span className="text-xs text-muted-foreground">{habit.time}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
