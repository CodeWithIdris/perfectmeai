import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Mic, ArrowLeft, Loader2, StopCircle } from "lucide-react";
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
    if (error) {
      console.error("Session create error:", error);
      return null;
    }
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
      : scenario.type === "date"
      ? "Hi! Nice to meet you."
      : scenario.type === "meeting"
      ? "Thank you for making time. Let's get started."
      : "Hey! What's up?";

    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: avatar.systemPrompt },
            { role: "user", content: openingPrompt },
          ],
        },
      });

      if (response.error) throw new Error(response.error.message);
      const content = response.data?.choices?.[0]?.message?.content || "Hey there! Great to meet you. How are you doing today?";
      setMessages([{ role: "assistant", content, timestamp: Date.now() }]);
    } catch (error) {
      console.error("Start error:", error);
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
        body: {
          messages: [
            { role: "system", content: avatar.systemPrompt },
            ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        },
      });

      if (response.error) throw new Error(response.error.message);
      const content = response.data?.choices?.[0]?.message?.content || "Could you tell me more about that?";
      setMessages((prev) => [...prev, { role: "assistant", content, timestamp: Date.now() }]);
    } catch (error) {
      console.error("Send error:", error);
      toast.error("Failed to get response. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);
    const userMessages = messages.filter((m) => m.role === "user");
    const totalFillerWords = userMessages.reduce((sum, m) => sum + countFillerWords(m.content), 0);

    // Update session in DB
    if (sessionId) {
      await supabase.from("practice_sessions").update({
        transcript: messages as any,
        ended_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        status: "completed",
      }).eq("id", sessionId);
    }

    navigate("/report", {
      state: {
        messages,
        scenario: scenario.title,
        avatarName: avatar.name,
        avatarPersonality: avatar.personality,
        scenarioType: scenario.type,
        sessionId,
        fillerWordsCount: totalFillerWords,
        durationSeconds,
      },
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/scenarios")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="text-2xl">{avatar.emoji}</div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{avatar.name}</p>
          <p className="text-xs text-muted-foreground">{avatar.personality} · {scenario.title}</p>
        </div>
        {sessionStarted && (
          <Button variant="outline" size="sm" onClick={endSession} className="text-destructive border-destructive/30">
            <StopCircle className="w-3.5 h-3.5 mr-1" /> End Session
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {!sessionStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="text-5xl mb-4">{avatar.emoji}</div>
            <h2 className="font-display text-2xl font-bold mb-1">{avatar.name}</h2>
            <p className="text-sm text-primary font-medium mb-1">{avatar.personality}</p>
            <p className="text-muted-foreground mb-6 max-w-md text-sm">
              {avatar.description}
            </p>
            <div className="flex gap-3">
              <Button onClick={startSession} className="btn-gradient text-primary-foreground border-0 soft-shadow">
                <MessageCircle className="w-4 h-4 mr-2" /> Start Conversation
              </Button>
              <Button variant="outline" disabled>
                <Mic className="w-4 h-4 mr-2" /> Voice (Coming Soon)
              </Button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && <span className="text-xl mr-2 mt-1">{avatar.emoji}</span>}
                <div
                  className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/10 rounded-tr-sm text-foreground"
                      : "bg-secondary/60 rounded-tl-sm text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <span className="text-xl mr-2">{avatar.emoji}</span>
                <div className="bg-secondary/60 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {sessionStarted && (
        <div className="border-t border-border bg-card/80 backdrop-blur-xl px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="btn-gradient text-primary-foreground border-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Practice;
