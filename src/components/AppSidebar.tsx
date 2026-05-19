import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, MessageCircle, BarChart3, TrendingUp, Bot, Settings, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, tag: "01" },
  { title: "Practice", url: "/scenarios", icon: MessageCircle, tag: "02" },
  { title: "Feedback", url: "/report", icon: BarChart3, tag: "03" },
  { title: "Progress", url: "/progress", icon: TrendingUp, tag: "04" },
  { title: "AI Coach", url: "/scenarios", icon: Bot, tag: "05" },
  { title: "Settings", url: "/dashboard", icon: Settings, tag: "06" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <div className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent via-primary to-indigo-600 p-[1px] shrink-0 neon-glow">
          <div className="w-full h-full rounded-[10px] bg-sidebar flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
        </div>
        {!collapsed && (
          <span className="font-display font-extrabold text-lg tracking-tight">
            Perfect<span className="text-primary">Me</span>
          </span>
        )}
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <div className="px-3 pt-3 pb-2 font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Modules
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-xl transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/30 neon-glow"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      <button onClick={() => navigate(item.url)} className="flex items-center gap-3 w-full">
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="text-sm font-medium">{item.title}</span>
                            <span className="ml-auto font-mono text-[9px] text-muted-foreground/60">{item.tag}</span>
                          </>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-2 pb-3 font-mono text-[9px] text-muted-foreground/50 tracking-widest">
            SYS.V3 // STABLE_ENV
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <button onClick={handleLogout} className="flex items-center gap-3 w-full">
                <LogOut className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-sm">Log out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
