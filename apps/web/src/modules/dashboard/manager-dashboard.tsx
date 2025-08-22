import { DashboardTabs } from "./manger-dashboard/dashboard-tabs";

export default function ManagerDashboard() {
  return (
    <div className="bg-primary text-foreground font-sans">
      <div className="flex flex-col w-full justify-center space-y-1">
        <DashboardTabs />
      </div>
    </div>
  );
}
