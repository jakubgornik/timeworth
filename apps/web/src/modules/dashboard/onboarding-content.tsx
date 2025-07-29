import { DialogCard } from "@/components/dialog-card";
import { CardContent, CardHeader } from "@/components/ui/card";
import { JoinOrganizationDialog } from "./dialogs/join-organization-dialog";
import { CreateOrganizationDialog } from "./dialogs/create-organization-dialog";

export default function OnboardingContent() {
  return (
    <>
      <CardHeader className="text-2xl font-bold flex-col text-center flex gap-2 items-center justify-center mb-4">
        Welcome to the Dashboard
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row justify-around gap-5 px-4 sm:px-8 lg:px-12">
        <DialogCard
          title="Are you part of an Organization?"
          description="To access dashboard, please join an organization. If you don't have an organization code, please contact your organization manager."
          dialog={<JoinOrganizationDialog />}
        />

        <DialogCard
          title="Are you Organization manager?"
          description="If you are the manager of an organization, you can create a new organization and invite members to join. Please provide the necessary details to set up your organization."
          dialog={<CreateOrganizationDialog />}
        />
      </CardContent>
    </>
  );
}
