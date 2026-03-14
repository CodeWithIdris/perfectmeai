import { Loader2 } from "lucide-react";
import type { Avatar } from "@/lib/scenarios";
import { forwardRef } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface Props {
  messages: Message[];
  avatar: Avatar;
  isLoading: boolean;
  interimTranscript?: string;
}

export const ChatMessages = forwardRef<HTMLDivElement, Props>(
  ({ messages, avatar, isLoading, interimTranscript }, ref) => (
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
      {interimTranscript && (
        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed bg-primary/60 text-primary-foreground italic">
            {interimTranscript}…
          </div>
        </div>
      )}
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
      <div ref={ref} />
    </div>
  )
);

ChatMessages.displayName = "ChatMessages";
