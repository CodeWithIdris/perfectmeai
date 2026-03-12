import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, MessageCircle, Mic } from "lucide-react";
import { scenarios, type Scenario, type Avatar } from "@/lib/scenarios";

const ScenarioSelect = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

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
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Choose Your <span className="text-gradient">Scenario</span>
          </h1>
          <p className="text-muted-foreground">Pick a scenario, then select an AI avatar to practice with.</p>
        </motion.div>

        {/* Step 1: Scenario Selection */}
        <div className="mb-10">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full btn-gradient text-primary-foreground text-xs flex items-center justify-center font-sans font-bold">1</span>
            Select a Scenario
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map((scenario, i) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setSelectedAvatar(null);
                }}
                className={`bg-card rounded-xl border p-5 card-shadow cursor-pointer transition-all hover:shadow-lg ${
                  selectedScenario?.id === scenario.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3`}>
                  <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                </div>
                <h3 className="font-display font-semibold mb-1">{scenario.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{scenario.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Step 2: Avatar Selection */}
        <AnimatePresence mode="wait">
          {selectedScenario && (
            <motion.div
              key={selectedScenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10"
            >
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full btn-gradient text-primary-foreground text-xs flex items-center justify-center font-sans font-bold">2</span>
                Choose Your AI Partner
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {selectedScenario.avatars.map((avatar, i) => (
                  <motion.div
                    key={avatar.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`bg-card rounded-xl border p-5 card-shadow cursor-pointer transition-all hover:shadow-lg ${
                      selectedAvatar?.id === avatar.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="text-3xl mb-3">{avatar.emoji}</div>
                    <h3 className="font-display font-semibold mb-0.5">{avatar.name}</h3>
                    <p className="text-xs text-primary font-medium mb-2">{avatar.personality}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{avatar.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Start */}
        <AnimatePresence>
          {selectedAvatar && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-2xl border border-border p-6 card-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{selectedAvatar.emoji}</div>
                <div>
                  <h3 className="font-display font-semibold text-lg">{selectedAvatar.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAvatar.personality} · {selectedScenario?.title}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={startPractice} className="btn-gradient text-primary-foreground border-0 soft-shadow">
                  <MessageCircle className="w-4 h-4 mr-2" /> Start Text Session
                </Button>
                <Button variant="outline" disabled>
                  <Mic className="w-4 h-4 mr-2" /> Voice Session (Coming Soon)
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ScenarioSelect;
