import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import SubmitFormButton from "@/components/submit-form-button";
import {
  AuthenticationFormSchema,
  authenticationSchema,
} from "./signup-form.validation";
import SignupPasswordFieldInput from "./inputs/signup-password-input";
import SignupEmailFieldInput from "./inputs/signup-email-input";
import { useRegister } from "@/lib/hooks/auth/register/use-register";

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: register } = useRegister();

  const form = useForm<AuthenticationFormSchema>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: AuthenticationFormSchema) => {
    setIsSubmitting(true);

    register(data, {
      onSuccess: () => {
        form.reset();
        setIsSubmitting(false);
      },
      onError: () => {
        // todo add notification
        setIsSubmitting(false);
      },
    });
  };

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <SignupEmailFieldInput
            control={form.control}
            name="email"
            error={emailError}
          />
          <SignupPasswordFieldInput
            control={form.control}
            name="password"
            label="Password"
            error={passwordError}
          />
        </CardContent>
        <CardFooter className="mt-4">
          <SubmitFormButton buttonText="Sign Up" isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Form>
  );
}
