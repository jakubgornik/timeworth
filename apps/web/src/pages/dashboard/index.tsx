import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/logout/use-logout";

export default function DashboardPage() {
  const { mutate: logout } = useLogout();

  return (
    <div>
      <h1>Dashboard Page</h1>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}
