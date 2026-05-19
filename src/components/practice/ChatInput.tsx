import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic } from "lucide-react";

interface Props {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  interimTranscript: string;
}

export const ChatInput = ({
  input, onInputChange, onSend, isLoading,
  isListening, isSpeechSupported, onHoldStart, onHoldEnd, interimTranscript,
}: Props) => (
  <div className="border-t border-border bg-card px-4 py-3">
    <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex gap-2 max-w-2xl mx-auto items-center">
      <div className="relative flex-1">
        <Input
          value={isListening ? interimTranscript || "Listening…" : input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isListening ? "Speak now…" : "Type your response…"}
          disabled={isLoading || isListening}
        />
      </div>
      {isSpeechSupported && (
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          className={`select-none ${isListening ? "animate-pulse" : ""}`}
          onMouseDown={onHoldStart}
          onMouseUp={onHoldEnd}
          onMouseLeave={isListening ? onHoldEnd : undefined}
          onTouchStart={(e) => { e.preventDefault(); onHoldStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onHoldEnd(); }}
          disabled={isLoading}
        >
          <Mic className="w-4 h-4 mr-1.5" />
          {isListening ? "Listening…" : "Hold to Speak"}
        </Button>
      )}
      <Button type="submit" disabled={isLoading || !input.trim() || isListening} className="btn-gradient text-primary-foreground border-0">
        <Send className="w-4 h-4" />
      </Button>
    </form>
  </div>
);
