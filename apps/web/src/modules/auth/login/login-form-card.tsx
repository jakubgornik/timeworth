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
import { AuthenticationForm } from "../auth-form.validation";

export function LoginFormCard() {
  const { mutate: login } = useLogin();

  const demoAccountdata: AuthenticationForm = {
    email: "test@test.com",
    password: "Testpassword123",
  };

  const demoManagerAccountdata: AuthenticationForm = {
    email: "manager@demo.com",
    password: "Managerpassword123",
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={demoCardVariants}
        >
          <Card className="py-3 mx-auto flex flex-column gap-1 items-center justify-center shadow-xl backdrop-blur-sm  border-0">
            <span className="text-sm text-center font-medium">
              Use demo account
            </span>
            <div className="py-2 flex flex-row w-full justify-around">
              <Button
                variant="outline"
                size="sm"
                onClick={() => login(demoAccountdata)}
              >
                Sign in as new user
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => login(demoManagerAccountdata)}
              >
                Sign in as existing manager
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
