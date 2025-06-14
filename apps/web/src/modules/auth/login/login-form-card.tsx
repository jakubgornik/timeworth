import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

import AuthForm from "../auth-form";
import LoginFormCardHeader from "./login-form-card-header";
import LoginFormCardInfo from "./login-form-card-info";
import {
  formContainerVariants,
  demoCardVariants,
} from "@/lib/animations/animation-variants";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/login/use-login";
import { AuthenticationFormSchema } from "../auth-form.validation";

export function LoginFormCard() {
  const { mutate: login } = useLogin();

  const demoAccountdata: AuthenticationFormSchema = {
    email: "",
    password: "",
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
        className="flex-col space-y-2 w-full max-w-md"
      >
        <Card className="border-none shadow-xl backdrop-blur-sm">
          <LoginFormCardHeader />
          <AuthForm variant="login" />
          <LoginFormCardInfo />
        </Card>
        {/* TODO: create demo account, fetch from db */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={demoCardVariants}
        >
          <Card className="max-w-2/3 mx-auto flex flex-row items-center justify-center  py-2 px-4 border-0">
            <span className="text-sm text-center font-medium">
              Use demo account
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                login(demoAccountdata, {
                  onSuccess: () => {
                    // todo add notification
                  },
                  onError: () => {
                    // todo add notification
                  },
                })
              }
            >
              Sign in
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
