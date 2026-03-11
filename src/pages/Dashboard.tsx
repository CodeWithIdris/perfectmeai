import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Briefcase, Code, Megaphone, ShoppingCart, BarChart3, Palette, ArrowRight, Clock, Trophy, Target } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const scenarios = [
  { id: "software-engineer", title: "Software Engineer", icon: Code, description: "Technical and behavioral questions for engineering roles", difficulty: "Intermediate" },
  { id: "marketing-manager", title: "Marketing Manager", icon: Megaphone, description: "Strategy, campaign planning, and leadership questions", difficulty: "Intermediate" },
  { id: "sales-associate", title: "Sales Associate", icon: ShoppingCart, description: "Customer handling, negotiation, and sales strategy", difficulty: "Beginner" },
  { id: "product-manager", title: "Product Manager", icon: Briefcase, description: "Product sense, metrics, and cross-functional leadership", difficulty: "Advanced" },
  { id: "data-scientist", title: "Data Scientist", icon: BarChart3, description: "Statistics, ML concepts, and analytical problem solving", difficulty: "Advanced" },
  { id: "ux-designer", title: "UX Designer", icon: Palette, description: "Design thinking, portfolio review, and user research", difficulty: "Intermediate" },
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Hi, <span className="text-gradient">{firstName}</span> 👋
          </h1>
          <p className="text-muted-foreground">Choose a scenario and start practicing. Your confidence grows with every session.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Clock, label: "Sessions", value: "0", color: "text-primary" },
            { icon: Trophy, label: "Best Score", value: "—", color: "text-warning" },
            { icon: Target, label: "Streak", value: "0 days", color: "text-success" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-4 card-shadow text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Scenarios */}
        <h2 className="font-display text-xl font-semibold mb-5">Choose Your Interview</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 card-shadow hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer"
              onClick={() => navigate(`/practice/${scenario.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <scenario.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                  {scenario.difficulty}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{scenario.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
              <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors p-0">
                Start Practice <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
