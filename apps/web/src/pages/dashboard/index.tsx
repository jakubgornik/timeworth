import { DialogCard } from "@/components/dialog-card";
import Layout from "@/components/layout";
import SectionHeader from "@/components/section-header";
import SectionWrapper from "@/components/section-wrapper";
import DataTable from "@/components/table/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { CreateOrganizationDialog } from "@/modules/dashboard/dialogs/create-organization-dialog";
import { JoinOrganizationDialog } from "@/modules/dashboard/dialogs/join-organization-dialog";
import { useTableDemo } from "@/modules/dashboard/use-table-demo-columns";
import { useMemo } from "react";

export default function DashboardPage() {
  const currentUser = useCurrentUser();

  const userIsOnboarded = useMemo(
    () => !!currentUser.data?.organization,
    [currentUser.data?.organization]
  );

  const userIsManager = useMemo(
    () => currentUser.data?.organization?.managerId === currentUser.data?.id,
    [currentUser.data?.organization?.managerId, currentUser.data?.id]
  );
  console.log(userIsManager);
  const { columns, data, renderExpandedRow } = useTableDemo();

  return (
    <Layout>
      <SectionHeader title="Dashboard Page" />
      <SectionWrapper className="h-full">
        <Card className="w-full h-full bg-primary">
          <CardHeader className="text-2xl font-bold flex-col text-center flex gap-2 items-center justify-center mb-4">
            Welcome to the Dashboard
          </CardHeader>
          {!userIsOnboarded ? (
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
          ) : (
            <div className="flex w-full h-full p-6">
              <DataTable
                data={data}
                columns={columns}
                pageSize={10}
                enableExpanding={true}
                renderExpandedRow={renderExpandedRow}
                getRowCanExpand={(person) =>
                  !!(person.bio || person.skills || person.department)
                }
              />
            </div>
          )}
        </Card>
      </SectionWrapper>
    </Layout>
  );
}
