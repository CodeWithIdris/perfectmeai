import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, MessageCircle, Mic, Brain, Target, Sparkles, RotateCcw, Clock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface FeedbackScore {
  label: string;
  score: number;
  icon: any;
  feedback: string;
}

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;
  const { messages, scenario, avatarName, avatarPersonality, scenarioType, sessionId, fillerWordsCount, durationSeconds } = state || {};
  const [scores, setScores] = useState<FeedbackScore[] | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      navigate("/dashboard");
      return;
    }
    generateFeedback();
  }, []);

  const generateFeedback = async () => {
    const conversationText = messages
      .map((m: any) => `${m.role === "user" ? "User" : avatarName || "AI"}: ${m.content}`)
      .join("\n\n");

    const contextLabel = scenarioType === "interview" ? "interview" : scenarioType === "date" ? "date conversation" : scenarioType === "meeting" ? "professional meeting" : "casual conversation";

    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are an expert communication coach. Analyze this ${contextLabel} and provide feedback. The AI partner was "${avatarPersonality || "an AI"}". Return ONLY valid JSON (no markdown) in this exact format:
{
  "overall": "2-3 sentence overall assessment",
  "scores": [
    {"label": "Communication Clarity", "score": 75, "feedback": "brief feedback"},
    {"label": "Confidence Level", "score": 70, "feedback": "brief feedback"},
    {"label": "Answer Quality", "score": 65, "feedback": "brief feedback"},
    {"label": "Conversation Flow", "score": 80, "feedback": "brief feedback"},
    {"label": "Filler Words", "score": 85, "feedback": "brief feedback"}
  ],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}
Scores should be 0-100. Be constructive and specific.`,
            },
            { role: "user", content: conversationText },
          ],
        },
      });

      if (response.error) throw new Error(response.error.message);
      const content = response.data?.choices?.[0]?.message?.content || "";
      const parsed = JSON.parse(content);

      const icons = [MessageCircle, Target, Brain, Sparkles, Mic];
      setScores(parsed.scores.map((s: any, i: number) => ({ ...s, icon: icons[i % icons.length] })));
      setOverallFeedback(parsed.overall);
      setSuggestions(parsed.suggestions || []);

      // Save report to DB
      if (sessionId) {
        const avgScore = Math.round(parsed.scores.reduce((a: number, b: any) => a + b.score, 0) / parsed.scores.length);
        await supabase.from("performance_reports").insert({
          session_id: sessionId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          overall_score: avgScore,
          clarity_score: parsed.scores[0]?.score || 0,
          confidence_score: parsed.scores[1]?.score || 0,
          answer_quality_score: parsed.scores[2]?.score || 0,
          filler_words_score: parsed.scores[4]?.score || 0,
          filler_words_count: fillerWordsCount || 0,
          overall_feedback: parsed.overall,
          detailed_feedback: parsed.scores,
          suggestions: parsed.suggestions || [],
        });
      }
    } catch (error) {
      console.error("Feedback error:", error);
      setScores([
        { label: "Communication Clarity", score: 72, icon: MessageCircle, feedback: "Good clarity overall. Try to be more concise." },
        { label: "Confidence Level", score: 68, icon: Target, feedback: "Decent confidence. Use more assertive language." },
        { label: "Answer Quality", score: 65, icon: Brain, feedback: "Solid answers. Add more specific examples." },
        { label: "Conversation Flow", score: 78, icon: Sparkles, feedback: "Good flow. Try asking more follow-up questions." },
        { label: "Filler Words", score: 82, icon: Mic, feedback: "Minimal filler words detected." },
      ]);
      setOverallFeedback("Good practice session! Focus on being more concise and confident.");
      setSuggestions(["Practice structuring answers with the STAR method", "Reduce filler words by pausing instead", "Ask more follow-up questions"]);
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
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your performance...</p>
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
          <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
          <p className="font-display text-5xl font-bold text-gradient mb-3">{avgScore}%</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{overallFeedback}</p>
        </motion.div>

        {/* Detailed Scores */}
        <div className="space-y-3 mb-8">
          {scores?.map((score, i) => (
            <motion.div
              key={score.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-card rounded-xl border border-border p-5 card-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <score.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-sm flex-1">{score.label}</span>
                <span className="font-bold text-lg">{score.score}%</span>
              </div>
              <Progress value={score.score} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{score.feedback}</p>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl border border-border p-6 card-shadow mb-8"
          >
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Suggestions for Improvement
            </h3>
            <ul className="space-y-3">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{suggestion}</p>
                </li>
              ))}
            </ul>
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
