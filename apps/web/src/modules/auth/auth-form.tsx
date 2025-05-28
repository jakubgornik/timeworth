import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import SubmitFormButton from "@/components/submit-form-button";
import {
  AuthenticationFormSchema,
  authenticationSchema,
} from "./auth-form.validation";
import { useRegister } from "@/lib/hooks/auth/register/use-register";
import AuthPasswordFieldInput from "./auth-password-input";
import AuthEmailFieldInput from "./auth-email-input";
import { useLogin } from "@/lib/hooks/auth/login/use-login";

interface AuthFormProps {
  variant: "login" | "register";
}

export default function AuthForm({ variant }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: register } = useRegister();
  const { mutate: login } = useLogin();

  const form = useForm<AuthenticationFormSchema>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: AuthenticationFormSchema) => {
    setIsSubmitting(true);

    if (variant === "login") {
      console.log("Logging in with data:", data);
      login(data, {
        onSuccess: () => {
          form.reset();
          setIsSubmitting(false);
        },
        onError: () => {
          // todo add notification
          setIsSubmitting(false);
        },
      });
    } else {
      console.log("Registering with data:", data);
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
    }
  };

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <AuthEmailFieldInput
            control={form.control}
            name="email"
            error={emailError}
          />
          <AuthPasswordFieldInput
            control={form.control}
            name="password"
            label="Password"
            error={passwordError}
          />
        </CardContent>
        <CardFooter className="mt-4">
          <SubmitFormButton
            buttonText={variant === "login" ? "Sign in" : "Sign up"}
            isSubmitting={isSubmitting}
          />
        </CardFooter>
      </form>
    </Form>
  );
}
