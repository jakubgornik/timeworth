import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useLogout } from "@/hooks/auth/logout/use-logout";

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const { mutate: logout } = useLogout();

  return (
    <div className="relative">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-2xl font-semibold text-secondary mb-4">
              Timeworth
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="mt-auto p-4">
            <Button
              onClick={() => logout()}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
      <Button
        variant="outline"
        size="sm"
        className="bg-card absolute top-1/2 -right-[30px] transform -translate-y-1/2 z-50 rounded-r-md rounded-l-none h-[80px] w-[30px]"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
}
