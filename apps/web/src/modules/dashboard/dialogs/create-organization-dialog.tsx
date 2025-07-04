import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { AnimatePresence } from "motion/react";
import FormInputError from "@/components/form-input-error";
import {
  CreateOrganizationForm,
  createOrganizationSchema,
} from "./validators/create-organization.validation";
import { useCreateOrganization } from "@/hooks/organization/use-create-organization";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { AxiosError } from "axios";
import { useNotification } from "@/hooks/use-notification";

const createOrganizationErrorMap: Record<number, { message: string }> = {
  461: {
    message: "You can only be a member of one organization.",
  },
};

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const currentUser = useCurrentUser();
  const { mutate: createOrganization } = useCreateOrganization();
  const { showError, showSuccess } = useNotification();

  const form = useForm<CreateOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      industry: "",
      address: "",
      size: "",
    },
  });

  const handleCreate = (data: CreateOrganizationForm) => {
    const payload = {
      ...data,
      managerId: currentUser.data!.id,
    };
    createOrganization(payload, {
      onSuccess: () => {
        showSuccess("Successfully created the organization");
      },
      onError: (error) => {
        const axiosError = error as AxiosError;
        if (axiosError.status) {
          showError(createOrganizationErrorMap[axiosError.status]?.message);
        }
      },
    });

    setOpen(false);
    form.reset();
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      form.clearErrors();
    }
    setOpen(isOpen);
  };

  const errorName = form.formState.errors.name?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization name" {...field} />
                  </FormControl>
                  <AnimatePresence>
                    {errorName && (
                      <FormInputError message={String(errorName)} />
                    )}
                  </AnimatePresence>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Gradient street, 44-238" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Technology, Healthcare"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1-10, 11-50, 51-200" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
