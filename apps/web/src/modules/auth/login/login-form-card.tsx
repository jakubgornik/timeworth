import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

import AuthForm from "../auth-form";
import LoginFormCardHeader from "./login-form-card-header";
import LoginFormCardInfo from "./login-form-card-info";
import { formContainerVariants } from "@/lib/animations/animation-variants";

export function LoginFormCard() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl backdrop-blur-sm">
          <LoginFormCardHeader />
          <AuthForm variant="login" />
          <LoginFormCardInfo />
        </Card>
      </motion.div>
    </div>
  );
}
