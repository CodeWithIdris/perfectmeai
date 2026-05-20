import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase, Heart, Handshake, Coffee, Mic2, Sparkles, ArrowRight, MessageCircle, Mic,
} from "lucide-react";
import { scenarios, type Scenario, type Avatar } from "@/lib/scenarios";

const extraScenarios = [
  { id: "networking", title: "Networking Event", description: "Master small talk and professional introductions.", icon: Mic2, color: "text-accent" },
  { id: "public-speaking", title: "Public Speaking", description: "Practice presentations and speeches with feedback.", icon: Mic, color: "text-warning" },
  { id: "custom", title: "Custom Scenario", description: "Create your own practice scenario with AI.", icon: Sparkles, color: "text-primary" },
];

const ScenarioSelect = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [difficulty, setDifficulty] = useState<string>("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  const startPractice = () => {
    if (!selectedScenario || !selectedAvatar) return;
    navigate(`/practice/${selectedScenario.id}/${selectedAvatar.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-3 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>MOD_02 // SCENARIO_LIBRARY</span>
            <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-primary/70">{scenarios.length.toString().padStart(2, "0")} ACTIVE</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Choose a <span className="text-gradient">Scenario</span></h1>
          <p className="text-muted-foreground text-sm">Select a scenario type, then pick an AI conversation partner.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "Beginner", "Intermediate", "Advanced"].map((d) => (
            <Badge
              key={d}
              variant={difficulty === d ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                difficulty === d ? "btn-gradient text-primary-foreground border-0" : ""
              }`}
              onClick={() => setDifficulty(d)}
            >
              {d === "all" ? "All Levels" : d}
            </Badge>
          ))}
        </div>

        {/* Scenario Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all hover:elevated-shadow ${
                selectedScenario?.id === scenario.id
                  ? "ring-2 ring-primary border-primary"
                  : "border-border hover:border-primary/30"
              }`}
              onClick={() => { setSelectedScenario(scenario); setSelectedAvatar(null); }}
            >
              <CardContent className="p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                </div>
                <h3 className="font-semibold text-base mb-1">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{scenario.description}</p>
                <Button
                  size="sm"
                  variant={selectedScenario?.id === scenario.id ? "default" : "outline"}
                  className={selectedScenario?.id === scenario.id ? "btn-gradient text-primary-foreground border-0" : ""}
                >
                  {selectedScenario?.id === scenario.id ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          ))}
          {extraScenarios.map((s) => (
            <Card key={s.id} className="border-border border-dashed opacity-60 cursor-not-allowed">
              <CardContent className="p-6">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.description}</p>
                <Badge variant="secondary">Coming Soon</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Avatar Selection */}
        {selectedScenario && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Choose Your AI Partner</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {selectedScenario.avatars.map((avatar) => (
                <Card
                  key={avatar.id}
                  className={`cursor-pointer transition-all hover:elevated-shadow ${
                    selectedAvatar?.id === avatar.id
                      ? "ring-2 ring-primary border-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <CardContent className="p-5">
                    <div className="text-3xl mb-3">{avatar.emoji}</div>
                    <h3 className="font-semibold mb-0.5">{avatar.name}</h3>
                    <p className="text-xs text-primary font-medium mb-2">{avatar.personality}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{avatar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Start Session */}
        {selectedAvatar && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-4xl">{selectedAvatar.emoji}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedAvatar.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedAvatar.personality} · {selectedScenario?.title}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={startPractice} className="btn-gradient text-primary-foreground border-0">
                  <MessageCircle className="w-4 h-4 mr-2" /> Start Session <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScenarioSelect;
