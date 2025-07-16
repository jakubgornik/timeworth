import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Button } from "./ui/button";
import { SidebarIcon } from "lucide-react";
import { Outlet } from "react-router";

function MainContent({ children }: { children: React.ReactNode }) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarInset>
      <nav className="flex justify-between sticky h-16 shrink-0 items-center px-4 border-b md:hidden bg-primary">
        <Button
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="mr-2"
        >
          <SidebarIcon />
        </Button>

        <h1 className="text-2xl font-bold">Timeworth</h1>
        <div className="w-8" />
      </nav>
      <main className="flex flex-1 flex-col">{children}</main>
    </SidebarInset>
  );
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </SidebarProvider>
  );
}
