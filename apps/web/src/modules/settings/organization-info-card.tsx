import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoRow } from "./info-row";
import { IOrganizationDto } from "@packages/types";

interface OrganizationInfoCardProps {
  data?: IOrganizationDto;
}

export const OrganizationInfoCard = ({ data }: OrganizationInfoCardProps) => {
  return (
    <Card className="md:col-span-2 bg-background border-muted-foreground/20 p-0">
      <CardHeader className="flex items-center justify-between px-4 pt-4">
        <CardTitle className="text-sm font-semibold">Organization</CardTitle>
        {/* TODO - editing */}
        {/* <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditToggle(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditToggle(true)}
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          )}
        </div> */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-muted-foreground/10">
          <InfoRow label="Industry" value={data?.industry ?? undefined} />
          <InfoRow label="Size" value={data?.size ?? undefined} />
          <InfoRow label="Address" value={data?.address ?? undefined} />
        </div>
      </CardContent>
    </Card>
  );
};
