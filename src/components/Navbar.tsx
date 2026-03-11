import { motion } from "framer-motion";
import { MessageCircle, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center soft-shadow">
            <MessageCircle className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">PerfectMe</span>
        </Link>

        {!isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="btn-gradient text-primary-foreground border-0 soft-shadow">
                Get Started
              </Button>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Log out
            </Button>
          </div>
        )}

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-muted-foreground">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border/50 px-4 py-4 space-y-3 bg-background"
        >
          {!isAuthenticated ? (
            <>
              <Link to="/auth" className="block text-sm font-medium" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/auth?mode=signup" className="block text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block text-sm font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="block text-sm text-muted-foreground" onClick={handleLogout}>Log out</button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
