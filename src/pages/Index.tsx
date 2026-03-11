import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mic, BarChart3, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Realistic AI Interviewers",
    description: "Practice with AI avatars that behave like real hiring managers — with follow-up questions and natural reactions.",
  },
  {
    icon: Mic,
    title: "Voice & Text Modes",
    description: "Choose your comfort level. Chat via text or practice speaking out loud with voice conversations.",
  },
  {
    icon: BarChart3,
    title: "Detailed Feedback Reports",
    description: "Get scored on clarity, confidence, filler words, answer structure, and more after every session.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Coaching",
    description: "Receive personalized improvement suggestions based on your performance patterns over time.",
  },
];

const scenarios = [
  "Software Engineer", "Marketing Manager", "Sales Associate",
  "Product Manager", "Data Scientist", "UX Designer",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Interview Practice
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Ace Every Interview with{" "}
                <span className="text-gradient">Confidence</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Practice real conversations with intelligent AI interviewers. Get instant feedback on your communication, confidence, and delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="btn-gradient text-primary-foreground border-0 soft-shadow text-base px-8">
                    Start Practicing Free <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-base">
                    Log In
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-card rounded-2xl border border-border p-6 card-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Interviewer</p>
                    <p className="text-xs text-muted-foreground">Senior Engineering Manager</p>
                  </div>
                  <span className="ml-auto text-xs text-success font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-secondary/60 rounded-xl rounded-tl-sm p-3 max-w-[80%]">
                    <p className="text-sm">"Tell me about a time you led a challenging project. What was your approach?"</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl rounded-tr-sm p-3 max-w-[80%] ml-auto">
                    <p className="text-sm">"At my last role, I led the migration of our monolith to microservices..."</p>
                  </div>
                  <div className="bg-secondary/60 rounded-xl rounded-tl-sm p-3 max-w-[80%]">
                    <p className="text-sm">"Interesting. What metrics did you use to measure success?"</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    Type your response...
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-xl border border-border p-3 card-shadow animate-float">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-xs font-medium">Confidence: 87%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI-powered platform simulates real interview experiences so you're never caught off guard.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 card-shadow hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Scenarios */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Practice for <span className="text-gradient">Any Role</span>
            </h2>
            <p className="text-muted-foreground">Select a role and jump into a realistic interview scenario.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {scenarios.map((scenario, i) => (
              <motion.div
                key={scenario}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium card-shadow hover:border-primary/30 transition-colors cursor-pointer"
              >
                {scenario}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl btn-gradient p-10 sm:p-16 text-center"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Nail Your Next Interview?
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
              Join thousands of professionals practicing with AI interviewers and landing their dream jobs.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-base px-8">
                Get Started for Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">PerfectMe</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 PerfectMe. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
