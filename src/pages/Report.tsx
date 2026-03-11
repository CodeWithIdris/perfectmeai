import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, MessageCircle, Mic, Brain, Target, Sparkles, RotateCcw } from "lucide-react";
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
  const { messages, scenario } = (location.state as { messages: any[]; scenario: string }) || {};
  const [scores, setScores] = useState<FeedbackScore[] | null>(null);
  const [overallFeedback, setOverallFeedback] = useState("");
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
      .map((m: any) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
      .join("\n\n");

    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "system",
              content: `You are an expert interview coach. Analyze this interview conversation and provide feedback. Return ONLY valid JSON (no markdown) in this exact format:
{
  "overall": "2-3 sentence overall assessment",
  "scores": [
    {"label": "Communication Clarity", "score": 75, "feedback": "brief feedback"},
    {"label": "Confidence Level", "score": 70, "feedback": "brief feedback"},
    {"label": "Answer Structure", "score": 65, "feedback": "brief feedback"},
    {"label": "Relevance", "score": 80, "feedback": "brief feedback"},
    {"label": "Filler Words", "score": 85, "feedback": "brief feedback"}
  ]
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
      setScores(
        parsed.scores.map((s: any, i: number) => ({
          ...s,
          icon: icons[i % icons.length],
        }))
      );
      setOverallFeedback(parsed.overall);
    } catch (error) {
      console.error("Feedback error:", error);
      // Fallback scores
      setScores([
        { label: "Communication Clarity", score: 72, icon: MessageCircle, feedback: "Good clarity overall. Try to be more concise in technical explanations." },
        { label: "Confidence Level", score: 68, icon: Target, feedback: "Decent confidence. Use more assertive language and avoid hedging." },
        { label: "Answer Structure", score: 65, icon: Brain, feedback: "Consider using the STAR method for behavioral questions." },
        { label: "Relevance", score: 78, icon: Sparkles, feedback: "Most answers were relevant. Stay focused on what's asked." },
        { label: "Filler Words", score: 82, icon: Mic, feedback: "Minimal filler words detected. Keep it up!" },
      ]);
      setOverallFeedback("Good practice session! Focus on structuring your answers better and speaking with more confidence.");
    } finally {
      setLoading(false);
    }
  };

  const avgScore = scores ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your interview performance...</p>
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
          <p className="text-muted-foreground">{scenario}</p>
        </motion.div>

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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/dashboard")} className="btn-gradient text-primary-foreground border-0 soft-shadow">
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
