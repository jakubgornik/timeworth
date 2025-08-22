import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, Activity } from "lucide-react";
import { useState } from "react";
import { WorkEntriesChartTab } from "./tabs/work-trends-chart-tab/work-entries-chart-card/work-entries-chart-tab";
import { WorkEntriesHeatmapTab } from "./tabs/work-entries-heatmap-tab/work-entries-heatmap-tab";
import { WorkEntriesTodayTab } from "./tabs/work-entries-today-tab/work-entries-today";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("charts");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-center mb-8">
        <TabsList>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Heat Map
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Today's Activity
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="charts" className="space-y-8 px-6">
        <WorkEntriesChartTab />
      </TabsContent>
      <TabsContent value="heatmap" className="space-y-8 px-6">
        <WorkEntriesHeatmapTab />
      </TabsContent>
      <TabsContent value="activity" className="space-y-8 px-6">
        <WorkEntriesTodayTab />
      </TabsContent>
    </Tabs>
  );
}
