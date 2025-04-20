import { signInTextVariants } from "@/lib/animation-variants";
import { motion } from "motion/react";

export default function SingUpFormCardInfo() {
  return (
    <motion.div
      variants={signInTextVariants}
      initial="hidden"
      animate="visible"
      className="p-4 text-center text-sm text-gray-500"
    >
      Already have an account?
      {/* TODO: change to Link comp */}
      <a href="#" className="font-medium ml-1">
        Sign in
      </a>
    </motion.div>
  );
}
