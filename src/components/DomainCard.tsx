import { motion } from "framer-motion";
import { Activity, Brain, DollarSign, Flame, Heart, Lightbulb, Sparkles } from "lucide-react";
import { type ReactNode } from "react";

export interface LifeDomain {
  id: string;
  name: string;
  icon: ReactNode;
  score: number;
  streak: number;
  color: string;
  activeTasks: number;
}

export const defaultDomains: LifeDomain[] = [
  { id: "health", name: "Health & Fitness", icon: <Activity className="w-5 h-5" />, score: 72, streak: 14, color: "domain-health", activeTasks: 4 },
  { id: "productivity", name: "Productivity", icon: <Flame className="w-5 h-5" />, score: 85, streak: 21, color: "domain-productivity", activeTasks: 6 },
  { id: "knowledge", name: "Knowledge", icon: <Brain className="w-5 h-5" />, score: 63, streak: 7, color: "domain-knowledge", activeTasks: 3 },
  { id: "finance", name: "Finance", icon: <DollarSign className="w-5 h-5" />, score: 58, streak: 10, color: "domain-finance", activeTasks: 2 },
  { id: "emotional", name: "Emotional IQ", icon: <Heart className="w-5 h-5" />, score: 77, streak: 18, color: "domain-emotional", activeTasks: 3 },
  { id: "discipline", name: "Discipline", icon: <Lightbulb className="w-5 h-5" />, score: 91, streak: 30, color: "domain-discipline", activeTasks: 5 },
  { id: "lifestyle", name: "Lifestyle", icon: <Sparkles className="w-5 h-5" />, score: 68, streak: 5, color: "domain-lifestyle", activeTasks: 2 },
];

function CircularProgress({ score, color, size = 56 }: { score: number; color: string; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={3} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={`var(--tw-${color})`}
        className={`text-${color}`}
        style={{ stroke: "currentColor" }}
        strokeWidth={3} strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        strokeDasharray={circumference}
      />
    </svg>
  );
}

export function DomainCard({ domain, index }: { domain: LifeDomain; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="glass rounded-xl p-5 hover:bg-surface-hover transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${domain.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`text-${domain.color} p-2 rounded-lg bg-${domain.color}/10`}>
            {domain.icon}
          </div>
          <div className="relative flex items-center justify-center">
            <CircularProgress score={domain.score} color={domain.color} />
            <span className="absolute text-xs font-semibold font-display">{domain.score}</span>
          </div>
        </div>
        <h3 className="font-display font-semibold text-sm mb-1">{domain.name}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-primary" /> {domain.streak}d streak
          </span>
          <span>{domain.activeTasks} tasks</span>
        </div>
      </div>
    </motion.div>
  );
}
