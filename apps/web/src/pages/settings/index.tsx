import { useState } from "react";
import { Card } from "@/components/ui/card";
import SectionWrapper from "@/components/section-wrapper";
import SectionHeader from "@/components/section-header";
import { OrganizationInfoCard } from "@/modules/settings/organization-info-card";
import { OrganizationInviteCodeCard } from "@/modules/settings/organization-invite-code-card";

export default function SettingsPage() {
  //mock
  const mock = {
    inviteCode: "ABC1234",
    managerId: "manager-001",
    industry: "Software",
    size: "50-100",
    address: "123 Main St, City, Country",
  };

  const [organizationData] = useState(mock);
  const [editing, setEditing] = useState(false);

  const copyInvite = () => {
    navigator.clipboard.writeText(organizationData.inviteCode || "");
  };

  const handleSave = () => {
    setEditing(false);
  };
  //   TODO endpoints, handle user settings

  return (
    <>
      <SectionHeader title="Settings Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:space-x-4 space-y-4 lg:space-y-0 items-start px-6">
            <OrganizationInfoCard
              data={organizationData}
              editing={editing}
              onEditToggle={setEditing}
              onSave={handleSave}
            />
            <OrganizationInviteCodeCard
              inviteCode={organizationData.inviteCode}
              onCopy={copyInvite}
            />
          </div>
        </Card>
      </SectionWrapper>
    </>
  );
}
