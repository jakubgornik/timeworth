import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface DialogCardProps {
  title: string;
  description: string;
  dialog: React.ReactNode;
}

export function DialogCard({ title, description, dialog }: DialogCardProps) {
  return (
    <Card className={`w-full flex-1 lg:max-w-lg flex flex-col`}>
      <CardHeader className="text-lg font-semibold">{title}</CardHeader>
      <CardContent className="flex items-center justify-center flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center mt-auto">{dialog}</CardFooter>
    </Card>
  );
}
