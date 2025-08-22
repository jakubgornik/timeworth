import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useState } from "react";
import { useListedOrganizationUsers } from "@/hooks/user/use-listed-organization-users";

interface UserSelectorProps {
  selectedUserId?: string;
  onSelectUser: (userId?: string) => void;
}

export function UserSelector({
  selectedUserId,
  onSelectUser,
}: UserSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: users } = useListedOrganizationUsers({
    organizationId: currentUser!.organization!.id,
  });

  const selectedUser = users?.find((user) => user.id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
        >
          <span className="truncate text-left mr-2">
            {selectedUser ? selectedUser.name : "All Users"}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[220px] custom-scrollbar p-0 bg-popover border-border text-popover-foreground rounded-lg shadow-xl"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search user..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all-users"
                onSelect={() => {
                  onSelectUser(undefined);
                  setOpen(false);
                }}
                className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <span className="truncate mr-2">All Users</span>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4 shrink-0",
                    selectedUserId === undefined ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name}
                  onSelect={() => {
                    onSelectUser(user.id);
                    setOpen(false);
                  }}
                  className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  title={user.name}
                >
                  <span className="truncate mr-2">{user.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0",
                      selectedUserId === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )) || []}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
