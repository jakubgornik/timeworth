import { Card } from "@/components/ui/card";
import { formContainerVariants } from "@/lib/animation-variants";
import { motion } from "motion/react";

import AuthForm from "../auth-form";
import SignUpFormCardHeader from "./singup-form-card-header";
import SignUpFormCardInfo from "./signup-form-card-info";

export function SignUpFormCard() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl backdrop-blur-sm">
          <SignUpFormCardHeader />
          <AuthForm variant="register" />
          <SignUpFormCardInfo />
        </Card>
      </motion.div>
    </div>
  );
}
