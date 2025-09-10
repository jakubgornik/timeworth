import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";

interface CodeCharacterProps {
  char: string;
  index: number;
}

const CodeCharacter = ({ char, index }: CodeCharacterProps) => {
  return (
    <div
      key={index}
      className="w-8 h-10 md:w-10 md:h-12 flex items-center justify-center rounded-md border border-muted-foreground/25 bg-muted/20 text-sm md:text-base"
    >
      {char}
    </div>
  );
};

interface InviteCodeCardProps {
  inviteCode: string;
  onCopy: () => void;
}

export const OrganizationInviteCodeCard = ({
  inviteCode,
  onCopy,
}: InviteCodeCardProps) => {
  return (
    <Card className="md:col-span-1 bg-background border-muted-foreground/20 p-4">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="text-sm font-semibold">Invite Code</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={onCopy}
          aria-label="Copy invite code"
        >
          <Copy className="w-4 h-4 mr-2" /> Copy
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex gap-1 mt-3">
          {Array.from(inviteCode || "").map((char, index) => (
            <CodeCharacter key={index} char={char} index={index} />
          ))}
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Share this code to invite members.
        </div>
      </CardContent>
    </Card>
  );
};
