import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, Mic } from "lucide-react";
import { getScenario, getAvatar } from "@/lib/scenarios";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { PracticeTopBar } from "@/components/practice/PracticeTopBar";
import { ChatMessages, type Message } from "@/components/practice/ChatMessages";
import { ChatInput } from "@/components/practice/ChatInput";
import { LiveMetrics } from "@/components/practice/LiveMetrics";

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

  // Speech-to-text
  const handleSpeechResult = useCallback((transcript: string) => {
    setInput((prev) => (prev ? prev + " " + transcript : transcript));
  }, []);

  const { isListening, isSupported: isSpeechSupported, interimTranscript, startListening, stopListening } =
    useSpeechRecognition({ onResult: handleSpeechResult, continuous: true });

  const toggleMic = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

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
      user_id: userId, scenario_type: scenario.type, scenario_title: scenario.title,
      avatar_id: avatar.id, avatar_name: avatar.name, avatar_personality: avatar.personality, status: "in_progress",
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
    if (isListening) stopListening();
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
    if (isListening) stopListening();
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

  return (
    <div className="h-screen flex bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <PracticeTopBar scenario={scenario} avatar={avatar} sessionStarted={sessionStarted} elapsed={elapsed} onBack={() => navigate("/scenarios")} onEnd={endSession} />

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
                {isSpeechSupported && (
                  <Button variant="outline" onClick={() => { startSession(); setTimeout(startListening, 2000); }}>
                    <Mic className="w-4 h-4 mr-2" /> Start with Voice
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ChatMessages ref={messagesEndRef} messages={messages} avatar={avatar} isLoading={isLoading} interimTranscript={isListening ? interimTranscript : undefined} />
          )}
        </div>

        {sessionStarted && (
          <ChatInput
            input={input} onInputChange={setInput} onSend={sendMessage} isLoading={isLoading}
            isListening={isListening} isSpeechSupported={isSpeechSupported} onMicToggle={toggleMic}
            interimTranscript={interimTranscript}
          />
        )}
      </div>

      {sessionStarted && <LiveMetrics messages={messages} elapsed={elapsed} />}
    </div>
  );
};

export default Practice;
