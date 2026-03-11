import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { DomainCard, defaultDomains } from "@/components/DomainCard";
import { HabitsTracker } from "@/components/HabitsTracker";
import { StatsBar } from "@/components/StatsBar";
import { AIInsights } from "@/components/AIInsights";
import { WeeklyChart } from "@/components/WeeklyChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Good morning, <span className="text-gradient">James</span>
          </h1>
          <p className="text-muted-foreground">Your evolution continues. Here's where you stand today.</p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8">
          <StatsBar />
        </div>

        {/* Life Domains */}
        <div className="mb-8">
          <h2 className="font-display font-semibold text-lg mb-4">Life Domains</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {defaultDomains.map((domain, i) => (
              <DomainCard key={domain.id} domain={domain} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <HabitsTracker />
          </div>
          <div className="lg:col-span-1">
            <WeeklyChart />
          </div>
          <div className="lg:col-span-1">
            <AIInsights />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
