import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Mic, MicOff, ArrowLeft, Loader2, StopCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const scenarioTitles: Record<string, string> = {
  "software-engineer": "Software Engineer Interview",
  "marketing-manager": "Marketing Manager Interview",
  "sales-associate": "Sales Associate Interview",
  "product-manager": "Product Manager Interview",
  "data-scientist": "Data Scientist Interview",
  "ux-designer": "UX Designer Interview",
};

const Practice = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const title = scenarioTitles[scenarioId || ""] || "Interview Practice";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = async () => {
    setSessionStarted(true);
    setIsLoading(true);

    const systemMessage = `You are an experienced interviewer conducting a ${title}. Start by greeting the candidate warmly, then ask your first interview question. Ask one question at a time. React naturally to responses — ask follow-up questions when appropriate. Be professional but friendly. After 5-7 questions, wrap up the interview naturally.`;

    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: "I'm ready to begin the interview." },
          ],
        },
      });

      if (response.error) throw new Error(response.error.message);
      const data = response.data;
      const assistantMessage = data?.choices?.[0]?.message?.content || "Hello! Thank you for coming in today. Let's get started with your interview. Could you tell me a little about yourself and what drew you to this role?";
      
      setMessages([{ role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("Error starting session:", error);
      setMessages([{
        role: "assistant",
        content: "Hello! Thank you for joining us today. Let's get started with your interview. Could you begin by telling me about yourself and why you're interested in this role?",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const systemMessage = `You are an experienced interviewer conducting a ${title}. Ask one question at a time. React naturally to responses with follow-ups. Be professional but friendly. After 5-7 questions total, wrap up naturally.`;

    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: systemMessage },
            ...updatedMessages,
          ],
        },
      });

      if (response.error) throw new Error(response.error.message);
      const data = response.data;
      const content = data?.choices?.[0]?.message?.content || "Could you elaborate on that?";
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I appreciate that response. Let me ask you another question — what do you consider your greatest professional strength?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = () => {
    navigate("/report", { state: { messages, scenario: title } });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">AI Interviewer</p>
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
            <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mb-6 soft-shadow">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You'll practice with an AI interviewer who asks realistic questions and reacts naturally. Ready?
            </p>
            <div className="flex gap-3">
              <Button onClick={startSession} className="btn-gradient text-primary-foreground border-0 soft-shadow">
                <MessageCircle className="w-4 h-4 mr-2" /> Start Text Interview
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
                <div
                  className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
