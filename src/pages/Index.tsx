import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageCircle, Mic, BarChart3, Users, Sparkles, ArrowRight,
} from "lucide-react";

const features = [
  { icon: Users, title: "Realistic AI Partners", description: "Specimen-grade avatars that behave like real interviewers, dates, colleagues.", tag: "01" },
  { icon: Mic, title: "Voice & Text Modes", description: "Speak out loud or type — your comfort, your cadence.", tag: "02" },
  { icon: BarChart3, title: "Detailed Feedback", description: "Clarity, confidence, fillers, structure — quantified per turn.", tag: "03" },
  { icon: Sparkles, title: "AI-Powered Coaching", description: "Personalized suggestions calibrated to your performance patterns.", tag: "04" },
];

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 md:p-6 selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* Aurora + scanlines */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[160px] bg-primary/10" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[160px] bg-accent/10" />
        <div className="absolute inset-0 scanlines opacity-40" />
      </div>

      <main className="relative w-full max-w-6xl grid grid-cols-12 gap-0 glass rounded-[2.5rem] overflow-hidden">
        {/* Header Bar */}
        <div className="col-span-12 border-b border-white/5 p-6 flex justify-between items-center bg-white/[0.02] z-20">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent via-primary to-indigo-600 p-[1px] neon-glow">
              <div className="w-full h-full rounded-[15px] bg-background flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <span className="font-display text-2xl font-extrabold tracking-tight">
              Perfect<span className="text-primary">Me</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-white/[0.03] px-5 py-2.5 rounded-2xl border border-white/5">
              <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))] animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">1,240 Syncing</span>
            </div>
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">Log in</Button>
            </Link>
          </div>
        </div>

        {/* Hero — Left */}
        <div className="col-span-12 lg:col-span-7 p-8 md:p-12 lg:p-16 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/5 rounded-full mb-8 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
            <span className="font-mono text-[11px] text-accent font-bold uppercase tracking-[0.2em]">Quest ID: LEVEL_01</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] mb-8 tracking-tighter">
            Practice{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent neon-text">
              together.
            </span>
            <br />
            Level up socially.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-md mb-10 leading-relaxed">
            Master your next interview or big date with friendly AI sidekicks. High-fidelity feedback in a zero-pressure space.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/auth?mode=signup">
              <Button
                size="lg"
                className="group relative px-8 py-6 bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground font-display font-extrabold text-base rounded-2xl border border-white/10 neon-glow hover:translate-y-[-2px] transition-all"
              >
                Start Adventure
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 bg-white/[0.03] border-white/10 text-foreground/90 font-display font-bold text-base rounded-2xl hover:bg-white/[0.08] backdrop-blur-md"
              >
                Watch Tutorial
              </Button>
            </Link>
          </div>
        </div>

        {/* Device Preview — Right */}
        <div className="col-span-12 lg:col-span-5 bg-white/[0.01] p-8 lg:p-10 flex items-center justify-center relative border-t lg:border-t-0 lg:border-l border-white/5 min-h-[520px]">
          {/* Floating Score Badge */}
          <div className="absolute top-8 right-8 z-30 glass-strong px-5 py-3 rounded-2xl flex flex-col items-center gap-1 -rotate-6 animate-float">
            <span className="font-mono text-[10px] font-bold text-primary">COMBO_STRK</span>
            <span className="text-3xl font-extrabold text-foreground font-display">x12</span>
          </div>

          {/* Device */}
          <div className="w-full max-w-[340px] glass rounded-[3rem] p-2.5 relative card-shadow">
            <div className="bg-background/80 rounded-[2.6rem] overflow-hidden border border-white/5">
              <div className="p-6 bg-gradient-to-b from-white/[0.05] to-transparent border-b border-white/5 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-500 p-[2px] mb-4 neon-glow">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-foreground font-bold text-sm">Coach Sparky v2.0</div>
                <div className="text-[10px] font-mono text-primary/50 uppercase tracking-[0.3em] mt-1">Synthesizing...</div>
              </div>

              <div className="p-6 space-y-5">
                <div className="bg-white/[0.04] rounded-2xl rounded-tl-none p-4 border border-white/5">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    "Describe your biggest win this year using only technical verbs."
                  </p>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary/10 rounded-2xl rounded-tr-none p-4 max-w-[85%] border border-primary/20 shadow-[0_0_25px_hsl(var(--primary)/0.15)]">
                    <p className="text-sm text-primary leading-relaxed">
                      "Optimized the data pipeline and orchestrated the beta release..."
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between font-mono text-[9px] text-muted-foreground font-bold uppercase">
                    <span>Clarity Index</span>
                    <span className="text-accent">0.84</span>
                  </div>
                  <div className="h-1.5 flex gap-1.5">
                    <div className="flex-1 bg-accent rounded-full shadow-[0_0_10px_hsl(var(--accent)/0.4)]" />
                    <div className="flex-1 bg-accent rounded-full" />
                    <div className="flex-1 bg-accent rounded-full" />
                    <div className="flex-1 bg-white/10 rounded-full" />
                    <div className="flex-1 bg-white/10 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-12 bg-black/40 rounded-full px-5 flex items-center border border-white/5">
                    <span className="text-[10px] text-muted-foreground/60 font-mono tracking-widest">LISTENING...</span>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center neon-glow hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vibe Check Bars */}
          <div className="absolute bottom-8 left-8 z-30 glass-strong p-5 rounded-3xl rotate-3">
            <div className="flex items-end gap-1.5 h-10">
              <div className="w-2 h-4 bg-accent/30 rounded-t-sm" />
              <div className="w-2 h-7 bg-accent/50 rounded-t-sm" />
              <div className="w-2 h-10 bg-primary rounded-t-sm shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
              <div className="w-2 h-6 bg-indigo-500 rounded-t-sm" />
              <div className="w-2 h-9 bg-indigo-600 rounded-t-sm" />
            </div>
            <div className="mt-3 text-[9px] font-bold text-muted-foreground text-center font-mono uppercase tracking-[0.2em]">Vibe_Check</div>
          </div>
        </div>

        {/* Features strip */}
        <div className="col-span-12 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`p-6 lg:p-8 group hover:bg-white/[0.03] transition-colors ${
                i < 3 ? "border-r border-white/5" : ""
              } ${i < 2 ? "border-b lg:border-b-0 border-white/5" : ""}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] font-bold text-primary">{f.tag}</span>
                <div className="h-px flex-1 bg-white/10" />
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-extrabold text-base mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="col-span-12 border-t border-white/5 p-6 flex flex-wrap gap-4 justify-between bg-black/40 items-center z-10">
          <div className="font-mono text-[10px] font-bold text-muted-foreground/60 uppercase flex flex-wrap gap-6 lg:gap-10">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary shadow-[0_0_5px_hsl(var(--primary))]" /> Social_Mode
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" /> AI_Core
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500" /> Real_Time
            </span>
          </div>
          <div className="font-mono text-[10px] font-bold text-muted-foreground/40 tracking-widest">
            SYS.V3 // SEED.8842 // STABLE_ENV
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
