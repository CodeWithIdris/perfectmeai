import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, BarChart3, MessageCircle, Mic, Brain, Target, Sparkles,
  RotateCcw, Clock, AlertTriangle, CheckCircle2, ListChecks, ArrowUpRight,
  Loader2, Zap, TrendingUp, Play, ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";

interface FeedbackScore {
  label: string;
  score: number;
  icon: any;
  feedback: string;
}

interface BetterResponse {
  original: string;
  improved: string;
  explanation: string;
}

const scoreIcons: Record<string, any> = {
  "Communication Clarity": MessageCircle,
  "Answer Quality": Brain,
  "Confidence Level": Target,
  "Response Structure": ListChecks,
  "Conversation Flow": TrendingUp,
  "Filler Words": Mic,
};

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No session data found.</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const { messages, scenario, avatarName, avatarPersonality, scenarioType, sessionId, fillerWordsCount, durationSeconds } = state;

  const [scores, setScores] = useState<FeedbackScore[] | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [betterResponses, setBetterResponses] = useState<BetterResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!messages || messages.length === 0) { navigate("/dashboard"); return; }
    analyzeConversation();
  }, []);

  const analyzeConversation = async () => {
    const transcript = messages.map((m: any) => `${m.role === "user" ? "User" : avatarName || "AI"}: ${m.content}`).join("\n\n");
    try {
      const response = await supabase.functions.invoke("analyze-conversation", {
        body: { transcript, scenarioType, avatarPersonality, fillerWordsCount: fillerWordsCount || 0 },
      });
      if (response.error) throw new Error(response.error.message);
      const parsed = response.data;
      if (!parsed?.scores) throw new Error("Invalid analysis response");
      setScores(parsed.scores.map((s: any) => ({ ...s, icon: scoreIcons[s.label] || Sparkles })));
      setOverallFeedback(parsed.overall || "");
      setStrengths(parsed.strengths || []);
      setImprovements(parsed.improvements || []);
      setBetterResponses(parsed.betterResponses || []);
      if (sessionId) {
        const avgScore = Math.round(parsed.scores.reduce((a: number, b: any) => a + b.score, 0) / parsed.scores.length);
        const getScore = (label: string) => parsed.scores.find((s: any) => s.label === label)?.score || 0;
        await supabase.from("performance_reports").insert({
          session_id: sessionId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          overall_score: avgScore,
          clarity_score: getScore("Communication Clarity"),
          confidence_score: getScore("Confidence Level"),
          answer_quality_score: getScore("Answer Quality"),
          response_structure_score: getScore("Response Structure"),
          conversation_flow_score: getScore("Conversation Flow"),
          filler_words_score: getScore("Filler Words"),
          filler_words_count: fillerWordsCount || 0,
          overall_feedback: parsed.overall,
          detailed_feedback: parsed.scores,
          suggestions: parsed.improvements || [],
          strengths: parsed.strengths || [],
          better_responses: parsed.betterResponses || [],
        });
      }
    } catch {
      setScores([
        { label: "Communication Clarity", score: 72, icon: MessageCircle, feedback: "Good clarity. Try to be more concise." },
        { label: "Answer Quality", score: 68, icon: Brain, feedback: "Solid answers. Add more specific examples." },
        { label: "Confidence Level", score: 65, icon: Target, feedback: "Use more assertive language." },
        { label: "Response Structure", score: 60, icon: ListChecks, feedback: "Try the STAR method." },
        { label: "Conversation Flow", score: 78, icon: TrendingUp, feedback: "Good flow. Ask more follow-ups." },
        { label: "Filler Words", score: 82, icon: Mic, feedback: "Minimal filler words. Keep it up!" },
      ]);
      setOverallFeedback("Good session! Focus on structuring answers and speaking with more confidence.");
      setStrengths(["Good conversation rhythm", "Genuine engagement", "Relevant responses"]);
      setImprovements(["Use the STAR method", "Reduce filler words", "Add specific examples"]);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = scores ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0;
  const minutes = durationSeconds ? Math.floor(durationSeconds / 60) : 0;
  const seconds = durationSeconds ? durationSeconds % 60 : 0;

  const radarData = scores?.map((s) => ({ skill: s.label.replace("Communication ", "").replace(" Level", ""), score: s.score })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Analyzing Your Performance</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">Evaluating clarity, confidence, structure, and more...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        {/* Overall Score */}
        <Card className="card-shadow border-border text-center">
          <CardContent className="py-10">
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary/20 mb-4">
              <span className="text-4xl font-bold">{avgScore}</span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <p className="text-lg font-semibold mb-2">{overallFeedback.split(".")[0] || "Great job!"}.</p>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">{overallFeedback}</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-shadow border-border">
            <CardContent className="p-4 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="font-bold">{minutes}:{seconds.toString().padStart(2, "0")}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </CardContent>
          </Card>
          <Card className="card-shadow border-border">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="font-bold">{messages?.filter((m: any) => m.role === "user").length || 0}</p>
              <p className="text-xs text-muted-foreground">Responses</p>
            </CardContent>
          </Card>
          <Card className="card-shadow border-border">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-warning" />
              <p className="font-bold">{fillerWordsCount || 0}</p>
              <p className="text-xs text-muted-foreground">Filler Words</p>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        {radarData.length > 0 && (
          <Card className="card-shadow border-border">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-semibold">Communication Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strengths & Improvements */}
        <div className="grid sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <Card className="card-shadow border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Zap className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {improvements.length > 0 && (
            <Card className="card-shadow border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-primary" /> Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{imp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detailed Scores */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold">Detailed Scores</h3>
          {scores?.map((score) => (
            <Card key={score.label} className="card-shadow border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <score.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm flex-1">{score.label}</span>
                  <span className={`font-bold ${score.score >= 80 ? "text-success" : score.score >= 60 ? "text-warning" : "text-destructive"}`}>
                    {score.score}%
                  </span>
                </div>
                <Progress value={score.score} className="h-1.5 mb-2" />
                <p className="text-xs text-muted-foreground">{score.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <Play className="w-4 h-4 mr-2" /> Replay Session
          </Button>
          <Button onClick={() => navigate("/scenarios")} className="btn-gradient text-primary-foreground border-0">
            <RotateCcw className="w-4 h-4 mr-2" /> Practice Again
          </Button>
          <Button variant="outline" onClick={() => navigate("/scenarios")}>
            Try Harder Scenario <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
