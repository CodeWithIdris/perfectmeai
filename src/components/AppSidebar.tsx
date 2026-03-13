import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, MessageCircle, BarChart3, TrendingUp, Bot, Settings, LogOut, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Practice", url: "/scenarios", icon: MessageCircle },
  { title: "Feedback", url: "/report", icon: BarChart3 },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "AI Coach", url: "/scenarios", icon: Bot },
  { title: "Settings", url: "/dashboard", icon: Settings },
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
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <div className="p-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-bold text-lg tracking-tight">PerfectMe</span>}
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <button onClick={() => navigate(item.url)} className="flex items-center gap-3 w-full">
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
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
