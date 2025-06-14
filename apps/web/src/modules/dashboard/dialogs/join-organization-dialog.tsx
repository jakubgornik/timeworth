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

export function JoinOrganizationDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<JoinOrganizationForm>({
    resolver: zodResolver(joinOrganizationSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const handleJoin = (data: JoinOrganizationForm) => {
    console.log("Joining organization with code:", data.code);
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

  const errorCode = form.formState.errors.code?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Join Organization</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Organization</DialogTitle>
          <DialogDescription>
            Enter the organization code to join an existing organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleJoin)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
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
