import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, StopCircle } from "lucide-react";
import type { Scenario, Avatar } from "@/lib/scenarios";

interface Props {
  scenario: Scenario;
  avatar: Avatar;
  sessionStarted: boolean;
  elapsed: number;
  onBack: () => void;
  onEnd: () => void;
}

export const PracticeTopBar = ({ scenario, avatar, sessionStarted, elapsed, onBack, onEnd }: Props) => {
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="h-14 border-b border-border bg-card px-4 flex items-center gap-3 shrink-0">
      <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
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
          <Button size="sm" variant="destructive" onClick={onEnd}>
            <StopCircle className="w-3.5 h-3.5 mr-1" /> End Session
          </Button>
        </div>
      )}
    </div>
  );
};
