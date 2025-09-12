import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitFormButton from "@/components/submit-form-button";
import {
  AuthenticationForm,
  authenticationSchema,
} from "./auth-form.validation";
import AuthPasswordFieldInput from "./auth-password-input";
import AuthEmailFieldInput from "./auth-email-input";
import { useRegister } from "@/hooks/auth/register/use-register";
import { useLogin } from "@/hooks/auth/login/use-login";

interface AuthFormProps {
  variant: "login" | "register";
}

export default function AuthForm({ variant }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: register } = useRegister();
  const { mutate: login } = useLogin();

  const form = useForm<AuthenticationForm>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: AuthenticationForm) => {
    setIsSubmitting(true);

    if (variant === "login") {
      login(data, {
        onSuccess: () => {
          form.reset();
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
    } else {
      register(data, {
        onSuccess: () => {
          form.reset();
          setIsSubmitting(false);
        },
        onError: () => {
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
        <div className="px-6 space-y-4">
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
        </div>
        <div className="flex items-center px-6 [.border-t]:pt-6 mt-4">
          <SubmitFormButton
            buttonText={variant === "login" ? "Sign in" : "Sign up"}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
