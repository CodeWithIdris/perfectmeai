import type { Message } from "./ChatMessages";

interface Props {
  messages: Message[];
  elapsed: number;
}

export const LiveMetrics = ({ messages, elapsed }: Props) => {
  const userMsgCount = messages.filter((m) => m.role === "user").length;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const confidence = Math.min(95, 50 + userMsgCount * 8);
  const clarity = Math.min(90, 55 + userMsgCount * 7);
  const engagement = Math.min(92, 60 + userMsgCount * 6);
  const tone = Math.min(88, 58 + userMsgCount * 5);

  const metrics = [
    { label: "Confidence", value: confidence, color: "bg-primary" },
    { label: "Clarity", value: clarity, color: "bg-accent" },
    { label: "Engagement", value: engagement, color: "bg-success" },
    { label: "Tone", value: tone, color: "bg-info" },
  ];

  return (
    <div className="hidden lg:block w-72 border-l border-border bg-card p-5 space-y-5 overflow-y-auto shrink-0">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Feedback</h3>
      {metrics.map((metric) => (
        <div key={metric.label}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-semibold">{metric.value}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${metric.color}`} style={{ width: `${metric.value}%` }} />
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
  );
};
