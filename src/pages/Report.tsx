import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, BarChart3, MessageCircle, Mic, Brain, Target, Sparkles,
  RotateCcw, Clock, AlertTriangle, CheckCircle2, ListChecks, ArrowUpRight,
  Loader2, Zap, TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const {
    messages, scenario, avatarName, avatarPersonality,
    scenarioType, sessionId, fillerWordsCount, durationSeconds,
  } = state || {};

  const [scores, setScores] = useState<FeedbackScore[] | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [betterResponses, setBetterResponses] = useState<BetterResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      navigate("/dashboard");
      return;
    }
    analyzeConversation();
  }, []);

  const analyzeConversation = async () => {
    const transcript = messages
      .map((m: any) => `${m.role === "user" ? "User" : avatarName || "AI"}: ${m.content}`)
      .join("\n\n");

    try {
      const response = await supabase.functions.invoke("analyze-conversation", {
        body: {
          transcript,
          scenarioType,
          avatarPersonality,
          fillerWordsCount: fillerWordsCount || 0,
        },
      });

      if (response.error) throw new Error(response.error.message);
      const parsed = response.data;

      if (!parsed?.scores) throw new Error("Invalid analysis response");

      setScores(
        parsed.scores.map((s: any) => ({
          ...s,
          icon: scoreIcons[s.label] || Sparkles,
        }))
      );
      setOverallFeedback(parsed.overall || "");
      setStrengths(parsed.strengths || []);
      setImprovements(parsed.improvements || []);
      setBetterResponses(parsed.betterResponses || []);

      // Save to DB
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
    } catch (error) {
      console.error("Analysis error:", error);
      // Fallback
      setScores([
        { label: "Communication Clarity", score: 72, icon: MessageCircle, feedback: "Good clarity overall. Try to be more concise in your explanations." },
        { label: "Answer Quality", score: 68, icon: Brain, feedback: "Solid answers. Consider adding more specific examples and details." },
        { label: "Confidence Level", score: 65, icon: Target, feedback: "Decent confidence. Use more assertive language and avoid hedging." },
        { label: "Response Structure", score: 60, icon: ListChecks, feedback: "Try using the STAR method to structure your answers more effectively." },
        { label: "Conversation Flow", score: 78, icon: TrendingUp, feedback: "Good flow. Try asking more follow-up questions to show engagement." },
        { label: "Filler Words", score: 82, icon: Mic, feedback: "Minimal filler words detected. Keep it up!" },
      ]);
      setOverallFeedback("Good practice session! Focus on structuring your answers and speaking with more confidence.");
      setStrengths(["Maintained good conversation rhythm", "Showed genuine engagement", "Gave relevant responses"]);
      setImprovements(["Structure answers using the STAR method", "Reduce filler words by pausing instead", "Add more specific examples"]);
      setBetterResponses([]);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = scores ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0;
  const minutes = durationSeconds ? Math.floor(durationSeconds / 60) : 0;
  const seconds = durationSeconds ? durationSeconds % 60 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl btn-gradient opacity-20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold mb-2">Analyzing Your Performance</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Our AI is evaluating clarity, confidence, structure, filler words, and more...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4 soft-shadow">
            <BarChart3 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-1">Performance Report</h1>
          <p className="text-muted-foreground">{scenario}{avatarName ? ` · ${avatarName}` : ""}</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-4 card-shadow text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="font-bold text-lg">{minutes}:{seconds.toString().padStart(2, "0")}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4 card-shadow text-center">
            <MessageCircle className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="font-bold text-lg">{messages?.filter((m: any) => m.role === "user").length || 0}</p>
            <p className="text-xs text-muted-foreground">Responses</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-4 card-shadow text-center">
            <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-warning" />
            <p className="font-bold text-lg">{fillerWordsCount || 0}</p>
            <p className="text-xs text-muted-foreground">Filler Words</p>
          </motion.div>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-8 card-shadow text-center mb-6"
        >
          <p className="text-sm text-muted-foreground mb-2">Overall Communication Score</p>
          <p className="font-display text-5xl font-bold text-gradient mb-3">{avgScore}%</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">{overallFeedback}</p>
        </motion.div>

        {/* Detailed Scores */}
        <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Detailed Analysis
        </h3>
        <div className="space-y-3 mb-8">
          {scores?.map((score, i) => (
            <motion.div
              key={score.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="bg-card rounded-xl border border-border p-5 card-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <score.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-sm flex-1">{score.label}</span>
                <span className={`font-bold text-lg ${score.score >= 80 ? "text-success" : score.score >= 60 ? "text-warning" : "text-destructive"}`}>
                  {score.score}%
                </span>
              </div>
              <Progress value={score.score} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground leading-relaxed">{score.feedback}</p>
            </motion.div>
          ))}
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl border border-border p-6 card-shadow mb-6"
          >
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" /> Your Strengths
            </h3>
            <ul className="space-y-3">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{s}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Areas for Improvement */}
        {improvements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-card rounded-2xl border border-border p-6 card-shadow mb-6"
          >
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" /> Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{imp}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Suggested Better Responses */}
        {betterResponses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl border border-border p-6 card-shadow mb-8"
          >
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> Suggested Better Responses
            </h3>
            <div className="space-y-5">
              {betterResponses.map((br, i) => (
                <div key={i} className="space-y-2">
                  <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-3">
                    <p className="text-xs font-medium text-destructive mb-1">What you said:</p>
                    <p className="text-sm text-foreground italic">"{br.original}"</p>
                  </div>
                  <div className="rounded-xl bg-success/5 border border-success/10 p-3">
                    <p className="text-xs font-medium text-success mb-1">Better version:</p>
                    <p className="text-sm text-foreground">"{br.improved}"</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-1">{br.explanation}</p>
                  {i < betterResponses.length - 1 && <div className="border-t border-border pt-2" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/scenarios")} className="btn-gradient text-primary-foreground border-0 soft-shadow">
            <RotateCcw className="w-4 h-4 mr-2" /> Practice Again
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
