import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save } from "lucide-react";
import { InfoRow } from "./info-row";

interface OrganizationInfoCardProps {
  data: {
    inviteCode: string;
    managerId: string;
    industry: string;
    size: string;
    address: string;
  };
  editing: boolean;
  onEditToggle: (editing: boolean) => void;
  onSave: () => void;
}

export const OrganizationInfoCard = ({
  data,
  editing,
  onEditToggle,
  onSave,
}: OrganizationInfoCardProps) => {
  return (
    <Card className="md:col-span-2 bg-background border-muted-foreground/20 p-0">
      <CardHeader className="flex items-center justify-between px-4 pt-4">
        <CardTitle className="text-sm font-semibold">Organization</CardTitle>
        <div className="flex items-center gap-2">
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-muted-foreground/10">
          <InfoRow label="Manager ID" value={data.managerId} />
          <InfoRow label="Industry" value={data.industry} />
          <InfoRow label="Size" value={data.size} />
          <InfoRow label="Address" value={data.address} />
        </div>
      </CardContent>
    </Card>
  );
};
