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
import { Form } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import FormInputError from "@/components/form-input-error";
import { AnimatePresence } from "motion/react";
import {
  JoinOrganizationForm,
  joinOrganizationSchema,
} from "./validators/join-organization.validation";
import { useJoinOrganization } from "@/hooks/organization/use-join-organization";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useNotification } from "@/hooks/use-notification";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

const joinOrganizationErrorMap: Record<number, { message: string }> = {
  404: {
    message:
      "Organization not found. Please check the invite code and try again.",
  },
};

export function JoinOrganizationDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: joinOrganization } = useJoinOrganization();
  const currentUser = useCurrentUser();
  const { showError, showSuccess } = useNotification();
  const queryClient = useQueryClient();

  const form = useForm<JoinOrganizationForm>({
    resolver: zodResolver(joinOrganizationSchema),
    mode: "onChange",
    defaultValues: {
      inviteCode: "",
    },
  });

  const handleJoin = (data: JoinOrganizationForm) => {
    const payload = {
      inviteCode: data.inviteCode,
      userId: currentUser.data!.id,
      name: data.name,
    };

    joinOrganization(payload, {
      onSuccess: () => {
        showSuccess("Successfully joined the organization");
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
      onError: (error) => {
        const axiosError = error as AxiosError;
        if (axiosError.status) {
          showError(joinOrganizationErrorMap[axiosError.status]?.message);
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

  const errorCode = form.formState.errors.inviteCode?.message;
  const errorName = form.formState.errors.name?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Join Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Organization</DialogTitle>
          <DialogDescription>
            Enter the organization code to join an existing organization. Ask
            organization manager for the code.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleJoin)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Provide user name" {...field} />
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
              name="inviteCode"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Organization Code *</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={8} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-10" />
                        <InputOTPSlot index={1} className="w-12 h-10" />
                        <InputOTPSlot index={2} className="w-12 h-10" />
                        <InputOTPSlot index={3} className="w-12 h-10" />
                        <InputOTPSlot index={4} className="w-12 h-10" />
                        <InputOTPSlot index={5} className="w-12 h-10" />
                        <InputOTPSlot index={6} className="w-12 h-10" />
                        <InputOTPSlot index={7} className="w-12 h-10" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <AnimatePresence>
                    {errorCode && (
                      <FormInputError message={String(errorCode)} />
                    )}
                  </AnimatePresence>
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
                Join
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
