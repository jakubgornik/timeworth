import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import FormInputError from "../../components/form-input-error";
import SubmitFormButton from "@/components/submit-form-button";
import {
  AuthenticationFormSchema,
  authenticationSchema,
} from "./signup-form.validation";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setTimeout(() => {
      console.log(data);
      setIsSubmitting(false);
    }, 1500);
  };

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField
            name="email"
            control={form.control}
            // TODO exctract
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>

                <div className="min-h-[1.5rem]">
                  <AnimatePresence>
                    {emailError && (
                      <FormInputError message={String(emailError)} />
                    )}
                  </AnimatePresence>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            // TODO exctract
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <div className="min-h-[1.5rem]">
                  <AnimatePresence>
                    {passwordError && (
                      <FormInputError message={String(passwordError)} />
                    )}
                  </AnimatePresence>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="mt-4">
          <SubmitFormButton buttonText="Sign Up" isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Form>
  );
}
