import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Optional module kicker, e.g. "MOD_05 // THEME_QA" */
  module?: string;
  /** Optional right-aligned status meta string in the header */
  meta?: string;
}

export function DashboardLayout({ children, module, meta }: DashboardLayoutProps) {
  const now = new Date();
  const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        {/* Ambient aurora */}
        <div className="fixed inset-0 pointer-events-none -z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[160px] bg-primary/[0.08]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[160px] bg-accent/[0.08]" />
        </div>

        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Terminal header strip */}
          <header className="relative h-14 flex items-center border-b border-white/5 bg-card/40 backdrop-blur-xl px-4 justify-between">
            {/* Corner brackets */}
            <span className="absolute top-1.5 left-1.5 w-2 h-2 border-l border-t border-primary/40" aria-hidden />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 border-r border-t border-primary/40" aria-hidden />

            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              {module && (
                <>
                  <span className="hidden sm:block w-px h-4 bg-white/10" />
                  <span className="hidden sm:inline font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground truncate">
                    <span className="text-primary/70">▸</span> {module}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {meta && (
                <span className="hidden md:inline font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  {meta}
                </span>
              )}
              <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))] animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Live · {ts}
                </span>
              </div>
            </div>

            {/* Hairline gradient underline */}
            <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden />
          </header>

          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>

          {/* Terminal footer strip */}
          <footer className="relative border-t border-white/5 bg-card/30 backdrop-blur-xl px-4 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" aria-hidden />
            <div className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              <span>PerfectMe // v0.4.0</span>
              <span className="hidden sm:inline opacity-50">·</span>
              <span className="hidden sm:inline opacity-70">{module || "RUNTIME"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="opacity-70">{ts}</span>
              <span className="opacity-50">·</span>
              <span className="text-accent/70">SYS_OK</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
