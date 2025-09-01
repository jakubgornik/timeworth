import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home as HomeIcon,
  LogOut as LogOutIcon,
  SidebarIcon,
  Indent,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useLogout } from "@/hooks/auth/logout/use-logout";
import clsx from "clsx";
import { ROUTES } from "@/routes/routes";
import { useIsUserManager } from "@/hooks/user/use-is-user-manager";

const items = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: HomeIcon,
  },
  {
    title: "Details",
    url: ROUTES.DETAILS,
    icon: Indent,
    isManagerRoute: true,
  },
  {
    title: "Entries",
    url: ROUTES.ENTRIES,
    icon: LayoutList,
    isManagerRoute: true,
  },
];

export function AppSidebar() {
  const { mutate: logout } = useLogout();
  const { state, open, setOpen, isMobile, setOpenMobile } = useSidebar();

  const isManager = useIsUserManager();

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(state === "expanded" ? false : true);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroup>
          {open ? (
            <SidebarGroupLabel
              className={clsx(
                "border-b flex items-center w-full",
                isMobile ? "justify-center" : "justify-between pl-2 "
              )}
            >
              {!isMobile && (
                <h1 className="text-lg font-bold text-secondary">Timeworth</h1>
              )}
              <Button size="icon" onClick={toggleSidebar}>
                <SidebarIcon />
              </Button>
            </SidebarGroupLabel>
          ) : (
            <div className="w-full flex justify-center items-center border-b py-4 h-16">
              <Button size="icon" onClick={toggleSidebar}>
                <SidebarIcon />
              </Button>
            </div>
          )}
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => !item.isManagerRoute || isManager)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isMobile ? "justify-center" : ""}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span className={isMobile ? "hidden" : ""}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={state === "collapsed" ? "Logout" : undefined}
              className="w-full cursor-pointer"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
