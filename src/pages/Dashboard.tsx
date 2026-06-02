import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Flame, TrendingUp, Clock, Briefcase, Heart, Handshake, ArrowRight,
  MessageCircle, BarChart3, Calendar,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { chartAxisProps, chartGridProps, chartTooltipStyle, chartTooltipLabelStyle, chartColors } from "@/lib/chart-theme";
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

const dummyChartData = [
  { week: "Week 1", score: 52 },
  { week: "Week 2", score: 58 },
  { week: "Week 3", score: 63 },
  { week: "Week 4", score: 67 },
  { week: "Week 5", score: 72 },
  { week: "Week 6", score: 78 },
  { week: "Week 7", score: 82 },
];

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

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Alex";
  const totalSessions = sessions.length;
  const bestScore = sessions.reduce((max, s) => {
    const score = s.performance_reports?.[0]?.overall_score || 0;
    return score > max ? score : max;
  }, 0);
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.performance_reports?.[0]?.overall_score || 0), 0) / totalSessions)
    : 82;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const lastSession = sessions[0]?.scenario_title || "Interview Practice";

  return (
    <DashboardLayout module="MOD_01 // DASHBOARD" meta={`SESSIONS: ${String(totalSessions).padStart(2, "0")}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Greeting */}
        <div className="space-y-3 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>MOD_01 // DASHBOARD</span>
            <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-primary/70">{new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            {greeting}, <span className="text-gradient">{firstName}</span>
            <span className="block text-base font-sans font-normal text-muted-foreground mt-1">Ready to improve today?</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-shadow border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Practice Streak</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">5 Days</p>
              <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Confidence Score</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{avgScore}%</p>
              <Progress value={avgScore} className="h-1.5 mt-2" />
            </CardContent>
          </Card>

          <Card className="card-shadow border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Last Session</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-sm font-semibold">{lastSession}</p>
              <p className="text-xs text-muted-foreground mt-1">Score: {bestScore || 78}%</p>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Recommended</span>
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-accent" />
                </div>
              </div>
              <p className="text-sm font-semibold">Behavioral Interview</p>
              <p className="text-xs text-muted-foreground mt-1">Based on your progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Briefcase, label: "Start Interview Practice", color: "bg-primary/10 text-primary", scenarioId: "job-interview" },
              { icon: Heart, label: "Start Date Simulation", color: "bg-destructive/10 text-destructive", scenarioId: "first-date" },
              { icon: Handshake, label: "Start Meeting Practice", color: "bg-info/10 text-info", scenarioId: "professional-meeting" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 justify-start gap-3 hover:bg-muted/50 transition-colors"
                onClick={() => navigate("/scenarios")}
              >
                <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Button>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <Card className="card-shadow border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Communication Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyChartData}>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="week" {...chartAxisProps} />
                  <YAxis domain={[0, 100]} {...chartAxisProps} />
                  <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} cursor={{ stroke: "hsl(var(--primary) / 0.3)", strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartColors.primary, r: 3 }}
                    activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2, fill: "hsl(var(--background))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : sessions.length === 0 ? (
            <Card className="card-shadow border-border">
              <CardContent className="py-10 text-center">
                <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No sessions yet. Start your first practice!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 5).map((session) => {
                const score = session.performance_reports?.[0]?.overall_score || 0;
                const date = new Date(session.created_at);
                return (
                  <Card key={session.id} className="card-shadow border-border hover:elevated-shadow transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{session.scenario_title}</p>
                        <p className="text-xs text-muted-foreground">{session.avatar_name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm">{score}%</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {date.toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
