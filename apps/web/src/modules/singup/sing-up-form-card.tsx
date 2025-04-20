import { Card } from "@/components/ui/card";
import { formContainerVariants } from "@/lib/animation-variants";
import { motion } from "motion/react";
import SignUpForm from "./sign-up-form";
import SingUpFormCardHeader from "./sing-up-form-car-header";
import SingUpFormCardInfo from "./sing-up-form-card-info";

export function SingUpFormCard() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl backdrop-blur-sm">
          <SingUpFormCardHeader />
          <SignUpForm />
          <SingUpFormCardInfo />
        </Card>
      </motion.div>
    </div>
  );
}
