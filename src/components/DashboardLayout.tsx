import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
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
          <header className="h-14 flex items-center border-b border-border bg-card/40 backdrop-blur-xl px-4 justify-between">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-3 bg-white/[0.03] px-4 py-1.5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))] animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Session</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
