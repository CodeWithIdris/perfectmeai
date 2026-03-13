import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Send, Mic, ArrowLeft, Loader2, StopCircle, Clock, Sparkles } from "lucide-react";
import { getScenario, getAvatar } from "@/lib/scenarios";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "kind of", "sort of", "i mean", "right", "so yeah"];

function countFillerWords(text: string): number {
  const lower = text.toLowerCase();
  return FILLER_WORDS.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return count + (lower.match(regex)?.length || 0);
  }, 0);
}

const Practice = () => {
  const { scenarioId, avatarId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenario = getScenario(scenarioId || "");
  const avatar = getAvatar(scenarioId || "", avatarId || "");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUserId(session.user.id);
    });
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!sessionStarted) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [sessionStarted, startTime]);

  if (!scenario || !avatar) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Scenario not found.</p>
          <Button onClick={() => navigate("/scenarios")}>Go Back</Button>
        </div>
      </div>
    );
  }

  const createSession = async () => {
    if (!userId) return null;
    const { data, error } = await supabase.from("practice_sessions").insert({
      user_id: userId,
      scenario_type: scenario.type,
      scenario_title: scenario.title,
      avatar_id: avatar.id,
      avatar_name: avatar.name,
      avatar_personality: avatar.personality,
      status: "in_progress",
    }).select("id").single();
    if (error) { console.error(error); return null; }
    return data.id;
  };

  const startSession = async () => {
    setSessionStarted(true);
    setIsLoading(true);
    setStartTime(Date.now());
    const id = await createSession();
    setSessionId(id);

    const openingPrompt = scenario.type === "interview"
      ? "I'm ready to begin the interview."
      : scenario.type === "date" ? "Hi! Nice to meet you."
      : scenario.type === "meeting" ? "Thank you for making time. Let's get started."
      : "Hey! What's up?";

    try {
      const response = await supabase.functions.invoke("chat", {
        body: { messages: [{ role: "system", content: avatar.systemPrompt }, { role: "user", content: openingPrompt }] },
      });
      if (response.error) throw new Error(response.error.message);
      const content = response.data?.choices?.[0]?.message?.content || "Hey there! Great to meet you.";
      setMessages([{ role: "assistant", content, timestamp: Date.now() }]);
    } catch {
      setMessages([{ role: "assistant", content: "Hey! Great to meet you. How's it going?", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: input.trim(), timestamp: Date.now() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("chat", {
        body: { messages: [{ role: "system", content: avatar.systemPrompt }, ...updatedMessages.map((m) => ({ role: m.role, content: m.content }))] },
      });
      if (response.error) throw new Error(response.error.message);
      const content = response.data?.choices?.[0]?.message?.content || "Could you tell me more about that?";
      setMessages((prev) => [...prev, { role: "assistant", content, timestamp: Date.now() }]);
    } catch {
      toast.error("Failed to get response. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);
    const userMessages = messages.filter((m) => m.role === "user");
    const totalFillerWords = userMessages.reduce((sum, m) => sum + countFillerWords(m.content), 0);
    if (sessionId) {
      await supabase.from("practice_sessions").update({
        transcript: messages as any, ended_at: new Date().toISOString(), duration_seconds: durationSeconds, status: "completed",
      }).eq("id", sessionId);
    }
    navigate("/report", {
      state: { messages, scenario: scenario.title, avatarName: avatar.name, avatarPersonality: avatar.personality, scenarioType: scenario.type, sessionId, fillerWordsCount: totalFillerWords, durationSeconds },
    });
  };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  // Simulated live metrics
  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const confidence = Math.min(95, 50 + userMsgCount * 8);
  const clarity = Math.min(90, 55 + userMsgCount * 7);
  const engagement = Math.min(92, 60 + userMsgCount * 6);
  const tone = Math.min(88, 58 + userMsgCount * 5);

  return (
    <div className="h-screen flex bg-background">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-border bg-card px-4 flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/scenarios")} className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{scenario.title}</p>
            <p className="text-xs text-muted-foreground truncate">{avatar.name} · {avatar.personality}</p>
          </div>
          {sessionStarted && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {mins}:{secs.toString().padStart(2, "0")}
              </div>
              <Button size="sm" variant="destructive" onClick={endSession}>
                <StopCircle className="w-3.5 h-3.5 mr-1" /> End Session
              </Button>
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          {!sessionStarted ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-4xl">{avatar.emoji}</span>
              </div>
              <h2 className="text-xl font-bold mb-1">{avatar.name}</h2>
              <p className="text-sm text-primary font-medium mb-1">{avatar.personality}</p>
              <p className="text-muted-foreground mb-6 text-sm">{avatar.description}</p>
              <div className="flex gap-3">
                <Button onClick={startSession} className="btn-gradient text-primary-foreground border-0">
                  <Sparkles className="w-4 h-4 mr-2" /> Start Conversation
                </Button>
                <Button variant="outline" disabled>
                  <Mic className="w-4 h-4 mr-2" /> Voice (Soon)
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                      <span className="text-sm">{avatar.emoji}</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                    <span className="text-sm">{avatar.emoji}</span>
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {sessionStarted && (
          <div className="border-t border-border bg-card px-4 py-3">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your response..." disabled={isLoading} className="pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground" disabled>
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button type="submit" disabled={isLoading || !input.trim()} className="btn-gradient text-primary-foreground border-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Right panel - Live metrics */}
      {sessionStarted && (
        <div className="hidden lg:block w-72 border-l border-border bg-card p-5 space-y-5 overflow-y-auto shrink-0">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Feedback</h3>
          {[
            { label: "Confidence", value: confidence, color: "bg-primary" },
            { label: "Clarity", value: clarity, color: "bg-accent" },
            { label: "Engagement", value: engagement, color: "bg-success" },
            { label: "Tone", value: tone, color: "bg-info" },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-semibold">{metric.value}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${metric.color}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages</span>
                <span className="font-medium">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Responses</span>
                <span className="font-medium">{userMsgCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{mins}:{secs.toString().padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
