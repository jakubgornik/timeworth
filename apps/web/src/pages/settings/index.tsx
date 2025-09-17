import { Card } from "@/components/ui/card";
import SectionWrapper from "@/components/section-wrapper";
import SectionHeader from "@/components/section-header";
import { OrganizationInfoCard } from "@/modules/settings/organization-info-card";
import { OrganizationInviteCodeCard } from "@/modules/settings/organization-invite-code-card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useGetOrganization } from "@/hooks/organization/use-get-organization";

export default function SettingsPage() {
  const currentUser = useCurrentUser();

  const { data: organizationData } = useGetOrganization(currentUser.data!.id);

  return (
    <>
      <SectionHeader title="Settings Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:space-x-4 space-y-4 lg:space-y-0 items-start px-6">
            <OrganizationInfoCard data={organizationData} />
            <OrganizationInviteCodeCard
              inviteCode={organizationData?.inviteCode}
            />
          </div>
        </Card>
      </SectionWrapper>
    </>
  );
}
