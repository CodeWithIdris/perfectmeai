import { motion } from "framer-motion";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-sm">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">PerfectMe</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="text-foreground font-medium">Dashboard</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Domains</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Programs</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            JD
          </div>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-muted-foreground">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border/30 px-4 py-4 space-y-3"
        >
          <a href="#" className="block text-sm text-foreground font-medium">Dashboard</a>
          <a href="#" className="block text-sm text-muted-foreground">Domains</a>
          <a href="#" className="block text-sm text-muted-foreground">Programs</a>
          <a href="#" className="block text-sm text-muted-foreground">Analytics</a>
        </motion.div>
      )}
    </motion.nav>
  );
}
