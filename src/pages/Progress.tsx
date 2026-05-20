import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, MessageCircle, TrendingUp, Award, Flame, Star, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const fallbackTrend = [
  { session: "1", confidence: 52, clarity: 48, overall: 50 },
  { session: "2", confidence: 58, clarity: 55, overall: 56 },
  { session: "3", confidence: 63, clarity: 60, overall: 61 },
  { session: "4", confidence: 68, clarity: 67, overall: 67 },
];

const achievements = [
  { title: "First Interview Practice", description: "Completed your first interview session", icon: Star, earned: true },
  { title: "7 Day Practice Streak", description: "Practiced for 7 consecutive days", icon: Flame, earned: true },
  { title: "10 Conversations Completed", description: "Reached 10 total practice conversations", icon: MessageCircle, earned: false },
  { title: "Confidence Master", description: "Scored 90%+ on confidence", icon: Target, earned: false },
  { title: "Perfect Score", description: "Achieved 95%+ overall score", icon: Trophy, earned: false },
  { title: "Multi-Scenario Pro", description: "Practiced all scenario types", icon: Award, earned: false },
];

const ProgressPage = () => {
  const navigate = useNavigate();
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [trend, setTrend] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase
        .from("practice_sessions")
        .select("duration_seconds, created_at, performance_reports(overall_score, confidence_score, clarity_score)")
        .eq("user_id", session.user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: true });

      if (data) {
        setTotalSessions(data.length);
        setTotalMinutes(Math.round(data.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) / 60));
        const withReports = data.filter((s: any) => s.performance_reports?.[0]);
        const scores = withReports.map((s: any) => s.performance_reports[0].overall_score || 0).filter((s: number) => s > 0);
        setAvgScore(scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0);
        setTrend(withReports.map((s: any, i: number) => ({
          session: String(i + 1),
          overall: s.performance_reports[0].overall_score || 0,
          confidence: s.performance_reports[0].confidence_score || 0,
          clarity: s.performance_reports[0].clarity_score || 0,
        })));
      }
    });
  }, [navigate]);

  const trendData = trend.length > 0 ? trend : fallbackTrend;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
            <span>MOD_04 // PROGRESS</span>
            <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-accent/70">TELEMETRY_LIVE</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Your <span className="text-gradient">Progress</span></h1>
          <p className="text-muted-foreground text-sm">Track your improvement over time.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="card-shadow border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSessions || 7}</p>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMinutes || 42}</p>
                <p className="text-sm text-muted-foreground">Practice Minutes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgScore || 81}%</p>
                <p className="text-sm text-muted-foreground">Confidence Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Growth Chart */}
        <Card className="card-shadow border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Skill Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="session" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" label={{ value: "Session", position: "insideBottom", offset: -5 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="overall" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="confidence" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="clarity" stroke="hsl(152 60% 45%)" fill="hsl(152 60% 45%)" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Achievements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((a) => (
              <Card key={a.title} className={`card-shadow border-border transition-opacity ${!a.earned ? "opacity-40" : ""}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    a.earned ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <a.icon className={`w-5 h-5 ${a.earned ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                  </div>
                  {a.earned && <Badge className="ml-auto btn-gradient text-primary-foreground border-0 text-xs">Earned</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
