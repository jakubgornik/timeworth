import { Card } from "@/components/ui/card";
import { formContainerVariants } from "@/lib/animation-variants";
import { motion } from "motion/react";
import SignUpForm from "./signup-form";
import SignUpFormCardHeader from "./signup-form-car-header";
import SignUpFormCardInfo from "./signup-form-card-info";

export function SignUpFormCard() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl backdrop-blur-sm">
          <SignUpFormCardHeader />
          <SignUpForm />
          <SignUpFormCardInfo />
        </Card>
      </motion.div>
    </div>
  );
}
