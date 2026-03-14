import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff } from "lucide-react";

interface Props {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isListening: boolean;
  isSpeechSupported: boolean;
  onMicToggle: () => void;
  interimTranscript: string;
}

export const ChatInput = ({
  input, onInputChange, onSend, isLoading,
  isListening, isSpeechSupported, onMicToggle, interimTranscript,
}: Props) => (
  <div className="border-t border-border bg-card px-4 py-3">
    <form onSubmit={(e) => { e.preventDefault(); onSend(); }} className="flex gap-2 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Input
          value={isListening ? interimTranscript || "Listening…" : input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isListening ? "Speak now…" : "Type your response…"}
          disabled={isLoading || isListening}
          className="pr-10"
        />
        {isSpeechSupported && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 ${
              isListening ? "text-destructive animate-pulse" : "text-muted-foreground"
            }`}
            onClick={onMicToggle}
            disabled={isLoading}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        )}
      </div>
      <Button type="submit" disabled={isLoading || !input.trim() || isListening} className="btn-gradient text-primary-foreground border-0">
        <Send className="w-4 h-4" />
      </Button>
    </form>
  </div>
);
