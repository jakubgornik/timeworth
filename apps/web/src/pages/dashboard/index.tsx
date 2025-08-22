import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import { Card } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useMemo } from "react";
import { useIsUserManager } from "@/hooks/user/use-is-user-manager";
import OnboardingContent from "@/modules/dashboard/onboarding-content";
import WorkEntriesTimetable from "@/modules/dashboard/work-entries-timetable";
import ManagerDashboard from "@/modules/dashboard/manager-dashboard";

export default function DashboardPage() {
  const currentUser = useCurrentUser();

  const userIsOnboarded = useMemo(
    () => !!currentUser.data?.organization,
    [currentUser.data?.organization]
  );

  const isManager = useIsUserManager();

  const renderDashboardContent = () => {
    if (!userIsOnboarded) {
      return <OnboardingContent />;
    }

    if (isManager) {
      return <ManagerDashboard />;
    }

    return <WorkEntriesTimetable />;
  };

  return (
    <>
      <SectionHeader title="Dashboard Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          {renderDashboardContent()}
        </Card>
      </SectionWrapper>
    </>
  );
}
