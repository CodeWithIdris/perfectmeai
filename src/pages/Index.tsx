import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle, Mic, BarChart3, Users, Sparkles, ArrowRight, CheckCircle2, Star,
} from "lucide-react";

const features = [
  { icon: Users, title: "Realistic AI Partners", description: "Practice with AI avatars that behave like real people — interviewers, dates, colleagues." },
  { icon: Mic, title: "Voice & Text Modes", description: "Choose your comfort level. Chat via text or practice speaking out loud." },
  { icon: BarChart3, title: "Detailed Feedback", description: "Get scored on clarity, confidence, filler words, structure, and more." },
  { icon: Sparkles, title: "AI-Powered Coaching", description: "Personalized improvement suggestions based on your performance patterns." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">PerfectMe</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="btn-gradient text-primary-foreground border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Communication Training
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight mb-6">
                Practice conversations.{" "}
                <span className="text-gradient">Build confidence.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Train for interviews, dates, meetings, and more with intelligent AI partners. Get instant feedback on your communication skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="btn-gradient text-primary-foreground border-0 text-base px-8">
                    Start Practicing Free <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-base">Log In</Button>
                </Link>
              </div>
            </div>

            {/* Demo card */}
            <div className="relative">
              <Card className="card-shadow border-border">
                <CardContent className="p-6">
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
                    <div className="bg-muted rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                      <p className="text-sm">"Tell me about a time you led a challenging project."</p>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md p-3 max-w-[80%] ml-auto">
                      <p className="text-sm">"At my last role, I led the migration of our monolith to microservices..."</p>
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                      <p className="text-sm">"Interesting. What metrics did you use to measure success?"</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">Type your response...</div>
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mic className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="absolute -bottom-3 -right-3 card-shadow border-border">
                <CardContent className="p-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-xs font-medium">Confidence: 87%</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Everything you need to <span className="text-gradient">excel</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI platform simulates real conversations so you're never caught off guard.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title} className="card-shadow border-border hover:elevated-shadow transition-shadow">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="rounded-2xl btn-gradient p-10 sm:p-16 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to improve your communication?</h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
              Join thousands of professionals practicing with AI partners and building confidence.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90 text-base px-8">
                Get Started for Free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md btn-gradient flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">PerfectMe</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 PerfectMe. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
