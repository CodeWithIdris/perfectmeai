import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, Trophy, Target, MessageCircle, BarChart3, Calendar } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface SessionRow {
  id: string;
  scenario_title: string;
  avatar_name: string;
  avatar_personality: string;
  duration_seconds: number | null;
  status: string;
  created_at: string;
  performance_reports: { overall_score: number }[];
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) navigate("/auth");
      else setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else {
        setUser(session.user);
        loadSessions(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadSessions = async (uid: string) => {
    const { data } = await supabase
      .from("practice_sessions")
      .select("id, scenario_title, avatar_name, avatar_personality, duration_seconds, status, created_at, performance_reports(overall_score)")
      .eq("user_id", uid)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(20);
    setSessions((data as any) || []);
    setLoading(false);
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const totalSessions = sessions.length;
  const bestScore = sessions.reduce((max, s) => {
    const score = s.performance_reports?.[0]?.overall_score || 0;
    return score > max ? score : max;
  }, 0);
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.performance_reports?.[0]?.overall_score || 0), 0) / totalSessions)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Hi, <span className="text-gradient">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground">Track your progress and start a new practice session.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Clock, label: "Sessions", value: totalSessions.toString(), color: "text-primary" },
            { icon: Trophy, label: "Best Score", value: bestScore ? `${bestScore}%` : "—", color: "text-warning" },
            { icon: Target, label: "Average", value: avgScore ? `${avgScore}%` : "—", color: "text-success" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-4 card-shadow text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Start New Session CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6 card-shadow mb-10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center soft-shadow">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-xl font-semibold">Ready to Practice?</h2>
              <p className="text-sm text-muted-foreground">Choose a scenario and AI partner to start a conversation.</p>
            </div>
            <Button onClick={() => navigate("/scenarios")} className="btn-gradient text-primary-foreground border-0 soft-shadow">
              Start New Session <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>

        {/* Past Sessions */}
        <h2 className="font-display text-xl font-semibold mb-4">Past Sessions</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-8 card-shadow text-center"
          >
            <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No sessions yet. Start your first practice!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, i) => {
              const score = session.performance_reports?.[0]?.overall_score || 0;
              const date = new Date(session.created_at);
              const mins = session.duration_seconds ? Math.floor(session.duration_seconds / 60) : 0;
              const secs = session.duration_seconds ? session.duration_seconds % 60 : 0;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl border border-border p-4 card-shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{session.scenario_title}</p>
                      <p className="text-xs text-muted-foreground">{session.avatar_name} · {session.avatar_personality}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg">{score}%</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleDateString()}
                        <Clock className="w-3 h-3 ml-1" />
                        {mins}:{secs.toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                  {score > 0 && <Progress value={score} className="h-1.5 mt-3" />}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
